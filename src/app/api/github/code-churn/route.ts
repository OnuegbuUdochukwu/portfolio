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
      `https://api.github.com/repos/${resolvedOwner}/${resolvedRepo}/stats/code_frequency`,
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
      return Response.json({ error: "Failed to fetch code churn" }, { status: 502 });
    }

    const json = await res.json();
    const weeks = (json as [number, number, number][]).map(([weekUnix, additions, deletions]) => ({
      week: new Date(weekUnix * 1000).toISOString().split("T")[0],
      additions,
      deletions: Math.abs(deletions),
      total: additions - deletions,
    }));

    return Response.json(weeks.slice(-26));
  } catch (err) {
    console.error("Failed to fetch code churn:", err);
    return Response.json({ error: "Failed to fetch code churn" }, { status: 502 });
  }
}
