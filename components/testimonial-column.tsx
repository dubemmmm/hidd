import type { Testimonial } from "@/lib/types";

type TestimonialColumnProps = {
  items: Testimonial[];
};

export function TestimonialColumn({ items }: TestimonialColumnProps) {
  if (items.length === 0) {
    return null;
  }

  const locations = [...new Set(items.map((item) => item.location))].join(" · ");

  return (
    <div className="testimonial-showcase" aria-label="Client social proof">
      <div className="testimonial-column">
        {items.map((testimonial, index) => (
          <article key={testimonial.id} className="testimonial-card testimonial-card--stacked">
            <div className="testimonial-card__topline">
              <span>No. {String(index + 1).padStart(2, "0")}</span>
              <small>{testimonial.activityLabel}</small>
            </div>
            <p>{testimonial.quote}</p>
            <div className="testimonial-card__rating" aria-label="5 out of 5 stars">★★★★★</div>
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

      <div className="testimonial-showcase__footer">
        <div className="testimonial-showcase__locations">
          <span>Trusted across</span>
          <strong>{locations}</strong>
        </div>
      </div>
    </div>
  );
}
