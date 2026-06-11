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
    const [participationRes, activityRes] = await Promise.all([
      fetch(
        `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/stats/participation`,
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/stats/commit_activity`,
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    const participation = participationRes.ok ? await participationRes.json() : null;
    const activity = activityRes.ok ? await activityRes.json() : null;

    const weeks: { week: string; total: number; owner: number }[] = [];

    if (participation && Array.isArray(participation.all)) {
      const now = Date.now();
      participation.all.forEach((count: number, i: number) => {
        const weekStart = new Date(now - (participation.all.length - 1 - i) * 7 * 24 * 60 * 60 * 1000);
        weeks.push({
          week: weekStart.toISOString().split("T")[0],
          total: count,
          owner: participation.owner?.[i] || 0,
        });
      });
    } else if (activity && Array.isArray(activity)) {
      activity.forEach((w: any) => {
        weeks.push({
          week: new Date(w.week * 1000).toISOString().split("T")[0],
          total: w.total || 0,
          owner: w.total || 0,
        });
      });
    }

    return Response.json(weeks);
  } catch (err) {
    console.error("Failed to fetch commit frequency:", err);
    return Response.json({ error: "Failed to fetch commit frequency" }, { status: 502 });
  }
}
