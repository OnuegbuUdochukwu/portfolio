"use client";

import { useState, useEffect } from "react";

interface RepoInfo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  pushedAt: string;
  createdAt: string;
  url: string;
  topics: string[];
}

interface UserReposData {
  login: string;
  avatar: string;
  publicRepos: number;
  totalStars: number;
  repos: RepoInfo[];
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const LANG_DOT: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Java: "#B07219",
  "C++": "#F34B7D",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#FFAC45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89E051",
  HTML: "#E34F26",
  CSS: "#563D7C",
};

export default function CrossRepoMap() {
  const [data, setData] = useState<UserReposData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/github/user/repos")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 4, 5, 6].map((i) => (
          <div key={i} className="border border-border rounded p-3 space-y-2">
            <div className="h-3 w-24 rounded bg-border/60 animate-pulse" />
            <div className="h-3 w-full rounded bg-border/40 animate-pulse" />
            <div className="h-3 w-16 rounded bg-border/40 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load repositories</p>;
  if (!data) return null;

  return (
    <div>
      <div className="flex items-center gap-3 font-mono text-[11px] text-fg-muted mb-4">
        <span>{data.publicRepos} public repos</span>
        <span>·</span>
        <span>{data.totalStars} stars</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border rounded p-3 hover:bg-border/10 transition-colors duration-200 group"
          >
            <p className="font-mono text-[12px] text-fg group-hover:text-accent transition-colors duration-200 truncate">
              {repo.name}
            </p>
            {repo.description && (
              <p className="text-[11px] text-fg-muted mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              {repo.language && (
                <span className="font-mono text-[9px] text-fg-muted flex items-center gap-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: LANG_DOT[repo.language] || "#7C7B79" }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.stars > 0 && (
                <span className="font-mono text-[9px] text-[#D4A72C]">★ {repo.stars}</span>
              )}
              <span className="font-mono text-[9px] text-fg-muted/60 ml-auto">
                {timeAgo(repo.pushedAt)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
