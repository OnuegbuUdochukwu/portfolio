export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: "No GITHUB_TOKEN configured" }, { status: 500 });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const userRes = await fetch("https://api.github.com/user", { headers });
    if (!userRes.ok) return Response.json({ error: "Failed to fetch user" }, { status: 502 });
    const user = await userRes.json();
    const login: string = user.login;

    const fetchRepos = async (page = 1): Promise<any[]> => {
      const res = await fetch(
        `https://api.github.com/users/${login}/repos?per_page=100&page=${page}&sort=pushed&direction=desc&type=owner`,
        { headers, next: { revalidate: 3600 } }
      );
      if (!res.ok) return [];
      const json = await res.json();
      if (!json.length) return [];
      const next = json.length === 100 ? await fetchRepos(page + 1) : [];
      return [...json, ...next];
    };

    const repos = await fetchRepos();

    const mapped = repos.map((r: any) => ({
      name: r.name,
      description: r.description || "",
      language: r.language || "",
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at,
      createdAt: r.created_at,
      url: r.html_url,
      isFork: r.fork,
      isPrivate: r.private,
      topics: r.topics || [],
    }));

    return Response.json({
      login,
      avatar: user.avatar_url,
      publicRepos: user.public_repos,
      totalStars: mapped.reduce((s, r) => s + r.stars, 0),
      repos: mapped.filter((r) => !r.isFork && !r.isPrivate).slice(0, 30),
    });
  } catch (err) {
    console.error("Failed to fetch user repos:", err);
    return Response.json({ error: "Failed to fetch user repos" }, { status: 502 });
  }
}
