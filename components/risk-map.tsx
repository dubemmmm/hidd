"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { RiskMapLayers } from "@/components/risk-map-layers";
import { riskLayers, scoreToTier } from "@/lib/data/map-areas";
import type { MapArea, RiskLayerKey, RiskTier } from "@/lib/types";

const RiskMapCanvas = dynamic(() => import("./risk-map-canvas"), {
  ssr: false,
  loading: () => <div className="risk-map-canvas__placeholder">Loading map…</div>
});

type RiskMapProps = {
  areas: MapArea[];
  variant?: "hero" | "page";
};

const tierLabels: Record<RiskTier, string> = {
  low: "Low risk",
  medium: "Mid risk",
  high: "High risk"
};

export default function RiskMap({ areas, variant = "page" }: RiskMapProps) {
  const [activeSlug, setActiveSlug] = useState(areas[0]?.slug ?? "");
  const [activeLayer, setActiveLayer] = useState<RiskLayerKey | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const showLayerControls = variant !== "hero";

  useEffect(() => {
    if (areas.length === 0) return;
    if (!areas.some((area) => area.slug === activeSlug)) {
      setActiveSlug(areas[0].slug);
    }
  }, [activeSlug, areas]);

  const activeArea = areas.find((area) => area.slug === activeSlug) ?? areas[0];

  const tierBySlug = useMemo<Record<string, RiskTier>>(() => {
    if (!showLayerControls || !activeLayer) {
      return Object.fromEntries(areas.map((area) => [area.slug, area.riskGrade]));
    }

    return Object.fromEntries(
      areas.map((area) => [area.slug, scoreToTier(area.layerScores[activeLayer])])
    );
  }, [activeLayer, areas, showLayerControls]);

  const displayedTier = activeArea ? tierBySlug[activeArea.slug] : undefined;

  const handleSelect = useCallback((slug: string) => {
    setActiveSlug(slug);
    setIsPopupOpen(true);
  }, []);

  const handleLayerSelect = useCallback((key: RiskLayerKey | null) => {
    setActiveLayer(key);
  }, []);

  if (!activeArea || !displayedTier) return null;

  return (
    <div className={`risk-map-surface risk-map-surface--${variant}`}>
      <div className="risk-map-surface__map">
        <div className="risk-map-surface__map-header">
          <span className="section-heading__eyebrow">Prime Lagos</span>
          <p>Select a district to view its HIDD risk framing and open the full district brief.</p>
        </div>

        {showLayerControls ? (
          <RiskMapLayers
            layers={riskLayers}
            activeLayer={activeLayer}
            onSelect={handleLayerSelect}
          />
        ) : null}

        <div className="risk-map-stage">
          <div className="risk-map-canvas risk-map-canvas--live">
            <RiskMapCanvas
              areas={areas}
              tierBySlug={tierBySlug}
              activeSlug={activeSlug}
              onSelect={handleSelect}
            />
          </div>

          {isPopupOpen ? (
            <aside
              className={`risk-map-popup risk-map-popup--${variant}`}
              role="dialog"
              aria-modal="false"
              aria-label={`${activeArea.name} risk details`}
            >
              <button
                type="button"
                className="risk-map-popup__close"
                aria-label="Close location details"
                onClick={() => setIsPopupOpen(false)}
              >
                ×
              </button>

              <div
                className={`risk-map-popup__tier risk-map-popup__tier--${displayedTier}`}
              >
                {tierLabels[displayedTier]}
              </div>

              <div className="risk-map-popup__header">
                <div>
                  <h3>{activeArea.name}</h3>
                  <p className="risk-map-popup__headline">{activeArea.headline}</p>
                </div>
              </div>

              <div className="risk-map-popup__meta">
                <div>
                  <span>Assessment date</span>
                  <strong>{activeArea.assessmentDate}</strong>
                </div>
                <div>
                  <span>Analyst</span>
                  <strong>{activeArea.analyst}</strong>
                </div>
                <div>
                  <span>Red flag</span>
                  <strong>{activeArea.redFlag}</strong>
                </div>
              </div>

              <p className="risk-map-popup__copy">{activeArea.summary}</p>

              <div className="risk-map-popup__assessment">
                {activeArea.assessmentCategories.map((category) => (
                  <article key={category.key} className="risk-map-assessment-card">
                    <div className="risk-map-assessment-card__header">
                      <span>{category.title}</span>
                    </div>
                    <div className="risk-map-assessment-card__items">
                      {category.indicators.map((indicator) => (
                        <div key={indicator.code} className="risk-map-assessment-item">
                          <div className="risk-map-assessment-item__meta">
                            <span>{indicator.code}</span>
                          </div>
                          <div className="risk-map-assessment-item__copy">
                            <strong>{indicator.label}</strong>
                            <p>{indicator.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="risk-map-popup__actions">
                <Link
                  href={`/risk-map/${activeArea.slug}`}
                  className="button button--primary"
                >
                  Open district brief
                </Link>
                <Link
                  href={`/contact?service=risk-intelligence&area=${encodeURIComponent(activeArea.name)}`}
                  className="button button--ghost"
                >
                  Book Risk Intelligence
                </Link>
              </div>
            </aside>
          ) : (
            <div className="risk-map-popup-placeholder">
              <strong>Select a district</strong>
              <span>Choose a Prime Lagos district to review its risk framing.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
