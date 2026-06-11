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
    const fetchIssues = async (page = 1): Promise<any[]> => {
      const res = await fetch(
        `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/issues?state=all&per_page=100&page=${page}&sort=created&direction=desc&filter=all`,
        { headers, next: { revalidate: 3600 } }
      );
      if (!res.ok) return [];
      const json = await res.json();
      if (!json.length) return [];
      const next = json.length === 100 ? await fetchIssues(page + 1) : [];
      return [...json, ...next];
    };

    const allIssues = await fetchIssues();
    const issues = allIssues.filter((i) => !i.pull_request);

    const closed = issues
      .filter((i) => i.closed_at && i.created_at)
      .map((i) => ({
        number: i.number,
        title: i.title,
        state: i.state,
        created: new Date(i.created_at).toISOString(),
        closed: new Date(i.closed_at).toISOString(),
        resolutionHours: (new Date(i.closed_at).getTime() - new Date(i.created_at).getTime()) / (1000 * 60 * 60),
        labels: i.labels?.map((l: any) => l.name) || [],
        url: i.html_url,
      }));

    const buckets = [
      { key: "< 1h", min: 0, max: 1 },
      { key: "1-6h", min: 1, max: 6 },
      { key: "6-24h", min: 6, max: 24 },
      { key: "1-3d", min: 24, max: 72 },
      { key: "3-7d", min: 72, max: 168 },
      { key: "1-4w", min: 168, max: 672 },
      { key: "> 4w", min: 672, max: Infinity },
    ];

    const histogram = buckets.map((b) => ({
      ...b,
      count: closed.filter((i) => i.resolutionHours >= b.min && i.resolutionHours < b.max).length,
    }));

    return Response.json({
      total: issues.length,
      open: issues.filter((i) => i.state === "open").length,
      closed: closed.length,
      histogram,
      recentClosed: closed.slice(0, 10),
    });
  } catch (err) {
    console.error("Failed to fetch issues:", err);
    return Response.json({ error: "Failed to fetch issues" }, { status: 502 });
  }
}
