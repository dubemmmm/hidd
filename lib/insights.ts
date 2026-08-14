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
import { formatReadTime } from "@/lib/read-time";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import type { InsightPost, InsightPostFrontmatter } from "@/lib/types";

const insightsDirectory = path.join(process.cwd(), "content", "insights");

type PortableTextSpan = {
  _type?: string;
  text?: string;
  marks?: string[];
};

type PortableTextBlock = {
  _type?: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: unknown[];
  listItem?: string;
  level?: number;
};

const insightFields = groq`
  title,
  "slug": slug.current,
  category,
  excerpt,
  author,
  authorCredentials,
  authorBio,
  reviewedBy,
  reviewerCredentials,
  lastReviewedAt,
  articleFormat,
  intendedAudience,
  sources[]{title, publisher, url, publishedAt, accessedAt, claimSupported},
  "publishedAt": coalesce(publishedAt, _createdAt),
  readTime,
  "coverImage": coalesce(coverImage, "/og/hidd-advisory-og-v1.png"),
  metaTitle,
  metaDescription,
  "ogImage": coalesce(ogImage, "/og/hidd-advisory-og-v1.png"),
  relatedService
`;

const allInsightsQuery = groq`*[_type == "post"] | order(publishedAt desc) {${insightFields}}`;
const insightBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ${insightFields},
  body,
  relatedArticles[]->{
    title,
    "slug": slug.current,
    category,
    author,
    "publishedAt": coalesce(publishedAt, _createdAt),
    readTime
  }
}`;

function extractMarkdownSource(body: unknown): string | null {
  if (!Array.isArray(body) || body.length === 0) {
    return null;
  }

  const blocks = body as PortableTextBlock[];

  const supportsMarkdownFallback = blocks.every((block) => {
    if (block?._type !== "block") return false;
    if (block.listItem || typeof block.level === "number") return false;
    if ((block.markDefs ?? []).length > 0) return false;

    return (block.children ?? []).every(
      (child) =>
        child?._type === "span" &&
        typeof child.text === "string" &&
        ((child.marks ?? []).length === 0)
    );
  });

  if (!supportsMarkdownFallback) {
    return null;
  }

  const source = blocks
    .map((block) => (block.children ?? []).map((child) => child.text ?? "").join(""))
    .join("\n\n")
    .trim();

  if (!source) {
    return null;
  }

  const markdownPattern =
    /(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```)|\[[^\]]+\]\([^)]+\)/m;

  return markdownPattern.test(source) ? source : null;
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
          readTime: formatReadTime(frontmatter.readTime)
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
    readTime: formatReadTime(post.readTime)
  }));
}

export const getAllInsights = cache(async (): Promise<InsightPost[]> => {
  if (sanityEnvReady) {
    try {
      return await getSanityInsights();
    } catch {
      // Sanity is the source of truth once configured. Do not expose stale MDX content.
      return [];
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
        const markdownSource = extractMarkdownSource(post.body);

        if (markdownSource) {
          const compiled = await compileMDX({
            source: markdownSource,
            components: mdxComponents,
            options: {
              parseFrontmatter: false
            }
          });

          return {
            frontmatter: {
              ...post,
              readTime: formatReadTime(post.readTime),
              relatedArticles: (post.relatedArticles ?? []).slice(0, 3).map((article) => ({
                ...article,
                readTime: formatReadTime(article.readTime)
              }))
            },
            content: compiled.content as ReactElement
          };
        }

        return {
          frontmatter: {
            ...post,
            readTime: formatReadTime(post.readTime),
            relatedArticles: (post.relatedArticles ?? []).slice(0, 3).map((article) => ({
              ...article,
              readTime: formatReadTime(article.readTime)
            }))
          },
          content: createElement(PortableText, {
            value: post.body as Parameters<typeof PortableText>[0]["value"],
            components: portableTextComponents
          }) as ReactElement
        };
      }
      return undefined;
    } catch {
      return undefined;
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
      readTime: formatReadTime(frontmatter.readTime)
    },
    content: compiled.content as ReactElement
  };
});
