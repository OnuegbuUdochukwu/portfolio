"use client";

import { motion } from "motion/react";
import Section from "@/components/section";
import { usesCategories } from "@/lib/data";

export default function UsesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section
        title="Uses"
        subtitle="The tools, languages, and gear I reach for every day. Configured once, trusted always."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl">
          {usesCategories.map((category, ci) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
                delay: ci * 0.08,
              }}
            >
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-4">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.label}>
                    <p className="font-medium text-xs text-fg mb-0.5">{item.label}</p>
                    <p className="text-sm text-fg-muted leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-fg-muted mt-12">
          Inspired by{" "}
          <a
            href="https://uses.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
          >
            uses.tech
          </a>
        </p>
      </Section>
    </div>
  );
}
