"use client";

import Link from "next/link";
import { useState } from "react";

import type { InsightPost } from "@/lib/types";

type InsightsFilterProps = {
  posts: InsightPost[];
};

export function InsightsFilter({ posts }: InsightsFilterProps) {
  const categories = ["All", ...new Set(posts.map((post) => post.category))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="insights-filter">
      <div className="chip-row chip-row--wrap">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`chip ${activeCategory === category ? "is-active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="insights-grid" aria-label="Browse articles">
        {filteredPosts.map((post, index) => (
          <Link key={post.slug} href={`/insights/${post.slug}`} className="insight-card insight-card--grid">
            <span className="insight-card__meta">
              {post.category} · {post.readTime}
            </span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="insight-card__footer">
              <span>{post.author}</span>
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }).format(new Date(post.publishedAt))}
              </span>
            </div>
            <span className="insight-card__accent" style={{ opacity: 0.25 + index * 0.08 }} />
          </Link>
        ))}
        {filteredPosts.length === 0 ? (
          <div className="insights-empty-state">No articles in this category yet.</div>
        ) : null}
      </div>
    </div>
  );
}
