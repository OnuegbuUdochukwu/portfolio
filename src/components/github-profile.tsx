"use client";

import { useState, useEffect } from "react";

interface ProfileData {
  login: string;
  name: string;
  avatar: string;
  bio: string;
  company: string;
  location: string;
  blog: string;
  twitter: string;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalSize: number;
  languages: string[];
  topRepos: { name: string; stars: number; url: string }[];
}

export default function GitHubProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/github/user/profile")
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
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-border/60 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 rounded bg-border/60 animate-pulse" />
          <div className="h-3 w-48 rounded bg-border/40 animate-pulse" />
          <div className="flex gap-2 mt-2">
            <div className="h-8 flex-1 rounded bg-border/40 animate-pulse" />
            <div className="h-8 flex-1 rounded bg-border/40 animate-pulse" />
            <div className="h-8 flex-1 rounded bg-border/40 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return null;
  if (!data) return null;

  return (
    <div className="flex items-start gap-4">
      <img src={data.avatar} alt={data.login} className="w-10 h-10 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[13px] text-fg font-bold">{data.name || data.login}</span>
          <span className="font-mono text-[10px] text-fg-muted">@{data.login}</span>
        </div>
        {data.bio && (
          <p className="text-[12px] text-fg-muted mt-0.5 line-clamp-2">{data.bio}</p>
        )}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <StatsBadge label="repos" value={data.publicRepos} />
          <StatsBadge label="stars" value={data.totalStars} />
          <StatsBadge label="forks" value={data.totalForks} />
        </div>
        {data.topRepos.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="font-mono text-[9px] text-fg-muted uppercase tracking-wider">Top:</span>
            {data.topRepos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-accent hover:underline underline-offset-2"
              >
                {r.name}{r.stars > 0 && ` ★${r.stars}`}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsBadge({ label, value }: { label: string; value: number }) {
  return (
    <span className="font-mono text-[10px] text-fg-muted bg-border/30 px-2 py-0.5 rounded">
      {value} {label}
    </span>
  );
}
