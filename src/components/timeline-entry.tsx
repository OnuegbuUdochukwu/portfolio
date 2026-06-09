"use client";

import { motion } from "motion/react";

interface TimelineEntryProps {
  company: string;
  role: string;
  period: string;
  type: string;
  description: string;
  highlights: readonly string[];
  tags: readonly string[];
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
}

export default function TimelineEntry({
  company,
  role,
  period,
  type,
  description,
  highlights,
  tags,
  activeTag,
  onTagClick,
}: TimelineEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative pl-8 pb-12 border-l border-border last:pb-0"
    >
      <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1.5 rounded-full bg-accent border-2 border-bg" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
        <h3 className="font-medium text-fg">{company}</h3>
        <span className="text-xs text-fg-muted hidden sm:inline">·</span>
        <span className="text-xs text-fg-muted">{role}</span>
      </div>

      <div className="flex items-center gap-3 text-xs text-fg-muted mb-3">
        <span>{period}</span>
        <span>·</span>
        <span>{type}</span>
      </div>

      <p className="text-sm text-fg leading-relaxed mb-3 max-w-prose">
        {description}
      </p>

      {highlights.length > 0 && (
        <ul className="space-y-1 mb-3">
          {highlights.map((h, i) => (
            <li key={i} className="text-sm text-fg-muted flex items-start gap-2">
              <span className="text-accent mt-1.5 text-xs">◆</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className={`font-mono text-[11px] px-2 py-0.5 rounded-full transition-all duration-200 ${
              activeTag === tag
                ? "bg-accent text-white"
                : activeTag
                  ? "bg-accent-bg text-accent opacity-40 hover:opacity-100"
                  : "bg-accent-bg text-accent"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
