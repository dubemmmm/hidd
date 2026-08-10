import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { FaqBrowser } from "@/components/faq-browser";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getFaqs } from "@/lib/faqs";
import { createPageMetadata } from "@/lib/seo";
import type { FaqCategory } from "@/lib/types";

export const metadata: Metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about HIDD property services, professional fees, turnaround times, reports, confidentiality, and how to get started.",
  path: "/faqs"
});

export const revalidate = 60;

export default async function FaqsPage() {
  const faqs = await getFaqs();
  const categories = [...new Set(faqs.map((faq) => faq.category))] as FaqCategory[];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        }}
      />
      <section className="section">
        <div className="shell shell--support">
          <Reveal>
            <SectionHeading
              eyebrow="Frequently asked questions"
              title="Answers to help you plan your next step"
              description="Search by topic to learn about our services, process, fees, reports, and support for property buyers."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <FaqBrowser faqs={faqs} categories={categories} />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Still have questions?"
        description="If the FAQ does not cover your situation, contact HIDD directly and describe the property or area you are considering."
        primaryHref="/contact"
        primaryLabel="Contact HIDD"
      />
    </>
  );
}
