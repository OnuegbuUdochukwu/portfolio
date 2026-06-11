function parseRepo(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/^\//, "").split("/");
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  let resolvedOwner: string;
  let resolvedRepo: string;

  if (url) {
    const parsed = parseRepo(url);
    if (!parsed) return Response.json({ error: "Invalid GitHub URL" }, { status: 400 });
    resolvedOwner = parsed.owner;
    resolvedRepo = parsed.repo;
  } else if (owner && repo) {
    resolvedOwner = owner;
    resolvedRepo = repo;
  } else {
    return Response.json({ error: "Provide ?url= or ?owner=&repo=" }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/dependency-graph/sbom`,
      { headers, next: { revalidate: 86400 } }
    );

    if (res.status === 404) {
      return Response.json({ error: "SBOM not available", packages: [] }, { status: 200 });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("GitHub API error:", res.status, errText);
      return Response.json({ error: "Failed to fetch dependencies" }, { status: 502 });
    }

    const json = await res.json();
    const packages: { name: string; version: string; ecosystem: string }[] = [];

    const sbomPackages = json.sbom?.packages || [];
    for (const pkg of sbomPackages) {
      const name = pkg.name || "";
      const version = pkg.versionInfo || "";
      const refs = pkg.externalRefs || [];
      const ecosystem = refs.find((r: any) => r.referenceCategory === "PACKAGE_MANAGER")
        ?.referenceLocator?.split("/")?.[0] || "unknown";
      packages.push({ name, version, ecosystem });
    }

    const byEcosystem: Record<string, { name: string; version: string }[]> = {};
    for (const pkg of packages) {
      if (!byEcosystem[pkg.ecosystem]) byEcosystem[pkg.ecosystem] = [];
      byEcosystem[pkg.ecosystem].push({ name: pkg.name, version: pkg.version });
    }

    return Response.json({
      total: packages.length,
      byEcosystem: Object.fromEntries(
        Object.entries(byEcosystem).map(([key, pkgs]) => [key, pkgs.slice(0, 50)])
      ),
    });
  } catch (err) {
    console.error("Failed to fetch dependencies:", err);
    return Response.json({ error: "Failed to fetch dependencies" }, { status: 502 });
  }
}
