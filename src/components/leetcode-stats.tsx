"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface LeetCodeData {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  lastUpdated: string;
}

const staticFallback: LeetCodeData = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  ranking: 0,
  lastUpdated: "",
};

const difficulties = [
  { key: "easySolved" as const, label: "Easy", color: "bg-[#00B8A3]" },
  { key: "mediumSolved" as const, label: "Medium", color: "bg-[#FFC01E]" },
  { key: "hardSolved" as const, label: "Hard", color: "bg-[#FF375F]" },
];

export default function LeetCodeStats() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch("/api/leetcode/stats");
        if (!res.ok) throw new Error("API error");
        const json: LeetCodeData = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const display = data || staticFallback;
  const ready = !loading;
  const total = display.totalSolved;

  return (
    <div className="w-full">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-medium text-sm text-fg">
          {ready && data ? total.toLocaleString() : <span className="opacity-50">-</span>} problems solved
        </span>
        <span className="text-xs text-fg-muted">on LeetCode</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-3">
        {difficulties.map((d) => {
          const val = display[d.key];
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div key={d.key} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${d.color}`} />
              <span className="text-xs text-fg-muted">{d.label}</span>
              <span className="text-sm text-fg font-mono">
                {ready ? val : <span className="opacity-50">-</span>}
              </span>
              {total > 0 && (
                <span className="text-[10px] text-fg-muted">({pct.toFixed(0)}%)</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full h-2 bg-border rounded-full overflow-hidden flex">
        {difficulties.map((d) => {
          const pct = total > 0 ? (display[d.key] / total) * 100 : 0;
          return pct > 0 ? (
            <div
              key={d.key}
              className={`h-full ${d.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          ) : null;
        })}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-fg-muted">
          {ready && data
            ? `Ranking: #${display.ranking.toLocaleString()}`
            : "Ranking: -"}
        </span>
        <span className="text-[10px] text-fg-muted">
          {ready && data
            ? `Updated ${timeAgo(display.lastUpdated)}`
            : ""}
        </span>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
