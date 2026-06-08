"use client";

import { useEffect, useState } from "react";

const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function wmoLabel(code: number): string {
  return WMO[code] ?? "Unknown";
}

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_code: number;
  city: string;
  country: string;
  lastUpdated: string;
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
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        setLoading(true);
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("API error");
        const json: WeatherData = await res.json();
        if (!cancelled) {
          setData(json);
          setHasError(false);
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (loading) {
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

  if (hasError) {
    return (
      <p className="text-xs text-fg-muted font-mono">
        Unable to load weather details right now.
      </p>
    );
  }

  if (!data) return null;

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-xl font-medium text-fg leading-none">
          {data.temp}°C
        </p>
        <p className="text-xs text-fg-muted mt-1 font-mono">
          {wmoLabel(data.weather_code)}
        </p>
        <p className="text-xs text-fg-muted font-mono mt-0.5">
          Feels like {data.feels_like}°C &middot; {data.humidity}% humidity &middot; {data.wind_speed} km/h wind
        </p>
        <p className="text-[10px] text-fg-muted/60 font-mono mt-1">
          {data.city}, {data.country} &middot; updated {timeAgo(data.lastUpdated)}
        </p>
      </div>
    </div>
  );
}
