"use client";

import { useEffect } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

export function BackendWarmup() {
  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/health`).catch(() => {});
  }, []);

  return null;
}
