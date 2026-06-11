"use client";

import { useState, useEffect } from "react";

interface CommitFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
}

interface CommitFilesData {
  sha: string;
  message: string;
  author: string;
  date: string;
  stats: { total: number; additions: number; deletions: number };
  files: CommitFile[];
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

const STATUS_ICON: Record<string, { icon: string; color: string }> = {
  added: { icon: "+", color: "#2D6A4F" },
  modified: { icon: "~", color: "#D4A72C" },
  removed: { icon: "-", color: "#9B2226" },
  renamed: { icon: "→", color: "#7C7B79" },
  copied: { icon: "⊕", color: "#7C7B79" },
  changed: { icon: "△", color: "#D4A72C" },
};

function DirIcon({ open }: { open: boolean }) {
  return (
    <span className="text-fg-muted font-mono shrink-0">
      {open ? "▾" : "▸"}
    </span>
  );
}

export default function FileExplorer({
  githubUrl,
  sha,
  visible,
  onClose,
}: {
  githubUrl: string;
  sha: string | null;
  visible: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<CommitFilesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const parsed = parseGithubUrl(githubUrl);

  useEffect(() => {
    if (!sha || !parsed) return;
    setLoading(true);
    setError(false);
    setData(null);
    const params = new URLSearchParams({ owner: parsed.owner, repo: parsed.repo });
    fetch(`/api/github/commits/${sha}/files?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [sha]);

  const toggleDir = (dir: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  };

  return (
    <div
      className={`transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
        visible && sha ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
      }`}
    >
      {loading && (
        <div className="space-y-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-3 rounded bg-border/60 animate-pulse" />
              <div className="h-3 flex-1 rounded bg-border/60 animate-pulse" />
              <div className="w-8 h-3 rounded bg-border/40 animate-pulse" />
              <div className="w-8 h-3 rounded bg-border/40 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="font-mono text-[11px] text-fg-muted/60 italic">
          Unable to load file changes
        </p>
      )}

      {data && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
              Changes · {data.stats.total} files ({data.stats.additions}+, {data.stats.deletions}-)
            </h3>
            <button
              onClick={onClose}
              className="font-mono text-[10px] text-fg-muted hover:text-fg transition-colors duration-200"
            >
              ×
            </button>
          </div>
          <div className="border border-border rounded overflow-hidden">
            {data.files.map((file) => {
              const parts = file.filename.split("/");
              const isDir = parts.length > 1;
              const fileName = parts.pop() || file.filename;
              const dirPath = parts.join("/");
              const status = STATUS_ICON[file.status] || STATUS_ICON.changed;

              return (
                <div key={file.filename} className="flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-border/20 transition-colors duration-200">
                  {isDir && (
                    <button
                      onClick={() => toggleDir(dirPath)}
                      className="shrink-0"
                    >
                      <DirIcon open={expandedDirs.has(dirPath)} />
                    </button>
                  )}
                  {!isDir && <span className="w-4 shrink-0" />}
                  <span
                    className="font-mono text-[10px] font-bold shrink-0"
                    style={{ color: status.color }}
                  >
                    {status.icon}
                  </span>
                  <span className="font-mono text-[12px] text-fg truncate flex-1">
                    {isDir ? (
                      <>
                        <span className="text-fg-muted">{dirPath}/</span>
                        {fileName}
                      </>
                    ) : (
                      file.filename
                    )}
                  </span>
                  {file.additions > 0 && (
                    <span className="font-mono text-[10px] text-[#2D6A4F] shrink-0">
                      +{file.additions}
                    </span>
                  )}
                  {file.deletions > 0 && (
                    <span className="font-mono text-[10px] text-[#9B2226] shrink-0">
                      -{file.deletions}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

