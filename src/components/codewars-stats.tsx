"use client";

import { useEffect, useState } from "react";

interface LanguageRank {
  rank: number;
  name: string;
  color: string;
  score: number;
}

interface CodeWarsData {
  totalCompleted: number;
  honor: number;
  leaderboardPosition: number;
  overallRank: string;
  overallScore: number;
  languages: Record<string, LanguageRank>;
  lastUpdated: string;
}

export default function CodeWarsStats() {
  const [data, setData] = useState<CodeWarsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch("/api/codewars/stats");
        if (!res.ok) throw new Error("API error");
        const json: CodeWarsData = await res.json();
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

  const ready = !loading;

  return (
    <div className="w-full">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-medium text-sm text-fg">
          {ready && data ? data.totalCompleted.toLocaleString() : <span className="opacity-50">-</span>} katas solved
        </span>
        <span className="text-xs text-fg-muted">on CodeWars</span>
      </div>

      <div className="flex flex-wrap gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-fg-muted">Honor</span>
          <span className="text-sm text-fg font-mono">
            {ready && data ? data.honor.toLocaleString() : <span className="opacity-50">-</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-xs text-fg-muted">Rank</span>
          <span className="text-sm text-fg font-mono">
            {ready && data ? data.overallRank : <span className="opacity-50">-</span>}
          </span>
        </div>
      </div>

      {ready && data && Object.keys(data.languages).length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(data.languages).map(([lang, rank]) => (
            <div key={lang} className="flex items-center gap-1.5 text-xs text-fg-muted">
              <span className="capitalize font-medium text-fg">{lang}</span>
              <span>{rank.name}</span>
              <span className="font-mono">({rank.score})</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-fg-muted">
          {ready && data
            ? `Ranking: #${data.leaderboardPosition.toLocaleString()}`
            : "Ranking: -"}
        </span>
        <span className="text-[10px] text-fg-muted">
          {ready && data ? `Updated ${timeAgo(data.lastUpdated)}` : ""}
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
