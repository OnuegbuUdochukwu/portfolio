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

  try {
    const res = await fetch(
      `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/releases?per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GitHub API error:", res.status, errText);
      return Response.json({ error: "Failed to fetch releases" }, { status: 502 });
    }

    const json = await res.json();

    const releases = json.map((r: any) => ({
      id: r.id,
      tag: r.tag_name,
      name: r.name,
      body: r.body || "",
      prerelease: r.prerelease,
      draft: r.draft,
      date: r.published_at || r.created_at,
      url: r.html_url,
    }));

    return Response.json(releases);
  } catch (err) {
    console.error("Failed to fetch releases:", err);
    return Response.json({ error: "Failed to fetch releases" }, { status: 502 });
  }
}
