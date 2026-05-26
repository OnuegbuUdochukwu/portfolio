"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import { site } from "@/lib/data";

const links = [
  { href: "/", label: "Home" },
  { href: "/now", label: "Now" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/uses", label: "Uses" },
  { href: "/photos", label: "Photos" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-tight text-fg">
          {site.short}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm tracking-tight transition-colors duration-200 ${
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-fg transition-transform duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-5 h-px bg-fg transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-fg transition-transform duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="md:hidden bg-bg border-t border-border px-6 py-6 flex flex-col gap-4"
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm tracking-tight ${
                  isActive ? "text-fg font-medium" : "text-fg-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </motion.div>
      )}
    </header>
  );
}
