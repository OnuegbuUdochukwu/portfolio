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
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/user", { headers, next: { revalidate: 3600 } }),
      fetch("https://api.github.com/user/repos?per_page=100&sort=pushed&type=owner", {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok) return Response.json({ error: "Failed to fetch user" }, { status: 502 });

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const publicRepos = repos.filter((r: any) => !r.fork && !r.private);
    const totalStars = publicRepos.reduce((s: number, r: any) => s + r.stargazers_count, 0);
    const totalForks = publicRepos.reduce((s: number, r: any) => s + r.forks_count, 0);
    const totalSize = publicRepos.reduce((s: number, r: any) => s + r.size, 0);
    const languages = new Set(publicRepos.map((r: any) => r.language).filter(Boolean));
    const topRepos = publicRepos
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r: any) => ({ name: r.name, stars: r.stargazers_count, url: r.html_url }));

    return Response.json({
      login: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio || "",
      company: user.company || "",
      location: user.location || "",
      blog: user.blog || "",
      twitter: user.twitter_username || "",
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      totalSize: Math.round(totalSize / 1024),
      languages: Array.from(languages).sort(),
      topRepos,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return Response.json({ error: "Failed to fetch profile" }, { status: 502 });
  }
}
