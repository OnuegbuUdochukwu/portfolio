"use client";

import { useState, useEffect } from "react";

interface LangData {
  name: string;
  bytes: number;
  percentage: number;
}

interface WeekData {
  week: string;
  additions: number;
  deletions: number;
  net: number;
}

interface EvolutionData {
  createdAt: string;
  languages: LangData[];
  totalBytes: number;
  weeks: WeekData[];
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
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
  SCSS: "#C6538C",
  Dockerfile: "#384D54",
  Makefile: "#427819",
};

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

export default function LanguageEvolution({ githubUrl }: { githubUrl: string }) {
  const [data, setData] = useState<EvolutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/language-evolution?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  if (!parsed) return null;
  if (loading) return <div className="h-[100px] rounded bg-border/60 animate-pulse" />;
  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load language data</p>;
  if (!data) return null;

  if (data.weeks.length < 2) {
    return (
      <div className="space-y-2">
        {data.languages.map((l) => (
          <div key={l.name} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: LANG_COLORS[l.name] || "#7C7B79" }} />
            <span className="font-mono text-[11px] text-fg flex-1">{l.name}</span>
            <span className="font-mono text-[10px] text-fg-muted">{l.percentage}%</span>
            <span className="font-mono text-[9px] text-fg-muted/60">{(l.bytes / 1024).toFixed(0)}KB</span>
          </div>
        ))}
      </div>
    );
  }

  const cumulative: number[] = [];
  let running = 0;
  for (const w of data.weeks) {
    running += w.net;
    cumulative.push(Math.max(running, 0));
  }

  const maxCum = Math.max(...cumulative, 1);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const xScale = innerW / (cumulative.length - 1);
  const yScale = (v: number) => PAD.top + innerH - (v / maxCum) * innerH;

  const linePoints = cumulative.map((v, i) => `${PAD.left + i * xScale},${yScale(v)}`).join(" ");
  const areaPath = `M${PAD.left},${PAD.top + innerH} L${linePoints} L${PAD.left + (cumulative.length - 1) * xScale},${PAD.top + innerH} Z`;

  const topLangs = data.languages.slice(0, 5);

  return (
    <div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#growthGrad)" />
        <polyline points={linePoints} fill="none" stroke="#2D6A4F" strokeWidth={1.5} />
        {data.weeks.filter((_, i) => i % 8 === 0).map((w, i) => {
          const idx = data.weeks.indexOf(w);
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
              {new Date(w.week + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center gap-3 mt-1 font-mono text-[10px] text-fg-muted">
        <span>{(data.totalBytes / 1024).toFixed(0)} KB total</span>
        <span>·</span>
        <span>{data.weeks.reduce((s, w) => s + Math.max(w.net, 0), 0).toLocaleString()} additions</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {topLangs.map((l) => (
          <span key={l.name} className="font-mono text-[10px] text-fg-muted flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: LANG_COLORS[l.name] || "#7C7B79" }} />
            {l.name} {l.percentage}%
          </span>
        ))}
        {data.languages.length > 5 && (
          <span className="font-mono text-[10px] text-fg-muted/60">+{data.languages.length - 5} more</span>
        )}
      </div>
    </div>
  );
}
