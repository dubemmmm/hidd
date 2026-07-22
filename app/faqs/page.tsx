import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { FaqBrowser } from "@/components/faq-browser";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getFaqs } from "@/lib/faqs";
import type { FaqCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Questions and answers covering HIDD's services, pricing, turnaround, and support for diaspora buyers."
};

export const revalidate = 60;

export default async function FaqsPage() {
  const faqs = await getFaqs();
  const categories = [...new Set(faqs.map((faq) => faq.category))] as FaqCategory[];

  return (
    <>
      <section className="section">
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
