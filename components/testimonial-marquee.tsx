import type { Testimonial } from "@/lib/types";

type TestimonialMarqueeProps = {
  items: Testimonial[];
};

export function TestimonialMarquee({ items }: TestimonialMarqueeProps) {
  const loopItems = [...items, ...items];

  return (
    <div className="testimonial-marquee" aria-label="Client testimonials">
      <div className="testimonial-marquee__track">
        {loopItems.map((testimonial, index) => (
          <article key={`${testimonial.name}-${index}`} className="testimonial-card testimonial-card--marquee">
            <p>{testimonial.quote}</p>
            <div className="testimonial-card__author">
              <span>{testimonial.initials}</span>
              <div>
                <strong>{testimonial.name}</strong>
                <small>{testimonial.role}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
