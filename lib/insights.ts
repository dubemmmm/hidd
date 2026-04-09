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

function computeReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
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
          readTime: frontmatter.readTime ?? computeReadTime(content)
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
    readTime: post.readTime ?? computeReadTime(`${post.title} ${post.excerpt}`)
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
            readTime: post.readTime ?? computeReadTime(`${post.title} ${post.excerpt}`)
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
      readTime: frontmatter.readTime ?? computeReadTime(content)
    },
    content: compiled.content as ReactElement
  };
});

export async function getRelatedInsights(slug: string, category: string, limit = 3) {
  const posts = await getAllInsights();
  return posts.filter((post) => post.slug !== slug && post.category === category).slice(0, limit);
}
