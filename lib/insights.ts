import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";

import { mdxComponents } from "@/components/mdx-components";
import type { InsightPost, InsightPostFrontmatter } from "@/lib/types";

const insightsDirectory = path.join(process.cwd(), "content", "insights");

function computeReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

async function readInsightFile(slug: string) {
  const filePath = path.join(insightsDirectory, `${slug}.mdx`);
  return fs.readFile(filePath, "utf8");
}

export const getAllInsights = cache(async (): Promise<InsightPost[]> => {
  const files = await fs.readdir(insightsDirectory);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(insightsDirectory, file), "utf8");
        const { data, content } = matter(raw);
        const frontmatter = data as InsightPostFrontmatter;

        return {
          ...frontmatter,
          content,
          readTime: frontmatter.readTime ?? computeReadTime(content)
        };
      })
  );

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
});

export const getInsightBySlug = cache(async (slug: string) => {
  const raw = await readInsightFile(slug);
  const { data, content } = matter(raw);
  const frontmatter = data as InsightPostFrontmatter;

  const compiled = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false
    }
  });

  return {
    frontmatter: {
      ...frontmatter,
      readTime: frontmatter.readTime ?? computeReadTime(content)
    },
    content: compiled.content as ReactElement
  };
});

export async function getRelatedInsights(slug: string, category: string, limit = 3) {
  const posts = await getAllInsights();
  return posts.filter((post) => post.slug !== slug && post.category === category).slice(0, limit);
}
