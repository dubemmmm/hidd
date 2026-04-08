"use client";

import { useState } from "react";

import type { FaqCategory, FaqItem } from "@/lib/types";

type FaqBrowserProps = {
  faqs: FaqItem[];
  categories: FaqCategory[];
};

export function FaqBrowser({ faqs, categories }: FaqBrowserProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const categoryItems = ["All", ...categories] as const;

  const filtered = faqs.filter((faq) => {
    const matchesCategory = category === "All" || faq.category === category;
    const query = search.trim().toLowerCase();
    const matchesQuery =
      !query ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  const grouped = categories
    .map((group) => ({
      category: group,
      items: filtered.filter((faq) => faq.category === group)
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="faq-browser">
      <div className="faq-browser__toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search FAQs"
          className="search-input"
        />
        <div className="faq-browser__chips" aria-label="FAQ categories">
          <div className="faq-browser__chips-track">
            {categoryItems.map((item, index) => {
              const isAll = item === "All";
              const isActive = category === item;

              return (
                <button
                  type="button"
                  key={`${item}-${index}`}
                  className={`chip ${isActive ? "is-active" : ""}`}
                  onClick={() => setCategory(isAll ? "All" : item)}
                >
                  {item}
                </button>
              );
            })}
            {categoryItems.map((item, index) => {
              const isAll = item === "All";
              const isActive = category === item;

              return (
                <button
                  type="button"
                  key={`${item}-duplicate-${index}`}
                  className={`chip ${isActive ? "is-active" : ""}`}
                  onClick={() => setCategory(isAll ? "All" : item)}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {grouped.length ? (
        <div className="faq-browser__results">
          {grouped.map((group) => (
            <section key={group.category} className="faq-browser__section">
              <div className="faq-browser__section-title">{group.category}</div>
              <div className="faq-accordion faq-accordion--page">
                {group.items.map((faq) => {
                  const isOpen = faq.id === openId;

                  return (
                    <article key={faq.id} className={`faq-entry ${isOpen ? "is-open" : ""}`}>
                      <button
                        type="button"
                        className="faq-entry__question"
                        onClick={() =>
                          setOpenId((current) => (current === faq.id ? null : faq.id))
                        }
                      >
                        <span>{faq.question}</span>
                        <span className="faq-entry__icon">{isOpen ? "−" : "+"}</span>
                      </button>
                      <div className="faq-entry__answer">
                        <p>{faq.answer}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="faq-browser__empty">
          No matching questions found. Try a broader search or switch back to `All`.
        </div>
      )}
    </div>
  );
}
