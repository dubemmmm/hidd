"use client";

import { useState } from "react";

import type { FaqItem } from "@/lib/types";

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="faq-accordion">
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <article key={item.id} className={`faq-entry ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="faq-entry__question"
              onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
            >
              <span>{item.question}</span>
              <span className="faq-entry__icon">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="faq-entry__answer">
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
