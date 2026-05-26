"use client";

import { motion } from "motion/react";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}

export default function Section({ title, subtitle, children, delay = 0 }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay }}
      className="mb-24"
    >
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-fg">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-sm text-fg-muted max-w-lg">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.section>
  );
}
