"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/lib/data";
import { languageColors } from "@/lib/data";
import TickerWidget from "@/components/ticker-widget";
import CommitGraph from "@/components/commit-graph";

export default function ProjectDetail({ project }: { project: Project }) {
  const [selectedSha, setSelectedSha] = useState<string | null>(null);
  const totalPercentage = project.languages?.reduce((sum, l) => sum + l.percentage, 0) || 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors duration-200 mb-8 font-mono uppercase tracking-wider"
      >
        ← Back to projects
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="font-serif text-4xl text-fg">{project.name}</h1>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-bg text-accent">
          {project.category}
        </span>
      </div>

      <p className="text-base text-fg leading-relaxed mb-6 max-w-prose">
        {project.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-fg-muted mb-6 flex-wrap">
        <span className="font-mono">{project.language}</span>
        <span>·</span>
        <span>{project.status}</span>
        {project.githubUrl && (
          <>
            <span>·</span>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline underline-offset-2"
            >
              Source →
            </a>
          </>
        )}
      </div>

      {project.languages && (
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
            Language breakdown
          </p>
          <div className="flex h-3 gap-0.1">
            {project.languages.map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${(lang.percentage / totalPercentage) * 100}%`, backgroundColor: languageColors[lang.name] || "#7C7B79" }}
                className="h-full rounded-full opacity-80"
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {project.languages.map((lang) => (
              <span key={lang.name} className="font-mono text-[11px] text-fg-muted flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-sm"
                  style={{ backgroundColor: languageColors[lang.name] || "#7C7B79" }}
                />
                {lang.name} {lang.percentage}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-6 space-y-6">
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
            Why this project matters
          </h2>
          <p className="text-sm text-fg leading-relaxed">{project.why}</p>
        </div>

        {project.currencies && project.currencies.length > 0 && (
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
              Live prices
            </h2>
            <TickerWidget currencies={project.currencies} />
          </div>
        )}

        {project.architectureNote && (
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
              Architecture note
            </h2>
            <p className="text-sm text-fg-muted leading-relaxed border-l-2 border-accent/40 pl-3 italic">
              {project.architectureNote}
            </p>
          </div>
        )}

        {project.learnings && project.learnings.length > 0 && (
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
              What I learned
            </h2>
            <ul className="space-y-1">
              {project.learnings.map((l, i) => (
                <li key={i} className="text-sm text-fg-muted flex items-start gap-2">
                  <span className="text-accent mt-1.5 text-xs">◆</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
            Tech stack
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-border/40 text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {project.githubUrl && (
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-2">
              Commit graph
            </h2>
            <CommitGraph
              githubUrl={project.githubUrl}
              selectedSha={selectedSha}
              onSelectSha={setSelectedSha}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
