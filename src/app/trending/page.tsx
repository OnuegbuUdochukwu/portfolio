"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Section from "@/components/section";

interface TrendingPost {
  id: number;
  hn_id: string;
  title: string;
  url: string | null;
  points: number;
  comment_count: number;
  author: string | null;
  created_at: string | null;
  topic_tags: string[];
}

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function TrendingPage() {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/trending");
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

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Section
        title="Trending in Backend"
        subtitle="Daily scrape of the Hacker News front page — filtered for backend content."
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
          ) : posts.length === 0 ? (
            <p className="text-sm text-fg-muted">
              No trending articles right now. The scraper runs daily at 9am UTC.
            </p>
          ) : (
            <div className="space-y-8">
              {posts.map((post, i) => {
                const hnUrl = `https://news.ycombinator.com/item?id=${post.hn_id}`;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <a
                      href={post.url || hnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-fg hover:text-accent transition-colors duration-200 leading-snug"
                    >
                      {post.title}
                    </a>
                    <p className="text-xs text-fg-muted mt-0.5 font-mono">
                      {post.points} points · {post.comment_count} comments · {post.author} · {timeAgo(post.created_at)}
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
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-fg-muted mt-12">
          Powered by{" "}
          <a
            href="https://hn.algolia.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg transition-colors duration-200"
          >
            HN Algolia API
          </a>
          . Scraped daily and served from the backend.
        </p>
      </Section>
    </div>
  );
}
