import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";

import { AudioNarrationPlayer } from "@/components/audio-narration-player";
import { JsonLd } from "@/components/json-ld";
import { portableTextComponents } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { comprehensiveReport, getService } from "@/lib/data/services";
import { absoluteUrl, createPageMetadata, defaultOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const confidentialityNotice =
  "Client and asset details have been anonymised. Facts are reproduced with permission and adjusted only where required to preserve confidentiality.";

function evidenceTypeLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type CaseStudyPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) return {};

  return createPageMetadata({
    title: caseStudy.metaTitle,
    description: caseStudy.metaDescription,
    path: `/case-studies/${caseStudy.slug}`,
    type: "article"
  });
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
  const canonicalUrl = absoluteUrl(`/case-studies/${caseStudy.slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          additionalType: "https://schema.org/CaseStudy",
          "@id": `${canonicalUrl}#case-study`,
          headline: caseStudy.title,
          description: caseStudy.metaDescription,
          image: absoluteUrl(defaultOgImage),
          datePublished: caseStudy.publishedAt,
          dateModified: caseStudy.publishedAt,
          author: {
            "@type": "Organization",
            "@id": `${siteConfig.url}/#organization`,
            name: siteConfig.name
          },
          publisher: {
            "@type": "Organization",
            "@id": `${siteConfig.url}/#organization`,
            name: siteConfig.name
          },
          about: relatedService?.name ?? "Property due diligence",
          mainEntityOfPage: canonicalUrl
        }}
      />
      <section className="page-hero page-hero--article page-hero--case-study">
        <div className="shell shell--case-study">
          <Reveal>
            <div className="page-hero__content page-hero__content--article case-study-hero">
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
              {caseStudy.narration ? (
                <AudioNarrationPlayer
                  src={caseStudy.narration.audioUrl}
                  contentType="case study"
                  durationSeconds={caseStudy.narration.durationSeconds}
                />
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--case-study-detail">
        <div className="shell shell--case-study case-study-editorial-layout">
          <Reveal>
            <div className="case-study-editorial-main">
              <article className="case-study-prose">
                {caseStudy.body && caseStudy.body.length > 0 ? (
                  <>
                    <header className="case-study-content-heading">
                      <span>Case study details</span>
                      <h2>The Situation</h2>
                    </header>
                    <PortableText
                      value={caseStudy.body as Parameters<typeof PortableText>[0]["value"]}
                      components={portableTextComponents}
                    />
                  </>
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

              {caseStudy.publicationPermissionConfirmed ? (
                <aside className="case-study-confidentiality-note" aria-label="Confidentiality notice">
                  <strong>Confidentiality notice</strong>
                  <p>{confidentialityNotice}</p>
                </aside>
              ) : null}

              {caseStudy.evidenceItems && caseStudy.evidenceItems.length > 0 ? (
                <section className="case-study-evidence" aria-labelledby="case-study-evidence-title">
                  <header className="case-study-evidence__heading">
                    <span>Supporting material</span>
                    <h2 id="case-study-evidence-title">Redacted evidence</h2>
                    <p>
                      Selected records from the assessment, redacted to protect the client and asset.
                    </p>
                  </header>
                  <div className="case-study-evidence__grid">
                    {caseStudy.evidenceItems.map((item) => (
                      <figure key={item.key} className="case-study-evidence__item">
                        {item.attachmentType === "image" && item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.altText ?? ""} loading="lazy" />
                        ) : item.fileUrl ? (
                          <a
                            className="case-study-evidence__document"
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>PDF</span>
                            <strong>{item.originalFilename || "Open redacted document"}</strong>
                          </a>
                        ) : null}
                        <figcaption>
                          <small>{evidenceTypeLabel(item.evidenceType)}</small>
                          <strong>{item.title}</strong>
                          <p>{item.caption}</p>
                          <em>{item.redactionNote}</em>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="case-study-callout">
                <span>What HIDD prevented</span>
                <h2>Risk before commitment</h2>
                <p>{caseStudy.preventedRisk}</p>
              </section>

              <section className="case-study-booking">
                <div>
                  <span>Need this reviewed?</span>
                  <h2>Book HIDD</h2>
                  <p>Move before payment or signing, while the transaction can still be shaped.</p>
                </div>
                <Link href={`/contact?service=${caseStudy.service}`} className="button button--primary">
                  Book {relatedService?.name ?? "a HIDD service"}
                </Link>
              </section>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="case-study-fact-rail">
              <div>
                <span>Client profile</span>
                <strong>{caseStudy.clientProfile}</strong>
              </div>
              <div>
                <span>Related service</span>
                <strong>{relatedService?.name ?? "HIDD Advisory"}</strong>
              </div>
              <div>
                <span>What HIDD prevented</span>
                <strong>{caseStudy.preventedRisk}</strong>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
