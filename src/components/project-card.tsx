"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const categoryColors: Record<string, string> = {
  Backend: "bg-accent-bg text-accent",
  "Full Stack": "bg-[#EDE7F6] text-[#4527A0]",
  "AI/ML": "bg-[#FFF3E0] text-[#E65100]",
  Tooling: "bg-[#E0F2F1] text-[#00695C]",
  Mobile: "bg-[#FCE4EC] text-[#880E4F]",
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: index * 0.05 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block p-5 border border-border rounded-lg hover:border-accent-muted transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-medium text-fg group-hover:text-accent transition-colors duration-200">
            {project.name}
          </h3>
          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
              categoryColors[project.category]
            }`}
          >
            {project.category}
          </span>
        </div>

        <p className="text-sm text-fg-muted leading-relaxed mb-3 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-fg-muted mb-3">
          <span className="font-mono">{project.language}</span>
          <span>·</span>
          <span>{project.status}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 rounded bg-border/40 text-fg-muted"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="font-mono text-[10px] text-fg-muted">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
