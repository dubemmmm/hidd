import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { FaqBrowser } from "@/components/faq-browser";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/data/faqs";
import type { FaqCategory } from "@/lib/types";

const categories = [...new Set(faqs.map((faq) => faq.category))] as FaqCategory[];

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Questions and answers covering HIDD's services, pricing, turnaround, and support for diaspora buyers."
};

export default function FaqsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell shell--support">
          <Reveal>
            <div className="page-hero__content" style={{ alignItems: "center", textAlign: "center" }}>
              <div className="section-heading__eyebrow">FAQs</div>
              <h1>Common pre-purchase questions, answered clearly.</h1>
              <p>
                This page reduces avoidable friction in the funnel while keeping the tone aligned
                with a premium advisory brand.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--support">
          <Reveal>
            <SectionHeading
              eyebrow="Filter and expand"
              title="Open the questions that matter to your deal"
              description="The FAQs page now uses dropdown accordions, grouped by category, with search and filtering layered on top."
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
