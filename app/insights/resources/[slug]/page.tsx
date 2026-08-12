import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";

import { portableTextComponents } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { getReportAsset } from "@/lib/reports";
import { requiresReportEmail } from "@/lib/report-access-policy";
import { createPageMetadata } from "@/lib/seo";

type ResourcePageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const resource = await getReportAsset(slug);
  if (!resource) return {};

  return createPageMetadata({
    title: resource.title,
    description: resource.summary,
    path: `/insights/resources/${slug}`,
    image: resource.coverImageUrl
  });
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await Promise.resolve(params);
  const resource = await getReportAsset(slug);
  if (!resource) notFound();

  const publicationDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(resource.publishedAt));
  const emailRequired = requiresReportEmail(resource);

  return (
    <>
      <section className="page-hero page-hero--resource-detail">
        <div className="shell shell--article">
          <Reveal>
            <div className="resource-detail-hero">
              <Link href="/insights" className="back-link">Back to Insights</Link>
              {resource.isDemo ? (
                <div className="resource-demo-notice">
                  Demonstration resource - illustrative content only, not professional advice.
                </div>
              ) : null}
              <div className="section-heading__eyebrow">{resource.category}</div>
              <h1>{resource.title}</h1>
              <p>{resource.summary}</p>
              <div className="resource-detail-hero__meta">
                <span>{resource.edition ?? publicationDate}</span>
                {resource.version ? <span>Version {resource.version}</span> : null}
                {resource.fileFormat ? <span>{resource.fileFormat}</span> : null}
                {resource.pageCount ? <span>{resource.pageCount} pages</span> : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--article resource-detail-layout">
          <Reveal>
            <article className="resource-detail-main">
              {resource.coverImageUrl ? (
                <img className="resource-detail-cover" src={resource.coverImageUrl} alt={`${resource.title} cover`} />
              ) : null}

              {Array.isArray(resource.description) && resource.description.length ? (
                <div className="resource-detail-description">
                  <PortableText value={resource.description as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
                </div>
              ) : null}

              {resource.keyContents?.length ? (
                <section className="resource-detail-section">
                  <div className="section-heading__eyebrow">Inside the resource</div>
                  <h2>What it contains</h2>
                  <ul className="resource-detail-list">
                    {resource.keyContents.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
              ) : null}

              {resource.sources?.length ? (
                <section className="resource-detail-section resource-detail-sources">
                  <div className="section-heading__eyebrow">References</div>
                  <h2>Sources used</h2>
                  <ol>
                    {resource.sources.map((source) => (
                      <li key={`${source.url}-${source.title}`}>
                        <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                        <span>{source.publisher}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="resource-detail-sidebar">
              {resource.authorName ? (
                <div className="resource-detail-fact">
                  <span>Lead professional</span>
                  <strong>{resource.authorName}</strong>
                  {resource.authorCredentials?.length ? <p>{resource.authorCredentials.join(" · ")}</p> : null}
                </div>
              ) : null}
              {resource.contributors?.length ? (
                <div className="resource-detail-fact">
                  <span>Contributors and reviewers</span>
                  {resource.contributors.map((person) => (
                    <div key={`${person.name}-${person.role}`} className="resource-contributor">
                      <strong>{person.name}</strong>
                      <p>{person.role}{person.credentials?.length ? ` · ${person.credentials.join(", ")}` : ""}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {resource.intendedAudience?.length ? (
                <div className="resource-detail-fact">
                  <span>Intended audience</span>
                  <p>{resource.intendedAudience.join(" · ")}</p>
                </div>
              ) : null}
              {resource.coverageAreas?.length ? (
                <div className="resource-detail-fact">
                  <span>Coverage</span>
                  <p>{resource.coverageAreas.join(" · ")}</p>
                </div>
              ) : null}
              <div className="resource-detail-access">
                <span>{emailRequired ? "Email access" : "Open download"}</span>
                <h2>{resource.status === "live" ? "Get the resource" : "Join the release list"}</h2>
                {resource.status === "live" && !emailRequired && resource.assetUrl ? (
                  <a href={resource.assetUrl} className="button button--primary" download>Download now</a>
                ) : (
                  <Link href={`/insights?asset=${resource.slug}`} className="button button--primary">
                    {resource.status === "live" ? "Unlock resource" : "Register interest"}
                  </Link>
                )}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
