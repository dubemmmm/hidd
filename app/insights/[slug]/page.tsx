import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticleGate } from "@/components/article-gate";
import { Reveal } from "@/components/reveal";
import { comprehensiveReport, getService } from "@/lib/data/services";
import { getAllInsights, getInsightBySlug, getRelatedInsights } from "@/lib/insights";
import { siteConfig } from "@/lib/site";

type InsightPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);

  try {
    const post = await getInsightBySlug(slug);
    return {
      title: post.frontmatter.metaTitle,
      description: post.frontmatter.metaDescription,
      openGraph: {
        title: post.frontmatter.metaTitle,
        description: post.frontmatter.metaDescription,
        images: [post.frontmatter.ogImage]
      },
      twitter: {
        card: "summary_large_image",
        title: post.frontmatter.metaTitle,
        description: post.frontmatter.metaDescription,
        images: [post.frontmatter.ogImage]
      }
    };
  } catch {
    return {};
  }
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
  const { slug } = await Promise.resolve(params);

  try {
    const post = await getInsightBySlug(slug);
    const relatedPosts = await getRelatedInsights(slug, post.frontmatter.category);
    const canonicalUrl = `${siteConfig.url}/insights/${slug}`;
    const shareText = encodeURIComponent(post.frontmatter.title);
    const shareUrl = encodeURIComponent(canonicalUrl);
    const publishedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(post.frontmatter.publishedAt));
    const relatedService =
      post.frontmatter.relatedService === "comprehensive-report"
        ? comprehensiveReport
        : getService(post.frontmatter.relatedService);

    return (
      <>
        <section className="page-hero page-hero--article">
          <div className="shell shell--article">
            <Reveal>
              <div className="page-hero__content page-hero__content--article">
                <Link href="/insights" className="back-link">
                  Back to Insights
                </Link>
                <div className="section-heading__eyebrow">{post.frontmatter.category}</div>
                <h1>{post.frontmatter.title}</h1>
                <p>{post.frontmatter.excerpt}</p>
                <div className="article-meta">
                  <span>{post.frontmatter.author}</span>
                  <span>{post.frontmatter.readTime}</span>
                  <span>{publishedDate}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section--flush-top">
          <div className="shell shell--article article-layout">
            <Reveal>
              <article className="article-prose">
                <ArticleGate slug={slug} title={post.frontmatter.title}>
                  {post.content}
                </ArticleGate>
                {relatedService ? (
                  <div className="article-inline-cta">
                    <span className="section-heading__eyebrow">Relevant next step</span>
                    <h2>{relatedService.name}</h2>
                    <p>
                      Move from analysis to action with the HIDD service most relevant to this
                      article.
                    </p>
                    <Link
                      href={`/contact?service=${post.frontmatter.relatedService}`}
                      className="button button--primary"
                    >
                      Book {relatedService.name}
                    </Link>
                  </div>
                ) : null}
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <aside className="article-sidebar">
                <div className="article-sidebar__card">
                  <span>Content pillar</span>
                  <strong>{post.frontmatter.category}</strong>
                </div>
                <div className="article-sidebar__card">
                  <span>Read time</span>
                  <strong>{post.frontmatter.readTime}</strong>
                </div>
                <div className="article-sidebar__card">
                  <span>Published</span>
                  <strong>{publishedDate}</strong>
                </div>
                <div className="article-sidebar__card article-sidebar__share">
                  <span>Share this article</span>
                  <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer">WhatsApp</a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer">X (Twitter)</a>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        {relatedPosts.length ? (
          <section className="section article-related">
            <div className="shell shell--article">
              <h2>More from insights</h2>
              <div className="article-related__grid">
                {relatedPosts.slice(0, 3).map((related) => (
                  <Link key={related.slug} href={`/insights/${related.slug}`} className="article-related__card">
                    <span>{related.category} · {related.readTime}</span>
                    <h3>{related.title}</h3>
                    <small>{related.author} · {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(related.publishedAt))}</small>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </>
    );
  } catch {
    notFound();
  }
}
