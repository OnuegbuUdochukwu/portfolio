"use client";

import { useState, useEffect } from "react";

interface HistogramBucket {
  key: string;
  min: number;
  max: number;
  count: number;
}

interface ClosedIssue {
  number: number;
  title: string;
  resolutionHours: number;
  url: string;
}

interface IssueData {
  total: number;
  open: number;
  closed: number;
  histogram: HistogramBucket[];
  recentClosed: ClosedIssue[];
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

export default function IssueHistogram({ githubUrl }: { githubUrl: string }) {
  const [data, setData] = useState<IssueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/issues?${params}`)
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
      <div className="space-y-1.5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-12 h-3 rounded bg-border/60 animate-pulse" />
            <div className="flex-1 h-3 rounded bg-border/40 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load issue data</p>;
  if (!data || data.closed === 0) return <p className="font-mono text-[11px] text-fg-muted/60 italic">No closed issues to analyze</p>;

  const maxCount = Math.max(...data.histogram.map((b) => b.count), 1);

  return (
    <div>
      <div className="flex items-center gap-3 font-mono text-[10px] text-fg-muted mb-3">
        <span>{data.total} total</span>
        <span>·</span>
        <span className="text-[#2D6A4F]">{data.closed} closed</span>
        {data.open > 0 && (
          <>
            <span>·</span>
            <span className="text-[#D4A72C]">{data.open} open</span>
          </>
        )}
      </div>

      <div className="space-y-1">
        {data.histogram.map((bucket) => (
          <div key={bucket.key} className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-fg-muted w-10 text-right shrink-0">
              {bucket.key}
            </span>
            <div className="flex-1 h-4 rounded bg-border/30 overflow-hidden">
              <div
                className="h-full rounded bg-accent/60 transition-all duration-500 flex items-center justify-end px-1"
                style={{ width: `${(bucket.count / maxCount) * 100}%` }}
              >
                {bucket.count > 0 && bucket.count / maxCount > 0.15 && (
                  <span className="font-mono text-[8px] text-white">{bucket.count}</span>
                )}
              </div>
            </div>
            {bucket.count / maxCount <= 0.15 && (
              <span className="font-mono text-[9px] text-fg-muted w-6 shrink-0">{bucket.count}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
