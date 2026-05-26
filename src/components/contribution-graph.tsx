"use client";

import { motion } from "motion/react";

interface Day {
  date: string;
  count: number;
  level: number;
}

const data: Day[] = [
  { date: "2025-06-06", count: 2, level: 1 },
  { date: "2025-06-07", count: 1, level: 1 },
  { date: "2025-06-11", count: 4, level: 1 },
  { date: "2025-06-14", count: 9, level: 2 },
  { date: "2025-06-15", count: 2, level: 1 },
  { date: "2025-06-16", count: 1, level: 1 },
  { date: "2025-06-17", count: 7, level: 2 },
  { date: "2025-06-18", count: 6, level: 1 },
  { date: "2025-06-19", count: 5, level: 1 },
  { date: "2025-06-20", count: 2, level: 1 },
  { date: "2025-06-21", count: 4, level: 1 },
  { date: "2025-06-22", count: 4, level: 1 },
  { date: "2025-06-23", count: 1, level: 1 },
  { date: "2025-06-24", count: 12, level: 2 },
  { date: "2025-06-25", count: 13, level: 3 },
  { date: "2025-06-26", count: 10, level: 2 },
  { date: "2025-06-27", count: 6, level: 1 },
  { date: "2025-06-28", count: 6, level: 1 },
  { date: "2025-06-29", count: 9, level: 2 },
  { date: "2025-06-30", count: 4, level: 1 },
  { date: "2025-07-01", count: 4, level: 1 },
  { date: "2025-07-02", count: 22, level: 4 },
  { date: "2025-07-03", count: 13, level: 3 },
  { date: "2025-07-04", count: 7, level: 2 },
  { date: "2025-07-05", count: 1, level: 1 },
  { date: "2025-07-06", count: 1, level: 1 },
  { date: "2025-07-07", count: 12, level: 2 },
  { date: "2025-07-08", count: 12, level: 2 },
  { date: "2025-07-09", count: 10, level: 2 },
  { date: "2025-07-10", count: 7, level: 2 },
  { date: "2025-07-11", count: 9, level: 2 },
  { date: "2025-07-12", count: 9, level: 2 },
  { date: "2025-07-13", count: 29, level: 4 },
  { date: "2025-07-14", count: 12, level: 2 },
  { date: "2025-07-15", count: 24, level: 4 },
  { date: "2025-07-16", count: 1, level: 1 },
  { date: "2025-07-17", count: 9, level: 2 },
  { date: "2025-07-18", count: 22, level: 4 },
  { date: "2025-07-19", count: 1, level: 1 },
  { date: "2025-07-20", count: 9, level: 2 },
  { date: "2025-07-21", count: 9, level: 2 },
  { date: "2025-07-23", count: 4, level: 1 },
  { date: "2025-07-25", count: 12, level: 2 },
  { date: "2025-07-27", count: 4, level: 1 },
  { date: "2025-07-28", count: 7, level: 2 },
  { date: "2025-07-29", count: 18, level: 3 },
  { date: "2025-07-30", count: 12, level: 2 },
  { date: "2025-08-04", count: 6, level: 1 },
  { date: "2025-08-11", count: 4, level: 1 },
  { date: "2025-08-12", count: 10, level: 2 },
  { date: "2025-08-15", count: 30, level: 4 },
  { date: "2025-08-16", count: 14, level: 3 },
  { date: "2025-08-17", count: 6, level: 1 },
  { date: "2025-08-18", count: 4, level: 1 },
  { date: "2025-08-19", count: 23, level: 4 },
  { date: "2025-08-20", count: 16, level: 3 },
  { date: "2025-08-24", count: 7, level: 2 },
  { date: "2025-08-25", count: 3, level: 1 },
  { date: "2025-08-26", count: 20, level: 4 },
  { date: "2025-08-27", count: 11, level: 2 },
  { date: "2025-08-29", count: 18, level: 3 },
  { date: "2025-08-30", count: 23, level: 4 },
  { date: "2025-08-31", count: 5, level: 1 },
  { date: "2025-09-01", count: 9, level: 2 },
  { date: "2025-09-02", count: 21, level: 4 },
  { date: "2025-09-14", count: 3, level: 1 },
  { date: "2025-09-15", count: 12, level: 2 },
  { date: "2025-09-16", count: 15, level: 3 },
  { date: "2025-09-17", count: 4, level: 1 },
  { date: "2025-09-19", count: 6, level: 1 },
  { date: "2025-09-21", count: 8, level: 2 },
  { date: "2025-09-22", count: 22, level: 4 },
  { date: "2025-09-26", count: 5, level: 1 },
  { date: "2025-09-28", count: 5, level: 1 },
  { date: "2025-10-13", count: 9, level: 2 },
  { date: "2025-10-16", count: 10, level: 2 },
  { date: "2025-10-17", count: 4, level: 1 },
  { date: "2025-10-18", count: 6, level: 1 },
  { date: "2025-10-19", count: 21, level: 4 },
  { date: "2025-10-23", count: 9, level: 2 },
  { date: "2025-10-26", count: 3, level: 1 },
  { date: "2025-10-27", count: 7, level: 2 },
  { date: "2025-11-02", count: 9, level: 2 },
  { date: "2025-11-03", count: 12, level: 2 },
  { date: "2025-11-04", count: 7, level: 2 },
  { date: "2025-11-17", count: 10, level: 2 },
  { date: "2025-11-19", count: 7, level: 2 },
  { date: "2025-11-23", count: 6, level: 1 },
  { date: "2025-12-07", count: 11, level: 2 },
  { date: "2025-12-08", count: 8, level: 2 },
  { date: "2025-12-09", count: 7, level: 2 },
  { date: "2025-12-10", count: 12, level: 2 },
  { date: "2025-12-11", count: 13, level: 3 },
  { date: "2025-12-12", count: 9, level: 2 },
  { date: "2026-01-08", count: 12, level: 2 },
  { date: "2026-01-11", count: 13, level: 3 },
  { date: "2026-01-18", count: 29, level: 4 },
  { date: "2026-01-28", count: 8, level: 2 },
  { date: "2026-03-10", count: 9, level: 2 },
  { date: "2026-03-11", count: 25, level: 4 },
  { date: "2026-03-14", count: 10, level: 2 },
  { date: "2026-04-12", count: 8, level: 2 },
  { date: "2026-04-13", count: 7, level: 2 },
  { date: "2026-04-14", count: 10, level: 2 },
  { date: "2026-04-20", count: 3, level: 1 },
  { date: "2026-04-22", count: 6, level: 1 },
  { date: "2026-04-27", count: 6, level: 1 },
  { date: "2026-04-28", count: 2, level: 1 },
  { date: "2026-04-29", count: 14, level: 3 },
  { date: "2026-04-30", count: 8, level: 2 },
  { date: "2026-05-04", count: 4, level: 1 },
  { date: "2026-05-05", count: 6, level: 1 },
  { date: "2026-05-11", count: 6, level: 1 },
  { date: "2026-05-12", count: 5, level: 1 },
  { date: "2026-05-13", count: 3, level: 1 },
  { date: "2026-05-15", count: 8, level: 2 },
  { date: "2026-05-19", count: 9, level: 2 },
  { date: "2026-05-20", count: 9, level: 2 },
  { date: "2026-05-22", count: 3, level: 1 },
  { date: "2026-05-25", count: 11, level: 2 },
  { date: "2026-05-26", count: 8, level: 2 },
];

const levels = ["bg-[#EBEDF0]", "bg-[#9BE9A8]", "bg-[#40C463]", "bg-[#30A14E]", "bg-[#216E39]"];

export default function ContributionGraph() {
  const weeks: (Day | null)[][] = [];
  let currentWeek: (Day | null)[] = [];
  const startDate = new Date("2025-06-01");
  const endDate = new Date("2026-05-26");
  const dayMap = new Map(data.map((d) => [d.date, d]));

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

  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="w-full">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-medium text-sm text-fg">{totalContributions.toLocaleString()} contributions</span>
        <span className="text-xs text-fg-muted">in the last year</span>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px] min-w-fit">
          {weeks.map((week, wi) => (
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
                  }`}
                  title={day ? `${day.date}: ${day.count} contributions` : undefined}
                />
              ))}
            </div>
          ))}
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
