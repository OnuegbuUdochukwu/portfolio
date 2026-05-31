"use client";

import { useEffect, useState } from "react";

interface ApiResponse {
  totalContributions: number;
  currentStreak: number;
}

const staticLine = "$ uptime: 232d · contributions: 1,428 · languages: 8 · active repos: 75";

export default function StatusLine() {
  const [line, setLine] = useState(staticLine);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch("/api/contributions");
        if (!res.ok) throw new Error("API error");
        const json: ApiResponse = await res.json();
        if (!cancelled) {
          setLine(
            `$ uptime: ${json.currentStreak}d · contributions: ${json.totalContributions.toLocaleString()} · languages: 8 · active repos: 75`
          );
          setReady(true);
        }
      } catch {
        if (!cancelled) setReady(true);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <span className="font-mono text-xs text-fg-muted">
      <span className="text-accent">$</span>{" "}
      <span className={ready ? "" : "opacity-50"}>{line.split("$ ")[1] || line}</span>
    </span>
  );
}
