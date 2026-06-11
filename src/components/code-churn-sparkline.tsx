"use client";

import { useState, useEffect } from "react";

interface WeekData {
  week: string;
  additions: number;
  deletions: number;
  total: number;
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

const W = 400;
const H = 100;
const PAD = { top: 8, bottom: 20, left: 4, right: 4 };

export default function CodeChurnSparkline({ githubUrl }: { githubUrl: string }) {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/code-churn?${params}`)
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
  if (loading) {
    return <div className="h-[100px] rounded bg-border/60 animate-pulse" />;
  }
  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load code churn</p>;
  if (weeks.length < 2) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Not enough data</p>;

  const maxVal = Math.max(...weeks.map((w) => w.additions + w.deletions), 1);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const xScale = innerW / (weeks.length - 1);
  const yScale = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const addPoints = weeks.map((w, i) => `${PAD.left + i * xScale},${yScale(w.additions)}`).join(" ");
  const delPoints = weeks.map((w, i) => `${PAD.left + i * xScale},${yScale(w.deletions)}`).join(" ");
  const totalPoints = weeks.map((w, i) => `${PAD.left + i * xScale},${yScale(Math.max(w.total, 0))}`).join(" ");

  const bottomLine = `${PAD.left + (weeks.length - 1) * xScale},${PAD.top + innerH} ${PAD.left},${PAD.top + innerH}`;

  const addArea = `M${PAD.left},${PAD.top + innerH} L${addPoints} L${PAD.left + (weeks.length - 1) * xScale},${PAD.top + innerH} Z`;
  const delArea = `M${PAD.left},${PAD.top + innerH} L${delPoints} L${PAD.left + (weeks.length - 1) * xScale},${PAD.top + innerH} Z`;

  const totalAdd = weeks.reduce((s, w) => s + w.additions, 0);
  const totalDel = weeks.reduce((s, w) => s + w.deletions, 0);

  return (
    <div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
        <path d={delArea} fill="#9B2226" opacity={0.15} />
        <path d={addArea} fill="#2D6A4F" opacity={0.15} />
        <polyline points={delPoints} fill="none" stroke="#9B2226" strokeWidth={1} opacity={0.6} />
        <polyline points={addPoints} fill="none" stroke="#2D6A4F" strokeWidth={1.5} />
        {weeks.filter((_, i) => i % 4 === 0).map((w, i) => {
          const idx = weeks.indexOf(w);
          return (
            <text
              key={w.week}
              x={PAD.left + idx * xScale}
              y={H - 4}
              textAnchor="middle"
              fill="#7C7B79"
              fontSize={8}
              className="font-mono"
            >
              {new Date(w.week + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center gap-4 mt-1 font-mono text-[10px] text-fg-muted">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-0.5 bg-[#2D6A4F] rounded" />
          +{totalAdd.toLocaleString()} additions
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-0.5 bg-[#9B2226] rounded" />
          -{totalDel.toLocaleString()} deletions
        </span>
      </div>
    </div>
  );
}
