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
    <div className="news-marquee" aria-label="Latest property news">
      <div className="news-marquee__track">
        {loopItems.map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.url}
            className="news-card"
            target="_blank"
            rel="noreferrer"
          >
            <span className="news-card__category">{item.category}</span>
            <h3>{item.headline}</h3>
            <div className="news-card__meta">
              <span>{item.source}</span>
              <span>{formatDate(item.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
