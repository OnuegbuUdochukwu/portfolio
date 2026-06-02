"use client";

import { motion } from "motion/react";
import Link from "next/link";
import ContributionGraph from "@/components/contribution-graph";
import LanguageBar from "@/components/language-bar";
import StatusLine from "@/components/status-line";
import LeetCodeStats from "@/components/leetcode-stats";
import { site, quotes } from "@/lib/data";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="min-h-[75vh] flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-6"
        >
          {site.name}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="max-w-3xl"
        >
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-fg">
            {site.tagline}
          </h1>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-fg-muted mt-2">
            AI Engineer
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
          className="mt-4 text-base text-fg-muted max-w-lg leading-relaxed"
        >
          {site.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.25 }}
          className="mt-4 font-mono text-xs text-fg-muted"
        >
          <StatusLine />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          className="mt-8 border-l-2 border-accent pl-4 max-w-lg"
        >
          <p className="font-serif italic text-base text-fg leading-relaxed">
            {quotes[0].replace(/^"|"$/g, "")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
          className="mt-10 flex items-center gap-6"
        >
          <Link
            href="/now"
            className="text-sm text-fg border-b border-fg hover:text-accent hover:border-accent transition-colors duration-200"
          >
            Now →
          </Link>
          <Link
            href="/work"
            className="text-sm text-fg-muted border-b border-transparent hover:text-fg hover:border-fg transition-colors duration-200"
          >
            Work →
          </Link>
          <Link
            href="/projects"
            className="text-sm text-fg-muted border-b border-transparent hover:text-fg hover:border-fg transition-colors duration-200"
          >
            Projects →
          </Link>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="pb-24"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-4">
          Consistency
        </p>
        <ContributionGraph />
        <div className="mt-6 pt-4 border-t border-border">
          <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-3">
            Language breakdown
          </p>
          <LanguageBar />
        </div>
        <p className="text-xs text-fg-muted mt-3">
          &ldquo;I show up and ship. Building the habits of a Senior Engineer before I graduate.&rdquo;
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="pb-24"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted mb-4">
          Algorithmic consistency
        </p>
        <LeetCodeStats />
        <p className="text-xs text-fg-muted mt-3">
          Data structures and algorithms. The part of engineering that has nothing to do with frameworks.
        </p>
      </motion.section>
    </div>
  );
}
