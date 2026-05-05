import type { Testimonial } from "@/lib/types";

type TestimonialMarqueeProps = {
  items: Testimonial[];
};

export function TestimonialMarquee({ items }: TestimonialMarqueeProps) {
  if (items.length === 0) {
    return null;
  }

  const loopItems = [...items, ...items];

  return (
    <div className="testimonial-marquee" aria-label="Client social proof">
      <div className="testimonial-marquee__track">
        {loopItems.map((testimonial, index) => (
          <article key={`${testimonial.id}-${index}`} className="testimonial-card testimonial-card--marquee">
            <span className="testimonial-card__activity">{testimonial.activityLabel}</span>
            <p>{testimonial.quote}</p>
            <div className="testimonial-card__author">
              <span>{testimonial.initials}</span>
              <div className="testimonial-card__identity">
                <strong>{testimonial.name}</strong>
                <small>{testimonial.role}</small>
                <small className="testimonial-card__location">{testimonial.location}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
