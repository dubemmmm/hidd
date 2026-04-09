"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { mapAreas } from "@/lib/data/map-areas";
import type { MapAreaShape } from "@/lib/types";

const riskTierLabel: Record<MapAreaShape["tier"], string> = {
  low: "Low risk",
  medium: "Watch closely",
  high: "Elevated risk"
};

const VISIBLE_COUNT = 4;

export default function RiskMap() {
  const [activeId, setActiveId] = useState(mapAreas[0]?.id ?? "");
  const [expanded, setExpanded] = useState(false);

  const activeArea = useMemo(
    () => mapAreas.find((area) => area.id === activeId) ?? mapAreas[0],
    [activeId]
  );

  const visibleBreakdown = activeArea
    ? expanded
      ? activeArea.breakdown
      : activeArea.breakdown.slice(0, VISIBLE_COUNT)
    : [];

  const hasMore = (activeArea?.breakdown.length ?? 0) > VISIBLE_COUNT;

  if (!activeArea) return null;

  return (
    <div className="map-shell map-shell--shape">
      <div className="map-shell__stage map-shell__stage--shape">
        <div className="map-shell__frame">
          <div className="map-shell__eyebrow">Five flagship Lagos districts</div>
          <svg
            viewBox="0 0 1000 700"
            className="risk-shape-map"
            role="img"
            aria-label="Clickable Lagos risk map"
          >
            <defs>
              <linearGradient id="mapSea" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#1f314f" />
                <stop offset="100%" stopColor="#141f35" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1000" height="700" rx="36" fill="url(#mapSea)" />
            <path
              d="M90 118 L350 84 L538 110 L680 96 L846 164 L908 312 L880 502 L748 600 L430 628 L214 578 L108 438 L72 260 Z"
              className="risk-shape-map__lagos"
            />
            {mapAreas.map((area) => {
              const isActive = area.id === activeArea.id;

              return (
                <g key={area.id}>
                  <path
                    d={area.pathData}
                    className={`risk-shape-map__area risk-shape-map__area--${area.tier} ${
                      isActive ? "is-active" : ""
                    }`}
                    onClick={() => { setActiveId(area.id); setExpanded(false); }}
                  />
                  <text
                    x={area.focusX}
                    y={area.focusY}
                    className={`risk-shape-map__label ${isActive ? "is-active" : ""}`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    onClick={() => { setActiveId(area.id); setExpanded(false); }}
                  >
                    {area.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="risk-panel">
          <div className={`risk-panel__tier risk-panel__tier--${activeArea.tier}`}>
            {riskTierLabel[activeArea.tier]}
          </div>
          <h3>{activeArea.name}</h3>
          <p className="risk-panel__headline">{activeArea.headline}</p>
          <p className="risk-panel__summary">{activeArea.summary}</p>
          <div className="risk-panel__breakdown">
            {visibleBreakdown.map((item) => (
              <div key={item.key} className="risk-panel__row">
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.summary}</span>
                </div>
                <div className={`risk-score risk-score--${item.status}`}>{item.score}</div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              className="risk-panel__toggle"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded
                ? "Show less"
                : `Show all ${activeArea.breakdown.length} risk factors`}
            </button>
          )}
          <Link
            href={`/contact?service=risk-intelligence&area=${encodeURIComponent(activeArea.name)}`}
            className="button button--primary"
          >
            Book Risk Intelligence
          </Link>
        </aside>
      </div>

      <div className="map-shell__legend">
        <span className="legend-pill legend-pill--low">Low risk</span>
        <span className="legend-pill legend-pill--medium">Watch closely</span>
        <span className="legend-pill legend-pill--high">Elevated risk</span>
      </div>
    </div>
  );
}
