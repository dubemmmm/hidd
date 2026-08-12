import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BackButton } from "@/components/back-button";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { getFaqsByIds } from "@/lib/faqs";
import { services } from "@/lib/data/services";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type ServicePageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {};
  }

  return createPageMetadata({
    title: service.name,
    description: service.summary,
    path: `/services/${service.slug}`
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await Promise.resolve(params);
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedFaqs = await getFaqsByIds(service.relatedFaqIds);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
          name: service.name,
          description: service.summary,
          url: absoluteUrl(`/services/${service.slug}`),
          provider: {
            "@type": "Organization",
            "@id": `${siteConfig.url}/#organization`,
            name: siteConfig.name
          },
          areaServed: {
            "@type": "AdministrativeArea",
            name: "Lagos State, Nigeria"
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: service.fee.replace(/[^0-9]/g, ""),
            url: absoluteUrl(`/contact?service=${service.slug}`)
          }
        }}
      />
      <section className="page-hero page-hero--service">
        <div className="shell shell--service">
          <Reveal>
            <div className="page-hero__content page-hero__content--service">
              <BackButton
                fallbackHref="/services"
                label="Back to Services"
                className="service-back-link back-link"
              />
              <div className="section-heading__eyebrow">{service.eyebrow}</div>
              <h1>{service.name}</h1>
              <p>{service.summary}</p>
              <div className="service-stat-strip">
                {[
                  { label: "Flat fee", value: service.fee },
                  ...(service.turnaround
                    ? [{ label: "Turnaround", value: service.turnaround }]
                    : []),
                  { label: "Built for", value: service.suitableFor[0] }
                ].map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              <div className="hero__actions">
                <Link href={`/contact?service=${service.slug}`} className="button button--primary">
                  Book This Service
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--service-introduction">
        <div className="shell shell--service service-introduction">
          <Reveal>
            <div className="service-detail-heading">
              <span>Service overview</span>
              <h2>What this service does</h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="service-introduction__body">
              <p>{service.longDescription}</p>
              <aside>
                <span>Best suited for</span>
                <ul>
                  {service.suitableFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--service-detail section--service-paired">
        <div className="shell shell--service service-detail-section">
          <div className="service-detail-pair">
            <Reveal>
              <article className="service-detail-column">
                <div className="service-detail-heading">
                  <span>What HIDD assesses</span>
                  <h2>Included in scope</h2>
                  <p>{service.heroKicker}</p>
                  {service.proofNote ? <p className="content-panel__proof">{service.proofNote}</p> : null}
                </div>
                <ul className="service-detail-list service-detail-list--single">
                  {service.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.06}>
              <article className="service-detail-column">
                <div className="service-detail-heading">
                  <span>What you receive</span>
                  <h2>Deliverables</h2>
                  <p>{service.keyMetric}</p>
                </div>
                <ul className="service-detail-list service-detail-list--single">
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--service-detail">
        <div className="shell shell--service service-detail-section">
          <Reveal>
            <div className="service-detail-heading">
              <span>How it works</span>
              <h2>A clear four-step process</h2>
              <p>Built to be clear, remote-friendly, and fast to review.</p>
            </div>
          </Reveal>
          <div className="service-detail-process">
            {service.process.map((step, index) => (
              <Reveal key={step} delay={index * 0.06}>
                <article className="service-detail-process__card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--service-detail">
        <div className="shell shell--service service-detail-section">
          <Reveal>
            <div className="service-detail-heading">
              <span>Common questions</span>
              <h2>Related FAQs</h2>
              <p>Short answers to the questions buyers ask first.</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="service-detail-faqs">
              {relatedFaqs.map((faq, index) => (
                <article key={faq.id}>
                  <span>No. {String(index + 1).padStart(2, "0")}</span>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--service-booking">
        <div className="shell shell--service">
          <Reveal>
            <div className="service-booking">
              <div>
                <span>Ready to begin?</span>
                <h2>Request {service.name}</h2>
                <p>Tell us about the property and your timeline. We will confirm the scope, professional fee, and next steps.</p>
              </div>
              <Link href={`/contact?service=${service.slug}`} className="button button--primary">
                Book This Service
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
