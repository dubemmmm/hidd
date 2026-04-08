import Link from "next/link";

import type { Service } from "@/lib/types";

const serviceSymbols: Record<Service["slug"], string> = {
  "home-inspection": "01",
  "legal-due-diligence": "02",
  "risk-intelligence": "03",
  valuation: "04"
};

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <span className="service-card__index">{serviceSymbols[service.slug]}</span>
      <span className="service-card__eyebrow">{service.eyebrow}</span>
      <h3>{service.name}</h3>
      <p>{service.summary}</p>
      <div className="service-card__meta">
        <strong>{service.fee}</strong>
        <span>{service.turnaround}</span>
      </div>
      <span className="service-card__cta">Learn more</span>
    </Link>
  );
}
