import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BackButton } from "@/components/back-button";
import { Reveal } from "@/components/reveal";
import { getFaqsByIds } from "@/lib/faqs";
import { services } from "@/lib/data/services";

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

  return {
    title: service.name,
    description: service.summary
  };
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
      <section className="page-hero page-hero--service">
        <div className="shell shell--service">
          <Reveal>
            <div className="page-hero__content page-hero__content--service">
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
                <BackButton fallbackHref="/services" label="Back" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--service-detail">
        <div className="shell shell--service service-detail-section">
          <Reveal>
            <div className="service-detail-heading">
              <span>What HIDD assesses</span>
              <h2>Included in scope</h2>
              <p>{service.heroKicker}</p>
              {service.proofNote ? <p className="content-panel__proof">{service.proofNote}</p> : null}
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="service-detail-list">
              {service.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--service-detail">
        <div className="shell shell--service service-detail-section">
          <Reveal>
            <div className="service-detail-heading">
              <span>What the client receives</span>
              <h2>Deliverables</h2>
              <p>{service.keyMetric}</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="service-detail-list">
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
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
              <span>Pre-sale objections</span>
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
    </>
  );
}
