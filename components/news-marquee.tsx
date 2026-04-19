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
  const loopItems = [...items, ...items];

  return (
    <div className="news-marquee" aria-label="Latest HIDD signals">
      <div className="news-marquee__track">
        {loopItems.map((item, index) => {
          const isDuplicate = index >= items.length;

          return (
            <Link
              key={`${item.id}-${index}`}
              href={item.href}
              className="news-card"
              aria-hidden={isDuplicate ? "true" : undefined}
              tabIndex={isDuplicate ? -1 : undefined}
            >
              <span className="news-card__category">{item.category}</span>
              <h3>{item.headline}</h3>
              <p>{item.description}</p>
              <div className="news-card__meta">
                <span>{item.source}</span>
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
