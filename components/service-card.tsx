import Link from "next/link";
import type { ReactNode } from "react";

import type { Service } from "@/lib/types";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const serviceIcons: Record<Service["slug"], ReactNode> = {
  "home-inspection": (
    <svg aria-hidden="true" {...iconProps}>
      <path d="M4.5 10.5 12 4l7.5 6.5" />
      <path d="M6.5 9.75V20h11V9.75" />
      <path d="M10 20v-5h4v5" />
      <circle cx="17.5" cy="16.5" r="2.25" />
      <path d="m19.1 18.1 1.6 1.6" />
    </svg>
  ),
  "legal-due-diligence": (
    <svg aria-hidden="true" {...iconProps}>
      <path d="M12 4v15" />
      <path d="M7 7h10" />
      <path d="M9 7 6.5 11a2.2 2.2 0 0 0 4 0L8 7" />
      <path d="M15 7 13.5 11a2.2 2.2 0 0 0 4 0L15 7" />
      <path d="M9 20h6" />
    </svg>
  ),
  "risk-intelligence": (
    <svg aria-hidden="true" {...iconProps}>
      <path d="M12 3.5c3 1.8 5.7 2.7 8 3v6.2c0 4.4-3 7.6-8 8.8-5-1.2-8-4.4-8-8.8V6.5c2.3-.3 5-1.2 8-3Z" />
      <path d="m9.2 12 1.8 1.8 3.8-4.3" />
    </svg>
  ),
  valuation: (
    <svg aria-hidden="true" {...iconProps}>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
      <path d="M3.5 19h17" />
      <path d="m5 9 3-3 4 2 5-4 2 2" />
    </svg>
  ),
};

type ServiceCardProps = {
  service: Service;
  index?: number;
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="service-card__topline">
        {index ? <span className="service-card__number">No. {String(index).padStart(2, "0")}</span> : null}
        <span className="service-card__icon">{serviceIcons[service.slug]}</span>
      </div>
      <h3>{service.name}</h3>
      <p>{service.summary}</p>
      {service.proofNote ? <span className="service-card__proof">{service.proofNote}</span> : null}
      <span className="service-card__cta">Learn more</span>
    </Link>
  );
}
