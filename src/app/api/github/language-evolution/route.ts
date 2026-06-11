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

interface RepoResponse {
  created_at: string;
  [key: string]: unknown;
}

interface LangResponse {
  [language: string]: number;
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
    const [repoRes, langsRes, churnRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/languages`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/stats/code_frequency`, { headers, next: { revalidate: 3600 } }),
    ]);

    if (!repoRes.ok || !langsRes.ok) {
      return Response.json({ error: "Failed to fetch repo data" }, { status: 502 });
    }

    const repoData: RepoResponse = await repoRes.json();
    const languages: LangResponse = await langsRes.json();
    const churnData: [number, number, number][] = churnRes.ok ? await churnRes.json() : [];

    const totalBytes = Object.values(languages).reduce((s, v) => s + v, 0);
    const langBreakdown = Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
      }))
      .sort((a, b) => b.bytes - a.bytes);

    const created = new Date(repoData.created_at).getTime();

    const weeks = churnData
      .filter(([ts]) => ts * 1000 >= created)
      .map(([ts, adds, dels]) => ({
        week: new Date(ts * 1000).toISOString().split("T")[0],
        additions: adds,
        deletions: Math.abs(dels),
        net: adds - dels,
      }));

    return Response.json({
      createdAt: repoData.created_at,
      languages: langBreakdown,
      totalBytes,
      weeks,
    });
  } catch (err) {
    console.error("Failed to fetch language evolution:", err);
    return Response.json({ error: "Failed to fetch language evolution" }, { status: 502 });
  }
}
