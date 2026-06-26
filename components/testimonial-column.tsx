import type { Testimonial } from "@/lib/types";

type TestimonialColumnProps = {
  items: Testimonial[];
};

export function TestimonialColumn({ items }: TestimonialColumnProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="testimonial-column" aria-label="Client social proof">
      {items.map((testimonial) => (
        <article key={testimonial.id} className="testimonial-card testimonial-card--stacked">
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
  );
}
