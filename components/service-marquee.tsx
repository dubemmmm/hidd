import { ServiceCard } from "@/components/service-card";
import type { Service } from "@/lib/types";

type ServiceMarqueeProps = {
  items: Service[];
};

export function ServiceMarquee({ items }: ServiceMarqueeProps) {
  const loopItems = [...items, ...items];

  return (
    <div className="service-marquee" aria-label="HIDD service verticals">
      <div className="service-marquee__track">
        {loopItems.map((service, index) => (
          <div key={`${service.slug}-${index}`} className="service-marquee__item">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
}
