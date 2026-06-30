import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";

import { CtaBand } from "@/components/cta-band";
import { portableTextComponents } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { comprehensiveReport, getService } from "@/lib/data/services";
import { siteConfig } from "@/lib/site";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) return {};

  return {
    title: caseStudy.metaTitle,
    description: caseStudy.metaDescription,
    openGraph: {
      title: caseStudy.metaTitle,
      description: caseStudy.metaDescription,
      url: `${siteConfig.url}/case-studies/${caseStudy.slug}`,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.metaTitle,
      description: caseStudy.metaDescription
    }
  };
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await Promise.resolve(params);
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedService =
    caseStudy.service === "comprehensive-report"
      ? comprehensiveReport
      : getService(caseStudy.service);

  return (
    <>
      <section className="page-hero page-hero--article">
        <div className="shell shell--article">
          <Reveal>
            <div className="page-hero__content page-hero__content--article">
              <Link href="/case-studies" className="back-link">
                Back to Case Studies
              </Link>
              <div className="section-heading__eyebrow">Case Study</div>
              <h1>{caseStudy.title}</h1>
              <p>{caseStudy.summary}</p>
              <div className="article-meta">
                <span>{caseStudy.clientProfile}</span>
                <span>{caseStudy.location}</span>
                <span>{caseStudy.readTime}</span>
                <span>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }).format(new Date(caseStudy.publishedAt))}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--article article-layout">
          <Reveal>
            <article className="article-prose case-study-prose">
              <div className="case-study-detail-strip">
                <div>
                  <span>Client profile</span>
                  <strong>{caseStudy.clientProfile}</strong>
                </div>
                <div>
                  <span>Related service</span>
                  <strong>{relatedService?.name ?? "HIDD Advisory"}</strong>
                </div>
              </div>

              <section className="case-study-callout">
                <span className="section-heading__eyebrow">What HIDD prevented</span>
                <p>{caseStudy.preventedRisk}</p>
              </section>

              {caseStudy.body && caseStudy.body.length > 0 ? (
                <PortableText
                  value={caseStudy.body as Parameters<typeof PortableText>[0]["value"]}
                  components={portableTextComponents}
                />
              ) : (
                caseStudy.sections.map((section) => (
                  <section key={section.title} className="case-study-section">
                    <h2 className="mdx-heading-lg">{section.title}</h2>
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="mdx-copy">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))
              )}
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="article-sidebar">
              <div className="article-sidebar__card">
                <span>What HIDD prevented</span>
                <h2>Risk before commitment</h2>
                <p>{caseStudy.preventedRisk}</p>
              </div>
              <div className="article-sidebar__card">
                <span>Need this reviewed?</span>
                <h2>Book HIDD</h2>
                <p>
                  Move before payment or signing, while the transaction can still be shaped.
                </p>
                <Link
                  href={`/contact?service=${caseStudy.service}`}
                  className="button button--primary"
                >
                  Book {relatedService?.name ?? "a HIDD service"}
                </Link>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need buyer-side leverage before you commit?"
        description="Use HIDD to pressure-test the property, documents, area risk, and price before the transaction becomes expensive to unwind."
        primaryHref={`/contact?service=${caseStudy.service}`}
        primaryLabel="Start an enquiry"
      />
    </>
  );
}
