"use client";

import { motion } from "motion/react";
import Section from "@/components/section";
import { now, site } from "@/lib/data";

export default function NowPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section title="Now" subtitle={now.date}>
        <div className="max-w-prose">
          <p className="text-sm text-fg-muted mb-6 leading-relaxed">
            {site.blurb}
          </p>
          <p className="font-serif italic text-base text-fg mb-6 border-l-2 border-accent pl-4">
            &ldquo;I focus on what happens behind the scenes.&rdquo;
          </p>
          <div className="space-y-3">
            {now.lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                  delay: i * 0.08,
                }}
                className="text-base text-fg leading-relaxed flex items-start gap-3"
              >
                <span className="text-accent mt-1.5 block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {line}
              </motion.p>
            ))}
          </div>
          <p className="text-xs text-fg-muted mt-8">
            Last updated {now.date}. Inspired by{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
            >
              nownownow.com
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}
