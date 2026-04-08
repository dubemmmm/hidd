import Link from "next/link";

import { siteConfig } from "@/lib/site";

type CtaBandProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function CtaBand({
  title,
  description,
  primaryHref = "/contact",
  primaryLabel = "Book a Service"
}: CtaBandProps) {
  return (
    <section className="cta-band">
      <div className="shell">
        <div className="cta-band__panel">
          <div>
            <div className="section-heading__eyebrow">Next move</div>
            <h2 className="cta-band__title">{title}</h2>
            <p className="cta-band__description">{description}</p>
          </div>
          <div className="cta-band__actions">
            <Link href={primaryHref} className="button button--primary">
              {primaryLabel}
            </Link>
            <a href={siteConfig.whatsappHref} className="button button--ghost" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
