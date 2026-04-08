import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { getAllInsights, getInsightBySlug, getRelatedInsights } from "@/lib/insights";
import { siteConfig } from "@/lib/site";

type InsightPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllInsights();
  return posts.map((post) => ({ slug: post.slug }));
}

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
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    }).format(new Date(post.frontmatter.publishedAt))}
                  </span>
                </div>
                <div className="article-share">
                  <a
                    href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                    className="button button--ghost"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    className="button button--ghost"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on LinkedIn
                  </a>
                  <a
                    href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                    className="button button--ghost"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on X
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section--flush-top">
          <div className="shell shell--article article-layout">
            <Reveal>
              <article className="article-prose">{post.content}</article>
            </Reveal>
            <Reveal delay={0.08}>
              <aside className="article-sidebar">
                <div className="article-sidebar__card">
                  <span>Need a professional assessment?</span>
                  <h2>Book a HIDD service</h2>
                  <p>
                    Move from article to action with inspection, legal, risk, or valuation.
                  </p>
                  <Link href="/contact" className="button button--primary">
                    Book a service
                  </Link>
                </div>
                <div className="article-sidebar__card">
                  <span>Related posts</span>
                  <div className="stack-list">
                    {relatedPosts.map((related) => (
                      <Link key={related.slug} href={`/insights/${related.slug}`} className="stack-link">
                        <strong>{related.title}</strong>
                        <span>{related.excerpt}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        <CtaBand
          title="Need a professional assessment?"
          description="Move from content to action with a HIDD inspection, legal diligence, risk, or valuation engagement."
          primaryHref="/contact"
        />
      </>
    );
  } catch {
    notFound();
  }
}
