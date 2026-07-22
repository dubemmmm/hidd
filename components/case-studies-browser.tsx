"use client";

import Link from "next/link";
import { useState } from "react";

import { comprehensiveReport, getService } from "@/lib/data/services";
import type { CaseStudy } from "@/lib/types";

type CaseStudiesBrowserProps = {
  items: CaseStudy[];
};

function serviceName(service: CaseStudy["service"]) {
  return service === "comprehensive-report"
    ? comprehensiveReport.name
    : getService(service)?.name ?? "HIDD Advisory";
}

export function CaseStudiesBrowser({ items }: CaseStudiesBrowserProps) {
  const [activeService, setActiveService] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const services = [...new Set(items.map((item) => item.service))];
  const filteredItems =
    activeService === "all" ? items : items.filter((item) => item.service === activeService);
  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, 6);

  function selectService(service: string) {
    setActiveService(service);
    setShowAll(false);
  }

  return (
    <div className="case-studies-browser">
      <div className="case-studies-browser__toolbar">
        <div className="case-studies-browser__filters" role="tablist" aria-label="Filter case studies by service">
          <button
            type="button"
            role="tab"
            aria-selected={activeService === "all"}
            className={activeService === "all" ? "is-active" : ""}
            onClick={() => selectService("all")}
          >
            All ({items.length})
          </button>
          {services.map((service) => {
            const count = items.filter((item) => item.service === service).length;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={activeService === service}
                className={activeService === service ? "is-active" : ""}
                key={service}
                onClick={() => selectService(service)}
              >
                {serviceName(service)} ({count})
              </button>
            );
          })}
        </div>
        <span className="case-studies-browser__count">
          Showing {visibleItems.length} of {filteredItems.length} case studies
        </span>
      </div>

      <div className="case-study-grid case-study-grid--archive" aria-label="Browse case studies">
        {visibleItems.map((caseStudy, index) => (
          <Link key={caseStudy.slug} href={`/case-studies/${caseStudy.slug}`} className="case-study-card case-study-card--archive">
            <div className="case-study-card__topline">
              <span>No. {String(index + 1).padStart(2, "0")}</span>
              <small>{serviceName(caseStudy.service)}</small>
            </div>
            <span className="case-study-card__location">{caseStudy.location}</span>
            <h2>{caseStudy.title}</h2>
            <p>{caseStudy.summary}</p>
            <div className="case-study-card__footer">
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }).format(new Date(caseStudy.publishedAt))}
              </span>
              <strong>Read →</strong>
            </div>
          </Link>
        ))}
      </div>

      {filteredItems.length > 6 ? (
        <div className="case-studies-browser__more">
          <button type="button" className="button button--secondary" onClick={() => setShowAll((current) => !current)}>
            {showAll ? "Show less" : `See more (${filteredItems.length - 6})`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
