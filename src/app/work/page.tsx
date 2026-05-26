"use client";

import Section from "@/components/section";
import TimelineEntry from "@/components/timeline-entry";
import { education, experience, certifications } from "@/lib/data";

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section
        title="Experience"
        subtitle="Two internships before graduation. Each one a deliberate step toward mastering the backend."
      >
        <div className="max-w-2xl">
          {experience.map((exp, i) => (
            <TimelineEntry key={i} {...exp} />
          ))}
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
