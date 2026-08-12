"use client";

import { useEffect, useRef, useState } from "react";

import type { RiskAssessmentCategory, RiskAssessmentIndicator } from "@/lib/types";

type DistrictAssessmentGridProps = {
  categories: RiskAssessmentCategory[];
};

type ActiveAssessment = {
  categoryTitle: string;
  indicator: RiskAssessmentIndicator;
};

export function DistrictAssessmentGrid({ categories }: DistrictAssessmentGridProps) {
  const [activeAssessment, setActiveAssessment] = useState<ActiveAssessment | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeAssessment) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveAssessment(null);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeAssessment]);

  return (
    <>
      <div className="district-breakdown-grid">
        {categories.map((category) => (
          <article key={category.key} className="district-breakdown-card">
            <div className="district-breakdown-card__header">
              <span>{category.title}</span>
            </div>
            <div className="district-breakdown-card__items">
              {category.indicators.map((indicator) => (
                <div key={indicator.code} className="district-breakdown-card__item">
                  <div className="district-breakdown-card__item-meta">
                    <span>{indicator.code}</span>
                  </div>
                  <div className="district-breakdown-card__finding">
                    <strong>{indicator.label}</strong>
                    <p>{indicator.note}</p>
                    <button
                      type="button"
                      className="district-breakdown-card__read-more"
                      onClick={() => setActiveAssessment({ categoryTitle: category.title, indicator })}
                      aria-label={`Read the full ${indicator.label} assessment`}
                    >
                      Read full assessment <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {activeAssessment ? (
        <div
          className="district-assessment-dialog"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveAssessment(null);
          }}
        >
          <section
            className="district-assessment-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="district-assessment-dialog-title"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="district-assessment-dialog__close"
              onClick={() => setActiveAssessment(null)}
              aria-label="Close assessment"
            >
              Close <span aria-hidden="true">×</span>
            </button>
            <div className="district-assessment-dialog__meta">
              <span>{activeAssessment.categoryTitle}</span>
              <small>{activeAssessment.indicator.code}</small>
            </div>
            <h2 id="district-assessment-dialog-title">{activeAssessment.indicator.label}</h2>
            <p>{activeAssessment.indicator.note}</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
