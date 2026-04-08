import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/data/faqs";
import { getAllInsights } from "@/lib/insights";
import { getService, services } from "@/lib/data/services";

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

  const insights = await getAllInsights();
  const relatedInsights = insights.filter((post) => service.relatedInsights.includes(post.slug));
  const relatedFaqs = faqs.filter((faq) => service.relatedFaqIds.includes(faq.id));

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
                <div>
                  <span>Flat fee</span>
                  <strong>{service.fee}</strong>
                </div>
                <div>
                  <span>Turnaround</span>
                  <strong>{service.turnaround}</strong>
                </div>
                <div>
                  <span>Built for</span>
                  <strong>{service.suitableFor[0]}</strong>
                </div>
              </div>
              <div className="hero__actions">
                <Link href={`/contact?service=${service.slug}`} className="button button--primary">
                  Book This Service
                </Link>
                <Link href="/services" className="button button--ghost">
                  Back to all services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell shell--service content-grid content-grid--service">
          <Reveal>
            <article className="content-panel">
              <SectionHeading
                eyebrow="What HIDD assesses"
                title="Included in scope"
                description={service.heroKicker}
              />
              <ul className="feature-list">
                {service.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="content-panel">
              <SectionHeading
                eyebrow="What the client receives"
                title="Deliverables"
                description={service.keyMetric}
              />
              <ul className="feature-list">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell shell--service">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="A clear four-step process"
              description="Built to be clear, remote-friendly, and fast to review."
            />
          </Reveal>
          <div className="timeline-grid timeline-grid--service">
            {service.process.map((step, index) => (
              <Reveal key={step} delay={index * 0.06}>
                <article className="timeline-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell shell--service content-grid content-grid--service">
          <Reveal>
            <article className="content-panel">
              <SectionHeading
                eyebrow="Related reading"
                title="Relevant Insights"
                description="Useful context without leaving the conversion path."
              />
              <div className="stack-list">
                {relatedInsights.map((post) => (
                  <Link key={post.slug} href={`/insights/${post.slug}`} className="stack-link">
                    <strong>{post.title}</strong>
                    <span>
                      {post.category} · {post.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="content-panel">
              <SectionHeading
                eyebrow="Pre-sale objections"
                title="Related FAQs"
                description="Short answers to the questions buyers ask first."
              />
              <div className="stack-list">
                {relatedFaqs.map((faq) => (
                  <Link key={faq.id} href="/faqs" className="stack-link">
                    <strong>{faq.question}</strong>
                    <span>{faq.answer}</span>
                  </Link>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={`Need ${service.name.toLowerCase()} for a live transaction?`}
        description="Use the enquiry form to preselect this service and send the asset details directly to the HIDD team."
        primaryHref={`/contact?service=${service.slug}`}
        primaryLabel="Book This Service"
      />
    </>
  );
}
