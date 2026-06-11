"use client";

import { useState, useEffect } from "react";

interface CommitNode {
  sha: string;
  message: string;
  date: string;
  author: string;
  parents: string[];
}

interface BranchNode {
  name: string;
  latestSha: string;
}

interface GraphData {
  commits: CommitNode[];
  branches: BranchNode[];
  edges: { from: string; to: string }[];
  defaultBranch: string;
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

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

const ROW_H = 36;
const LANE_W = 40;
const LABEL_W = 80;
const DOT_R = 6;

function HoveredCommitInfo({ sha, commits }: { sha: string | null; commits: CommitNode[] }) {
  const c = sha ? commits.find((c) => c.sha === sha) : null;
  if (!c) return null;
  return (
    <div className="mt-2 font-mono text-[11px] text-fg-muted border-t border-border pt-2">
      <div className="flex items-start gap-4">
        <span className="text-accent">{shortSha(c.sha)}</span>
        <span className="text-fg">{c.message}</span>
        <span className="ml-auto whitespace-nowrap">{new Date(c.date).toLocaleDateString()} by {c.author || "unknown"}</span>
      </div>
    </div>
  );
}

export default function CommitGraph({
  githubUrl,
  selectedSha,
  onSelectSha,
}: {
  githubUrl: string;
  selectedSha: string | null;
  onSelectSha: (sha: string | null) => void;
}) {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [hoveredSha, setHoveredSha] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/commits?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  if (!parsed) return null;
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex gap-1.5">
          <div className="h-6 w-14 rounded bg-border/80 animate-pulse" />
          <div className="h-6 w-20 rounded bg-border/80 animate-pulse" />
        </div>
        <div className="space-y-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-border/60 animate-pulse shrink-0" />
              <div className="h-3 flex-1 rounded bg-border/60 animate-pulse" />
              <div className="w-12 h-3 rounded bg-border/40 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load commit graph</p>;
  if (!data || data.commits.length === 0) return <p className="font-mono text-[11px] text-fg-muted/60 italic">No commits found</p>;

  const filteredBranches = activeBranch
    ? data.branches.filter((b) => b.name === activeBranch)
    : data.branches;

  const branchNames = filteredBranches.map((b) => b.name);
  const laneColors = ["#2D6A4F", "#95B8A0", "#D8F3DC", "#7C7B79", "#B8B6B4"];

  const laneOf = (sha: string): number => {
    if (activeBranch) return 0;
    for (let i = 0; i < branchNames.length; i++) {
      const b = data.branches.find((br) => br.name === branchNames[i]);
      if (b?.latestSha === sha) return i;
    }
    return 0;
  };

  const sorted = [...data.commits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const svgH = Math.max(sorted.length * ROW_H + 40, 60);
  const svgW = Math.max(branchNames.length * LANE_W + LABEL_W + 100, 600);

  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        <button
          onClick={() => setActiveBranch(null)}
          className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded transition-colors duration-200 ${
            !activeBranch
              ? "bg-accent text-white"
              : "bg-border/40 text-fg-muted hover:text-fg hover:bg-border/60"
          }`}
        >
          All
        </button>
        {data.branches.map((b) => (
          <button
            key={b.name}
            onClick={() => setActiveBranch(b.name)}
            className={`font-mono text-[11px] tracking-wider px-2.5 py-1 rounded transition-colors duration-200 ${
              activeBranch === b.name
                ? "bg-accent text-white"
                : "bg-border/40 text-fg-muted hover:text-fg hover:bg-border/60"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className={`overflow-x-auto overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${showAll ? "max-h-[260px]" : "max-h-[148px]"}`}>
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="font-mono"
        >
          {(() => {
            const rowIndex = new Map<string, number>();
            const laneMap = new Map<string, number>();
            sorted.forEach((c, i) => {
              rowIndex.set(c.sha, i);
              laneMap.set(c.sha, laneOf(c.sha));
            });
            const edges: { from: string; to: string }[] = [];
            const seen = new Set<string>();
            for (const c of sorted) {
              for (const p of c.parents) {
                const key = `${c.sha}->${p}`;
                if (!seen.has(key) && rowIndex.has(p)) {
                  seen.add(key);
                  edges.push({ from: c.sha, to: p });
                }
              }
            }
            return edges.map((e) => {
              const childIdx = rowIndex.get(e.from)!;
              const parentIdx = rowIndex.get(e.to)!;
              const childLane = laneMap.get(e.from)!;
              const parentLane = laneMap.get(e.to)!;
              const y1 = 28 + childIdx * ROW_H;
              const y2 = 28 + parentIdx * ROW_H;
              const x1 = childLane * LANE_W + LABEL_W + DOT_R + 4;
              const x2 = parentLane * LANE_W + LABEL_W + DOT_R + 4;
              if (childLane === parentLane) {
                return (
                  <line
                    key={`edge-${e.from}-${e.to}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#B8B6B4"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                );
              }
              const midX = Math.max(x1, x2) + 12;
              return (
                <polyline
                  key={`edge-${e.from}-${e.to}`}
                  points={`${x1},${y1} ${midX},${y1} ${midX},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke="#B8B6B4"
                  strokeWidth={1}
                  opacity={0.4}
                />
              );
            });
          })()}
          {sorted.map((commit, i) => {
            const y = 28 + i * ROW_H;
            const lane = laneOf(commit.sha);
            const x = lane * LANE_W + LABEL_W + DOT_R + 4;
            const color = laneColors[lane % laneColors.length];
            const isHovered = hoveredSha === commit.sha;

            return (
              <g key={commit.sha}>
                <line
                  x1={LABEL_W + DOT_R + 4}
                  y1={y}
                  x2={LABEL_W + DOT_R + 4 + (branchNames.length - lane - 1) * LANE_W}
                  y2={y}
                  stroke="#D1D0CE"
                  strokeWidth={0.5}
                  strokeDasharray="2 2"
                />
                {selectedSha === commit.sha && (
                  <circle
                    cx={x}
                    cy={y}
                    r={(commit.parents.length > 1 ? 8 : DOT_R) + 3}
                    fill="none"
                    stroke="#2D6A4F"
                    strokeWidth={1.5}
                    opacity={0.6}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={commit.parents.length > 1 ? 8 : DOT_R}
                  fill={isHovered ? "#2D6A4F" : color}
                  opacity={isHovered ? 1 : 0.7}
                  className="transition-opacity duration-200"
                  onMouseEnter={() => setHoveredSha(commit.sha)}
                  onMouseLeave={() => setHoveredSha(null)}
                  onClick={() => onSelectSha(selectedSha === commit.sha ? null : commit.sha)}
                  style={{ cursor: "pointer" }}
                />
                {commit.parents.length > 1 && (
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    fill="#FAFAF8"
                    fontSize={8}
                  >
                    M
                  </text>
                )}
                <text
                  x={x + 14}
                  y={y + 4}
                  fill="#1A1A1A"
                  fontSize={12}
                  className="select-none"
                >
                  {commit.message.length > 80 ? commit.message.slice(0, 77) + "..." : commit.message}
                </text>
                <text
                  x={svgW - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#7C7B79"
                  fontSize={10}
                >
                  {timeAgo(commit.date)}
                </text>
                <a
                  href={`${githubUrl.replace(/\.git$/, "")}/commit/${commit.sha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <text
                    x={x + 14}
                    y={y + 16}
                    fill="#7C7B79"
                    fontSize={9}
                    className="hover:underline cursor-pointer"
                  >
                    {shortSha(commit.sha)}
                  </text>
                </a>
              </g>
            );
          })}
        </svg>
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-3 font-mono text-[10px] text-fg-muted/60 hover:text-fg transition-colors duration-200"
      >
        {showAll ? "Show less" : "Show more"}
      </button>

      <HoveredCommitInfo sha={hoveredSha} commits={data.commits} />
    </div>
  );
}
