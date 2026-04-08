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
  const marqueePosts = filteredPosts.length > 1 ? [...filteredPosts, ...filteredPosts] : filteredPosts;

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

      <div className="insights-marquee" aria-label="Browse articles">
        <div className="insights-marquee__track">
          {marqueePosts.map((post, index) => {
            const isDuplicate = filteredPosts.length > 1 && index >= filteredPosts.length;

            return (
              <Link
                key={`${post.slug}-${index}`}
                href={`/insights/${post.slug}`}
                className="insight-card insight-card--marquee"
                tabIndex={isDuplicate ? -1 : undefined}
                aria-hidden={isDuplicate ? "true" : undefined}
              >
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
                <span className="insight-card__accent" style={{ opacity: 0.25 + (index % filteredPosts.length) * 0.1 }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
