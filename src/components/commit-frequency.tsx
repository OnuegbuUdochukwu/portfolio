"use client";

import { useState, useEffect } from "react";

interface WeekData {
  week: string;
  total: number;
  owner: number;
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

const CELL = 10;
const GAP = 2;
const LABEL_W = 16;

export default function CommitFrequency({ githubUrl }: { githubUrl: string }) {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/commit-frequency?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        if (Array.isArray(json)) setWeeks(json);
        else throw new Error("Unexpected response");
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  if (!parsed) return null;
  if (loading) return <div className="h-[80px] rounded bg-border/60 animate-pulse" />;
  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load commit frequency</p>;
  if (weeks.length < 4) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Not enough data</p>;

  const maxCount = Math.max(...weeks.map((w) => w.total), 1);
  const totalCommits = weeks.reduce((s, w) => s + w.total, 0);
  const sorted = weeks.slice(-26);
  const cols = sorted.length;

  const colorScale = (count: number) => {
    if (count === 0) return "#EBE9E5";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "#BBDDC8";
    if (ratio <= 0.5) return "#7EC4A0";
    if (ratio <= 0.75) return "#3D9B6B";
    return "#2D6A4F";
  };

  const svgW = LABEL_W + cols * (CELL + GAP) + 4;
  const svgH = 7 * (CELL + GAP) + 16;

  return (
    <div>
      <div className="font-mono text-[10px] text-fg-muted mb-2">
        {totalCommits} commits across {sorted.length} weeks
      </div>
      <div className="overflow-x-auto">
        <svg width={Math.max(svgW, 200)} height={svgH} viewBox={`0 0 ${Math.max(svgW, 200)} ${svgH}`} className="font-mono">
          <text x={2} y={14} fill="#7C7B79" fontSize={8}>M</text>
          <text x={2} y={14 + 2 * (CELL + GAP)} fill="#7C7B79" fontSize={8}>W</text>
          <text x={2} y={14 + 4 * (CELL + GAP)} fill="#7C7B79" fontSize={8}>F</text>

          {Array.from({ length: cols }).map((_, colIdx) =>
            Array.from({ length: 7 }).map((_, rowIdx) => {
              const weekIdx = colIdx;
              if (weekIdx >= sorted.length) return null;
              const week = sorted[weekIdx];
              const dayCount = Math.round(week.total / 5);
              const x = LABEL_W + colIdx * (CELL + GAP);
              const y = 14 + rowIdx * (CELL + GAP);
              return (
                <rect
                  key={`${colIdx}-${rowIdx}`}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={colorScale(dayCount)}
                  opacity={0.85}
                >
                  <title>{`Week of ${week.week}: ${week.total} commits`}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
