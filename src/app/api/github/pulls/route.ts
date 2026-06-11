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

  function fmt(iso: string) {
    return new Date(iso).toISOString();
  }

  try {
    const fetchPRs = async (state: string) => {
      const all: any[] = [];
      let page = 1;
      while (page <= 3) {
        const res = await fetch(
          `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/pulls?state=${state}&per_page=100&page=${page}&sort=created&direction=desc`,
          { headers, next: { revalidate: 3600 } }
        );
        if (!res.ok) break;
        const json = await res.json();
        if (!json.length) break;
        all.push(...json);
        page++;
      }
      return all;
    };

    const [allPRs, mergedPRs] = await Promise.all([
      fetchPRs("all"),
      fetchPRs("closed").then((prs) => prs.filter((p) => p.merged_at)),
    ]);

    const prs = allPRs.map((p) => ({
      number: p.number,
      title: p.title,
      state: p.merged_at ? "merged" : p.state,
      created: fmt(p.created_at),
      closed: p.closed_at ? fmt(p.closed_at) : null,
      merged: p.merged_at ? fmt(p.merged_at) : null,
      draft: p.draft || false,
      url: p.html_url,
      author: p.user?.login || "",
    }));

    const merged = mergedPRs.map((p) => ({
      number: p.number,
      title: p.title,
      created: fmt(p.created_at),
      merged: fmt(p.merged_at),
      url: p.html_url,
      timeToMerge:
        (new Date(p.merged_at).getTime() - new Date(p.created_at).getTime()) /
        (1000 * 60 * 60),
    }));

    const avgTimeToMerge = merged.length
      ? merged.reduce((s, p) => s + p.timeToMerge, 0) / merged.length
      : 0;

    const total = prs.length;
    const open = prs.filter((p) => p.state === "open").length;
    const mergedCount = prs.filter((p) => p.state === "merged").length;
    const closed = prs.filter((p) => p.state === "closed").length;
    const drafts = prs.filter((p) => p.draft).length;

    return Response.json({
      stats: { total, open, merged: mergedCount, closed, drafts },
      avgTimeToMerge: Math.round(avgTimeToMerge * 10) / 10,
      mergeRate: total - open > 0 ? Math.round((mergedCount / (total - open)) * 100) : 0,
      recentMerged: merged.slice(0, 10),
    });
  } catch (err) {
    console.error("Failed to fetch PRs:", err);
    return Response.json({ error: "Failed to fetch PRs" }, { status: 502 });
  }
}
