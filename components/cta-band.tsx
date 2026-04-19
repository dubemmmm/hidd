import Link from "next/link";

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
          </div>
        </div>
      </div>
    </section>
  );
}
