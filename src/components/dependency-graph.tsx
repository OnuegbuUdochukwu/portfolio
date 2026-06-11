"use client";

import { useState, useEffect } from "react";

interface DepData {
  total: number;
  byEcosystem: Record<string, { name: string; version: string }[]>;
}

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    return null;
  } catch {
    return null;
  }
}

const ECOSYSTEM_LABELS: Record<string, string> = {
  npm: "npm",
  NuGet: "NuGet",
  Maven: "Maven",
  PyPI: "PyPI",
  Rubygems: "RubyGems",
  Cargo: "Cargo",
  Go: "Go",
  "nuget": ".NET",
  "cargo": "Cargo",
  "composer": "Composer",
  "unknown": "Other",
};

const ECOSYSTEM_COLORS: Record<string, string> = {
  npm: "#CB3837",
  NuGet: "#004880",
  Maven: "#C71A36",
  PyPI: "#3775A9",
  Rubygems: "#E9573F",
  Cargo: "#F75208",
  Go: "#00ADD8",
};

export default function DependencyGraph({ githubUrl }: { githubUrl: string }) {
  const [data, setData] = useState<DepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedEcosystem, setExpandedEcosystem] = useState<string | null>(null);

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!parsed) return;
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/dependencies?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error && !json.packages) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [parsed?.owner, parsed?.repo]);

  if (!parsed) return null;
  if (loading) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-5 w-16 rounded bg-border/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="font-mono text-[11px] text-fg-muted/60 italic">Unable to load dependencies</p>;
  if (!data || data.total === 0) return <p className="font-mono text-[11px] text-fg-muted/60 italic">No dependency data available</p>;

  const ecosystems = Object.entries(data.byEcosystem).sort((a, b) => b[1].length - a[1].length);

  return (
    <div>
      <div className="font-mono text-[10px] text-fg-muted mb-2">
        {data.total} dependencies across {ecosystems.length} ecosystems
      </div>
      <div className="space-y-1.5">
        {ecosystems.map(([eco, pkgs]) => {
          const isExpanded = expandedEcosystem === eco;
          const label = ECOSYSTEM_LABELS[eco] || eco;
          const color = ECOSYSTEM_COLORS[eco] || "#7C7B79";
          const maxVisible = 5;
          const visible = isExpanded ? pkgs : pkgs.slice(0, maxVisible);

          return (
            <div key={eco} className="border border-border rounded overflow-hidden">
              <button
                onClick={() => setExpandedEcosystem(isExpanded ? null : eco)}
                className="flex items-center gap-2 w-full px-2.5 py-1.5 hover:bg-border/10 transition-colors duration-200 text-left"
              >
                <span className="font-mono text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: color }}>
                  {label}
                </span>
                <span className="font-mono text-[10px] text-fg-muted">{pkgs.length}</span>
                <span className="ml-auto font-mono text-[9px] text-fg-muted/60">{isExpanded ? "less" : "more"}</span>
              </button>
              {visible.length > 0 && (
                <div className="border-t border-border divide-y divide-border">
                  {visible.map((pkg) => (
                    <div key={`${eco}-${pkg.name}`} className="flex items-center gap-2 px-2.5 py-1">
                      <span className="font-mono text-[10px] text-fg truncate flex-1">{pkg.name}</span>
                      <span className="font-mono text-[8px] text-fg-muted/60 shrink-0">{pkg.version}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
