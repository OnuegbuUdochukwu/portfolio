"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fallbackData } from "./contribution-fallback";

interface Day {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  totalContributions: number;
  currentStreak: number;
  days: { date: string; count: number; level: number }[];
  startDate: string;
  endDate: string;
}

const levels = ["bg-[#EBEDF0]", "bg-[#9BE9A8]", "bg-[#40C463]", "bg-[#30A14E]", "bg-[#216E39]"];

export default function ContributionGraph() {
  const [data, setData] = useState<{ days: Day[]; totalContributions: number; startDate: string; endDate: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch("/api/contributions");
        if (!res.ok) throw new Error("API error");
        const json: ApiResponse = await res.json();
        if (!json.days || json.days.length === 0) throw new Error("Empty response");

        if (!cancelled) {
          setData({
            days: json.days,
            totalContributions: json.totalContributions,
            startDate: json.startDate,
            endDate: json.endDate,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const effectiveData = data || (error ? fallbackData : null);
  const isReady = !loading && effectiveData;

  const weeks: (Day | null)[][] = [];
  let currentWeek: (Day | null)[] = [];

  if (isReady) {
    const startDate = new Date(effectiveData.startDate);
    const endDate = new Date(effectiveData.endDate);
    const dayMap = new Map(effectiveData.days.map((d) => [d.date, d]));

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      if (currentWeek.length === 0) {
        for (let i = 0; i < d.getDay(); i++) {
          currentWeek.push(null);
        }
      }
      currentWeek.push(dayMap.get(dateStr) || { date: dateStr, count: 0, level: 0 });
      if (d.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
  }

  const monthColumns: (string | null)[] = Array(weeks.length).fill(null);
  if (weeks.length > 0) {
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstRealDay = week.find((d) => d !== null);
      if (firstRealDay) {
        const d = new Date(firstRealDay.date + "T00:00:00Z");
        if (d.getMonth() !== lastMonth) {
          monthColumns[wi] = d.toLocaleString("en-US", { month: "short" });
          lastMonth = d.getMonth();
        }
      }
    });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  const dayRowLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="w-full">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-medium text-sm text-fg">
          {isReady ? effectiveData.totalContributions.toLocaleString() : "-"} contributions
        </span>
        <span className="text-xs text-fg-muted">in the last year</span>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-fit">
          {isReady && (
            <div className="flex flex-col gap-[3px] pt-[13px] mr-1 shrink-0">
              {dayRowLabels.map((label, i) => (
                <div key={i} className="h-[10px] flex items-center text-[10px] text-fg-muted font-mono leading-none">
                  {label}
                </div>
              ))}
            </div>
          )}
          <div>
            {isReady && (
              <div className="flex gap-[3px] text-[10px] text-fg-muted font-mono mb-[3px] h-[13px] items-end">
                {weeks.map((_, wi) => (
                  <div key={wi} className="w-[10px] leading-none overflow-visible whitespace-nowrap text-center">
                    {monthColumns[wi] || ""}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-[3px]">
              {loading && (
                <>
                  {Array.from({ length: 53 }).map((_, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {Array.from({ length: 7 }).map((_, di) => (
                        <div key={di} className="w-[10px] h-[10px] rounded-sm bg-[#EBEDF0] animate-pulse" />
                      ))}
                    </div>
                  ))}
                </>
              )}
              {isReady && weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: wi * 0.003 + di * 0.002 }}
                      className={`w-[10px] h-[10px] rounded-sm ${
                        day ? levels[day.level] : "bg-transparent"
                      } ${day && day.date === todayStr ? "ring-1 ring-fg/30" : ""}`}
                      title={day ? `${day.date}: ${day.count} contributions` : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-[10px] text-fg-muted">Less</span>
        {levels.map((l, i) => (
          <div key={i} className={`w-[10px] h-[10px] rounded-sm ${l}`} />
        ))}
        <span className="text-[10px] text-fg-muted">More</span>
      </div>
    </div>
  );
}
