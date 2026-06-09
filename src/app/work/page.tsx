"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Section from "@/components/section";
import TimelineEntry from "@/components/timeline-entry";
import { education, experience, certifications, projects, tagGroups } from "@/lib/data";

function matchesTag(tags: readonly string[], tag: string): boolean {
  const expanded = tagGroups[tag] ? [tag, ...tagGroups[tag]] : [tag];
  return tags.some((t) => expanded.includes(t));
}

function WorkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get("tag") || null;

  const allTags = useMemo(() => {
    const set = new Set<string>();
    experience.forEach((exp) => exp.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const groupKeys = Object.keys(tagGroups);
  const individualTags = allTags.filter((t) => !groupKeys.includes(t));

  const filtered = activeTag
    ? experience.filter((exp) => matchesTag(exp.tags, activeTag))
    : experience;

  const filteredProjects = activeTag
    ? projects.filter((p) => matchesTag(p.tags, activeTag))
    : [];

  function handleTagClick(tag: string) {
    const next = tag === activeTag ? null : tag;
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("tag", next);
    else params.delete("tag");
    const qs = params.toString();
    router.replace(`/work${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section
        title="Experience"
        subtitle={
          activeTag
            ? `Showing experiences tagged with "${activeTag}"`
            : "Two internships before graduation. Each one a deliberate step toward mastering the backend."
        }
      >
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("tag");
              const qs = params.toString();
              router.replace(`/work${qs ? `?${qs}` : ""}`, { scroll: false });
            }}
            className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-200 ${
              !activeTag
                ? "bg-accent text-white border-accent"
                : "bg-transparent text-fg-muted border-border hover:border-accent-muted hover:text-fg"
            }`}
          >
            All
          </button>
          {groupKeys.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                activeTag === tag
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-fg-muted border-border hover:border-accent-muted hover:text-fg"
              }`}
            >
              {tag}
            </button>
          ))}
          {individualTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                activeTag === tag
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-fg-muted border-border hover:border-accent-muted hover:text-fg"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className={activeTag ? "grid grid-cols-1 lg:grid-cols-2 gap-10" : "max-w-2xl"}>
          <div className={activeTag ? "max-w-2xl" : ""}>
            {filtered.length > 0 ? (
              filtered.map((exp, i) => (
                <TimelineEntry key={i} {...exp} activeTag={activeTag} onTagClick={handleTagClick} />
              ))
            ) : (
              <p className="text-sm text-fg-muted font-mono">
                No experiences tagged with &ldquo;{activeTag}&rdquo;.
              </p>
            )}
          </div>

          {activeTag && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-4">
                Related Projects
              </p>
              {filteredProjects.length > 0 ? (
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <Link
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      className="block p-4 border border-border rounded-lg hover:border-accent-muted transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-fg hover:text-accent transition-colors duration-200">
                          {project.name}
                        </h4>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent-bg text-accent">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-border/40 text-fg-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-fg-muted font-mono">
                  No related projects for this tag.
                </p>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section title="Education" delay={0.1}>
        <div className="max-w-2xl border-l border-border pl-8 relative">
          <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1.5 rounded-full bg-accent border-2 border-bg" />
          <h3 className="font-medium text-fg">{education.school}</h3>
          <p className="text-sm text-fg-muted">{education.degree}</p>
          <div className="flex items-center gap-3 text-xs text-fg-muted mt-1 mb-3">
            <span>{education.period}</span>
            <span>·</span>
            <span>GPA: {education.gpa}</span>
            <span>·</span>
            <span>{education.location}</span>
          </div>
          <ul className="space-y-1">
            {education.details.map((d, i) => (
              <li key={i} className="text-sm text-fg-muted flex items-start gap-2">
                <span className="text-accent mt-1.5 text-xs">◆</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Certifications" delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {certifications.map((cert, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-4 hover:border-accent-muted transition-colors duration-200"
            >
              <p className="text-sm font-medium text-fg">{cert.name}</p>
              <p className="text-xs text-fg-muted mt-1">
                {cert.issuer} · {cert.date}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function WorkPage() {
  return (
    <Suspense>
      <WorkContent />
    </Suspense>
  );
}
