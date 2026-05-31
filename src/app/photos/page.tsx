"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Section from "@/components/section";

const photos: { src: string; alt: string; w: number; h: number }[] = [
  // Placeholder photos - replace with real images
];

export default function PhotosPage() {
  if (photos.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6">
        <Section
          title="Photos"
          subtitle="A visual break from the code. Moments from Lagos, campus, and everywhere in between."
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center"
          >
            <p className="font-serif italic text-base text-fg-muted">
              No photos yet.
            </p>
            <p className="text-sm text-fg-muted mt-2">
              This page comes to life when I start adding photos.
            </p>
            <p className="text-xs text-fg-muted mt-4">
              Shot on nothing in particular.
            </p>
          </motion.div>
        </Section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <Section
        title="Photos"
        subtitle="A visual break from the code. Moments from Lagos, campus, and everywhere in between."
      >
        <div className="columns-2 sm:columns-3 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
                delay: i * 0.05,
              }}
              className="break-inside-avoid mb-4"
            >
              <div
                className="bg-border/40 rounded-lg overflow-hidden"
                style={{ aspectRatio: `${photo.w}/${photo.h}` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-fg-muted mt-8">Shot on [camera].</p>
      </Section>
    </div>
  );
}
