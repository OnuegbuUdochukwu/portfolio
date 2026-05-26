"use client";

import { useState } from "react";
import Section from "@/components/section";
import ProjectCard from "@/components/project-card";
import { projects } from "@/lib/data";
import type { ProjectCategory } from "@/lib/data";

const categories: { label: string; value: ProjectCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Backend", value: "Backend" },
  { label: "Full Stack", value: "Full Stack" },
  { label: "AI/ML", value: "AI/ML" },
  { label: "Tooling", value: "Tooling" },
  { label: "Mobile", value: "Mobile" },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section
        title="Projects"
        subtitle="Proof of work. Each project solves a real problem or teaches something new."
      >
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.value)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                activeCategory === cat.value
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-fg-muted border-border hover:border-accent-muted hover:text-fg"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-fg-muted">No projects in this category yet.</p>
        )}
      </Section>
    </div>
  );
}
