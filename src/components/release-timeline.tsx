"use client";

import { useState, useEffect } from "react";

interface Release {
  id: number;
  tag: string;
  name: string;
  body: string;
  prerelease: boolean;
  draft: boolean;
  date: string;
  url: string;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function extractHighlights(body: string): string[] {
  return body
    .split("\n")
    .map((l) => l.replace(/^[\s*#\-]+/, "").trim())
    .filter((l) => l.length > 10 && l.length < 120)
    .slice(0, 5);
}

export default function ReleaseTimeline({ githubUrl }: { githubUrl: string }) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/releases?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setReleases(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-0.5 h-16 bg-border/60 animate-pulse rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded bg-border/60 animate-pulse" />
              <div className="h-3 w-48 rounded bg-border/40 animate-pulse" />
              <div className="h-3 w-32 rounded bg-border/40 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load releases</p>;
  if (releases.length === 0) return <p className="font-mono text-[11px] text-fg-muted/60 italic">No releases published</p>;

  const visible = releases.filter((r) => !r.draft);

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border/60 rounded-full" />
      <div className="space-y-4">
        {visible.map((release) => {
          const highlights = expanded.has(release.id) ? extractHighlights(release.body) : [];
          return (
            <div key={release.id} className="relative pl-6">
              <div className="absolute left-[2px] top-[6px] w-3 h-3 rounded-full border-2 border-accent bg-bg" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={release.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[13px] text-fg hover:text-accent transition-colors duration-200 font-bold"
                    >
                      {release.tag}
                    </a>
                    {release.prerelease && (
                      <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4A72C]/10 text-[#D4A72C]">
                        Pre-release
                      </span>
                    )}
                  </div>
                  {release.name && release.name !== release.tag && (
                    <p className="text-[12px] text-fg-muted mt-0.5">{release.name}</p>
                  )}
                  <button
                    onClick={() => toggle(release.id)}
                    className="mt-1 font-mono text-[11px] text-fg-muted/60 hover:text-fg transition-colors duration-200 cursor-pointer"
                  >
                    {expanded.has(release.id) ? "less" : "more"}
                  </button>
                  {highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {highlights.map((h, i) => (
                        <li key={i} className="text-[12px] text-fg-muted flex items-start gap-1.5">
                          <span className="text-accent mt-1 text-[8px]">◆</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[10px] text-fg-muted whitespace-nowrap">
                  {timeAgo(release.date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
