"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

import { RiskMapLayers } from "@/components/risk-map-layers";
import { mapAreas, riskLayers, scoreToTier } from "@/lib/data/map-areas";
import type { RiskLayerKey, RiskTier } from "@/lib/types";

const RiskMapCanvas = dynamic(() => import("./risk-map-canvas"), {
  ssr: false,
  loading: () => <div className="risk-map-canvas__placeholder">Loading map…</div>
});

type RiskMapProps = {
  variant?: "hero" | "page";
};

const tierLabels: Record<RiskTier, string> = {
  low: "Low risk",
  medium: "Watch closely",
  high: "Elevated risk"
};

const VISIBLE_BREAKDOWN_COUNT = 4;

export default function RiskMap({ variant = "page" }: RiskMapProps) {
  const [activeSlug, setActiveSlug] = useState("victoria-island");
  const [expanded, setExpanded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<RiskLayerKey | null>(null);

  const activeArea =
    mapAreas.find((area) => area.slug === activeSlug) ?? mapAreas[0];

  // Tier displayed per area: overall grade when no layer selected, otherwise
  // the single-layer score translated via scoreToTier.
  const tierBySlug = useMemo<Record<string, RiskTier>>(() => {
    if (!activeLayer) {
      return Object.fromEntries(mapAreas.map((area) => [area.slug, area.riskGrade]));
    }

    return Object.fromEntries(
      mapAreas.map((area) => [area.slug, scoreToTier(area.layerScores[activeLayer])])
    );
  }, [activeLayer]);

  const displayedTier = activeArea ? tierBySlug[activeArea.slug] : undefined;

  const handleSelect = useCallback((slug: string) => {
    setActiveSlug(slug);
    setExpanded(false);
  }, []);

  const handleLayerSelect = useCallback((key: RiskLayerKey | null) => {
    setActiveLayer(key);
  }, []);

  const visibleBreakdown = activeArea
    ? expanded
      ? activeArea.breakdown
      : activeArea.breakdown.slice(0, VISIBLE_BREAKDOWN_COUNT)
    : [];
  const hasMoreBreakdown =
    (activeArea?.breakdown.length ?? 0) > VISIBLE_BREAKDOWN_COUNT;

  if (!activeArea || !displayedTier) return null;

  const activeLayerMeta = activeLayer
    ? riskLayers.find((layer) => layer.key === activeLayer)
    : null;
  const activeLayerScore = activeLayer
    ? activeArea.layerScores[activeLayer]
    : null;

  return (
    <div className={`risk-map-surface risk-map-surface--${variant}`}>
      <div className="risk-map-surface__map">
        <div className="risk-map-surface__map-header">
          <span className="section-heading__eyebrow">Five launch neighbourhoods</span>
          <p>Click a district to pull its HIDD risk framing.</p>
        </div>

        <RiskMapLayers
          layers={riskLayers}
          activeLayer={activeLayer}
          onSelect={handleLayerSelect}
        />

        <div className="risk-map-canvas risk-map-canvas--live">
          <RiskMapCanvas
            areas={mapAreas}
            tierBySlug={tierBySlug}
            activeSlug={activeSlug}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <aside className="risk-map-summary">
        <div
          className={`risk-map-summary__tier risk-map-summary__tier--${displayedTier}`}
        >
          {tierLabels[displayedTier]}
          {activeLayerMeta && activeLayerScore !== null ? (
            <span className="risk-map-summary__tier-score">
              {activeLayerMeta.shortLabel} · {activeLayerScore}/100
            </span>
          ) : null}
        </div>
        <h3>{activeArea.name}</h3>

        <p className="risk-map-summary__headline">{activeArea.headline}</p>
        <p className="risk-map-summary__copy">{activeArea.summary}</p>

        <div className="risk-map-summary__breakdown">
          {visibleBreakdown.map((item) => (
            <div key={item.key} className="risk-panel__row">
              <div>
                <strong>{item.label}</strong>
                <span>{item.summary}</span>
              </div>
            </div>
          ))}
        </div>

        {hasMoreBreakdown ? (
          <button
            type="button"
            className="risk-map-summary__toggle"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded
              ? "Show fewer risk factors"
              : `Show all ${activeArea.breakdown.length} risk factors`}
          </button>
        ) : null}

        <div className="risk-map-summary__actions">
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
    </div>
  );
}
