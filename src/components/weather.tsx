"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  lastUpdated: string;
}

function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Weather() {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retries = 0;
    const maxRetries = 30;

    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("API error");
        const json: WeatherData = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled && ++retries < maxRetries) {
          const delay = Math.min(30000 * retries, 300000);
          setTimeout(fetchWeather, delay);
        }
      }
    }
    fetchWeather();
    const interval = setInterval(() => { retries = 0; fetchWeather(); }, 600000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-14 h-14 bg-border rounded-full" />
        <div className="space-y-2">
          <div className="h-5 w-24 bg-border rounded" />
          <div className="h-3 w-36 bg-border rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <img
        src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
        alt={data.description}
        className="w-14 h-14 -ml-2"
      />
      <div>
        <p className="text-xl font-medium text-fg leading-none">
          {data.temp}°C
        </p>
        <p className="text-xs text-fg-muted mt-1 font-mono">
          {capitalize(data.description)}
        </p>
        <p className="text-xs text-fg-muted font-mono mt-0.5">
          Feels like {data.feels_like}°C &middot; {data.humidity}% humidity &middot; {data.wind_speed} m/s wind
        </p>
        <p className="text-[10px] text-fg-muted/60 font-mono mt-1">
          {data.city}, {data.country} &middot; updated {timeAgo(data.lastUpdated)}
        </p>
      </div>
    </div>
  );
}
