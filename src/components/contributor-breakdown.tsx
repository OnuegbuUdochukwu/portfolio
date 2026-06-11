"use client";

import { useState, useEffect } from "react";

interface Contributor {
  login: string;
  avatar: string;
  url: string;
  contributions: number;
  type: string;
}

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    return null;
  } catch {
    return null;
  }
}

export default function ContributorBreakdown({ githubUrl }: { githubUrl: string }) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/contributors?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setContributors(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-border/60 animate-pulse shrink-0" />
            <div className="h-3 w-20 rounded bg-border/60 animate-pulse" />
            <div className="flex-1 h-3 rounded bg-border/40 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load contributors</p>;
  if (contributors.length === 0) return <p className="font-mono text-[11px] text-fg-muted/60 italic">No contributors</p>;

  const maxCommits = Math.max(...contributors.map((c) => c.contributions), 1);
  const humans = contributors.filter((c) => c.type === "User");

  return (
    <div className="space-y-1.5">
      {humans.map((c) => (
        <a
          key={c.login}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <img
            src={c.avatar}
            alt={c.login}
            className="w-5 h-5 rounded-full shrink-0"
          />
          <span className="font-mono text-[12px] text-fg group-hover:text-accent transition-colors duration-200 w-24 truncate">
            {c.login}
          </span>
          <div className="flex-1 h-3 rounded bg-border/30 overflow-hidden">
            <div
              className="h-full rounded bg-accent/60 transition-all duration-500"
              style={{ width: `${(c.contributions / maxCommits) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-fg-muted w-12 text-right shrink-0">
            {c.contributions}
          </span>
        </a>
      ))}
    </div>
  );
}
