import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import groq from "groq";
import { cache } from "react";
import { createElement } from "react";
import type { ReactElement } from "react";
import { PortableText } from "next-sanity";
import { compileMDX } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx-components";
import { portableTextComponents } from "@/components/portable-text";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import type { InsightPost, InsightPostFrontmatter } from "@/lib/types";

const insightsDirectory = path.join(process.cwd(), "content", "insights");

const insightFields = groq`{
  title,
  "slug": slug.current,
  category,
  excerpt,
  author,
  "publishedAt": coalesce(publishedAt, _createdAt),
  readTime,
  "coverImage": coalesce(coverImage, "/og-default.svg"),
  metaTitle,
  metaDescription,
  "ogImage": coalesce(ogImage, "/og-default.svg"),
  relatedService
}`;

const allInsightsQuery = groq`*[_type == "post"] | order(publishedAt desc) ${insightFields}`;
const insightBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ${insightFields},
  body
}`;

function normalizeReadTime(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : "Read time confirmed at publishing";
}

async function readInsightFile(slug: string) {
  const filePath = path.join(insightsDirectory, `${slug}.mdx`);
  return fs.readFile(filePath, "utf8");
}

async function getLocalInsights(): Promise<InsightPost[]> {
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
          readTime: normalizeReadTime(frontmatter.readTime)
        };
      })
  );

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function getSanityInsights(): Promise<InsightPost[]> {
  const posts = await sanityClient.fetch<InsightPostFrontmatter[]>(allInsightsQuery);

  return posts.map((post) => ({
    ...post,
    content: "",
    readTime: normalizeReadTime(post.readTime)
  }));
}

export const getAllInsights = cache(async (): Promise<InsightPost[]> => {
  if (sanityEnvReady) {
    try {
      return await getSanityInsights();
    } catch {
      return getLocalInsights();
    }
  }

  return getLocalInsights();
});

export const getInsightBySlug = cache(async (slug: string) => {
  if (sanityEnvReady) {
    try {
      const post = await sanityClient.fetch<
        (InsightPostFrontmatter & { body: unknown[] }) | null
      >(insightBySlugQuery, { slug });

      if (post) {
        return {
          frontmatter: {
            ...post,
            readTime: normalizeReadTime(post.readTime)
          },
          content: createElement(PortableText, {
            value: post.body as Parameters<typeof PortableText>[0]["value"],
            components: portableTextComponents
          }) as ReactElement
        };
      }
    } catch {
      // Fallback to local content while the CMS environment is being configured.
    }
  }

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
      readTime: normalizeReadTime(frontmatter.readTime)
    },
    content: compiled.content as ReactElement
  };
});

export async function getRelatedInsights(slug: string, category: string, limit = 3) {
  const posts = await getAllInsights();
  return posts.filter((post) => post.slug !== slug && post.category === category).slice(0, limit);
}
