import Link from "next/link";

import type { NewsItem } from "@/lib/types";

type NewsMarqueeProps = {
  items: NewsItem[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function NewsMarquee({ items }: NewsMarqueeProps) {
  return (
    <div className="news-marquee news-marquee--static" aria-label="Latest HIDD signals">
      <div className="news-marquee__track news-marquee__track--static">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="news-card">
            <span className="news-card__category">{item.category}</span>
            <h3>{item.headline}</h3>
            <p>{item.description}</p>
            <div className="news-card__meta">
              <span>{item.source}</span>
              <span>{formatDate(item.publishedAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
