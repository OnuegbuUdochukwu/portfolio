"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import Section from "@/components/section";

interface TrendingPost {
  id: number;
  source_id: string;
  source: string;
  title: string;
  url: string | null;
  points: number;
  comment_count: number;
  author: string | null;
  created_at: string | null;
  topic_tags: string[];
}

const SOURCE_LABELS: Record<string, string> = {
  hackernews: "Hacker News",
  lobsters: "Lobsters",
  devto: "Dev.to",
  reddit: "Reddit",
};

const SOURCE_ORDER = ["hackernews", "lobsters", "devto", "reddit"];

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function sourceUrl(post: TrendingPost): string {
  if (post.url) return post.url;
  if (post.source === "hackernews")
    return `https://news.ycombinator.com/item?id=${post.source_id}`;
  if (post.source === "reddit" && post.author)
    return `https://www.reddit.com/r/programming/comments/${post.source_id}/`;
  return "#";
}

export default function TrendingPage() {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/trending?limit=40");
        if (!res.ok) throw new Error("API error");
        const json: TrendingPost[] = await res.json();
        if (!cancelled) setPosts(json);
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, TrendingPost[]> = {};
    for (const post of posts) {
      if (!groups[post.source]) groups[post.source] = [];
      groups[post.source].push(post);
    }
    return groups;
  }, [posts]);

  const sourcesWithPosts = SOURCE_ORDER.filter((s) => (grouped[s]?.length ?? 0) > 0);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section
        title="Trending in Backend"
        subtitle="Daily scrape of Hacker News, Lobsters, Dev.to, and Reddit - filtered for backend content."
      >
        <div className="max-w-3xl">
          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-border rounded w-3/4" />
                  <div className="h-3 bg-border rounded w-1/2" />
                  <div className="flex gap-1.5">
                    <div className="h-4 w-12 bg-border rounded-full" />
                    <div className="h-4 w-16 bg-border rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : sourcesWithPosts.length === 0 ? (
            <p className="text-sm text-fg-muted">
              No trending articles right now. The scraper runs daily at 9am UTC.
            </p>
          ) : (
            <div className="space-y-12">
              {sourcesWithPosts.map((source) => (
                <div key={source}>
                  <h2 className="text-xs font-mono text-fg-muted uppercase tracking-widest mb-4">
                    {SOURCE_LABELS[source] ?? source}
                  </h2>
                  <div className="space-y-6">
                    {grouped[source].map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                      >
                        <a
                          href={sourceUrl(post)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-fg hover:text-accent transition-colors duration-200 leading-snug"
                        >
                          {post.title}
                        </a>
                        <p className="text-xs text-fg-muted mt-0.5 font-mono">
                          {post.points}{" "}
                          {post.source === "devto" ? "reactions" : "points"} ·{" "}
                          {post.comment_count} comments · {post.author} ·{" "}
                          {timeAgo(post.created_at)}
                        </p>
                        {post.topic_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {post.topic_tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-accent/10 text-accent"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-fg-muted mt-12">
          Aggregated from{" "}
          <a
            href="https://hn.algolia.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
          >
            HN Algolia
          </a>
          ,{" "}
          <a
            href="https://lobste.rs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
          >
            Lobsters
          </a>
          ,{" "}
          <a
            href="https://dev.to"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
          >
            Dev.to
          </a>
          , and{" "}
          <a
            href="https://www.reddit.com/r/programming/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
          >
            Reddit
          </a>
          . Scraped daily and served from the backend.
        </p>
      </Section>
    </div>
  );
}
