"use client";

import { useState, useEffect } from "react";

interface PRStats {
  total: number;
  open: number;
  merged: number;
  closed: number;
  drafts: number;
}

interface MergedPR {
  number: number;
  title: string;
  created: string;
  merged: string;
  url: string;
  timeToMerge: number;
}

interface PRData {
  stats: PRStats;
  avgTimeToMerge: number;
  mergeRate: number;
  recentMerged: MergedPR[];
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

function fmtHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 24) return `${Math.round(h)}h`;
  if (h < 24 * 30) return `${Math.round(h / 24)}d`;
  return `${Math.round(h / (24 * 30))}mo`;
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

export default function PRThroughput({ githubUrl }: { githubUrl: string }) {
  const [data, setData] = useState<PRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/pulls?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded bg-border/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load PR data</p>;
  if (!data) return null;

  const cards = [
    { label: "Total", value: data.stats.total, color: "#1A1A1A" },
    { label: "Merged", value: data.stats.merged, color: "#2D6A4F" },
    { label: "Open", value: data.stats.open, color: "#D4A72C" },
    { label: "Closed", value: data.stats.closed, color: "#7C7B79" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {cards.map((card) => (
          <div key={card.label} className="border border-border rounded p-2.5 text-center">
            <p className="font-mono text-[18px] font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-fg-muted mt-0.5">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 font-mono text-[10px] text-fg-muted mb-3">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm bg-accent" />
          {data.mergeRate}% merge rate
        </span>
        <span>
          ⏱ Avg {fmtHours(data.avgTimeToMerge)} to merge
        </span>
        {data.stats.drafts > 0 && (
          <span>{data.stats.drafts} drafts</span>
        )}
      </div>

      {data.recentMerged.length > 0 && (
        <div className="border border-border rounded overflow-hidden">
          {data.recentMerged.slice(0, 5).map((pr) => (
            <a
              key={pr.number}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-border/20 transition-colors duration-200"
            >
              <span className="font-mono text-[10px] text-accent shrink-0">#{pr.number}</span>
              <span className="text-[12px] text-fg truncate flex-1">{pr.title}</span>
              <span className="font-mono text-[9px] text-fg-muted shrink-0">
                {fmtHours(pr.timeToMerge)}
              </span>
              <span className="font-mono text-[9px] text-fg-muted/60 shrink-0">
                {timeAgo(pr.merged)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
