"use client";

import { useState, useEffect, useCallback } from "react";

interface TickerData {
  pair: string;
  price: string;
  changePct: string;
  high: string;
  low: string;
  volume: string;
  updatedAt: string;
}

function formatLabel(pair: string): string {
  const upper = pair.toUpperCase();
  const idx = upper.indexOf("NGN");
  return idx > 0 ? `${upper.slice(0, idx)}/${upper.slice(idx)}` : upper;
}

function formatPrice(price: string): string {
  const numeric = parseFloat(price);
  if (isNaN(numeric)) return price;
  const locale = numeric >= 1
    ? numeric.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : numeric.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 8 });
  return numeric >= 1 ? locale : locale;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function TickerWidget({ currencies }: { currencies: string[] }) {
  const [active, setActive] = useState(currencies[0]);
  const [data, setData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTicker = useCallback(async (pair: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/quidax/ticker?pair=${pair}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicker(active);
    const interval = setInterval(() => fetchTicker(active), 60000);
    return () => clearInterval(interval);
  }, [active, fetchTicker]);

  if (loading && !data) {
    return (
      <div className="space-y-2">
        <div className="flex gap-1.5">
          {currencies.map((c) => (
            <div key={c} className="h-6 w-20 rounded bg-border/60 animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-48 rounded bg-border/60 animate-pulse" />
        <div className="h-4 w-64 rounded bg-border/60 animate-pulse" />
      </div>
    );
  }

  if (error && !data) {
    return null;
  }

  if (!data) return null;

  const changeNum = parseFloat(data.changePct);
  const changeClass = changeNum > 0 ? "text-green-500" : changeNum < 0 ? "text-red-500" : "text-fg-muted";
  const changeSign = changeNum > 0 ? "+" : "";

  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {currencies.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded transition-colors duration-200 ${
              c === active
                ? "bg-accent text-white"
                : "bg-border/40 text-fg-muted hover:text-fg hover:bg-border/60"
            }`}
          >
            {formatLabel(c)}
          </button>
        ))}
      </div>

      <div className="text-3xl font-mono text-fg tabular-nums tracking-tight mb-1.5">
        &#x20A6;{formatPrice(data.price)}
      </div>

      <div className="flex items-center gap-3 text-xs text-fg-muted font-mono tabular-nums mb-1.5 flex-wrap">
        <span className={changeClass}>
          {changeSign}{data.changePct}%
        </span>
        <span className="text-fg-muted">H: &#x20A6;{formatPrice(data.high)}</span>
        <span className="text-fg-muted">L: &#x20A6;{formatPrice(data.low)}</span>
      </div>

      <div className="text-[11px] font-mono text-fg-muted/60">
        Vol: {data.volume} {formatLabel(data.pair).split("/")[0]} &middot; Updated {timeAgo(data.updatedAt)}
      </div>
    </div>
  );
}
