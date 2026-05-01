import { ServiceCard } from "@/components/service-card";
import type { Service } from "@/lib/types";

type ServiceMarqueeProps = {
  items: Service[];
};

export function ServiceMarquee({ items }: ServiceMarqueeProps) {
  return (
    <div className="service-marquee" aria-label="HIDD service verticals">
      <div className="service-marquee__track">
        {items.map((service) => (
          <div key={service.slug} className="service-marquee__item">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
}
