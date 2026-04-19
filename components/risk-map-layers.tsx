"use client";

import type { RiskLayer, RiskLayerKey } from "@/lib/types";

type RiskMapLayersProps = {
  layers: RiskLayer[];
  activeLayer: RiskLayerKey | null;
  onSelect: (key: RiskLayerKey | null) => void;
};

const LEGEND_TIERS = [
  { key: "low", label: "Low risk", swatch: "#1f6a48" },
  { key: "medium", label: "Watch", swatch: "#a8772b" },
  { key: "high", label: "Elevated", swatch: "#8f1f28" }
] as const;

export function RiskMapLayers({ layers, activeLayer, onSelect }: RiskMapLayersProps) {
  const active = layers.find((layer) => layer.key === activeLayer) ?? null;

  const statusLine = active
    ? `Showing ${active.label.toLowerCase()} risk only`
    : "Showing HIDD overall risk grade";

  const helperLine = active
    ? active.description
    : "Tap a layer to recolour the map by that single risk. Tap it again to return to the overall grade.";

  return (
    <div className="risk-map-layers" role="group" aria-label="Risk intelligence layers">
      <div className="risk-map-layers__status">
        <strong>{statusLine}</strong>
        <span>{helperLine}</span>
      </div>

      <div className="risk-map-layers__chips" role="radiogroup" aria-label="Risk layer filter">
        <button
          type="button"
          role="radio"
          aria-checked={activeLayer === null}
          className={`risk-map-layers__chip ${activeLayer === null ? "is-active" : ""}`}
          onClick={() => onSelect(null)}
        >
          <span className="risk-map-layers__chip-label">Overall</span>
        </button>

        {layers.map((layer) => {
          const isActive = layer.key === activeLayer;
          const disabled = !layer.available;

          return (
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-disabled={disabled}
              key={layer.key}
              className={`risk-map-layers__chip ${isActive ? "is-active" : ""} ${
                disabled ? "is-disabled" : ""
              }`}
              onClick={() => !disabled && onSelect(isActive ? null : layer.key)}
              title={disabled ? "Coming soon" : layer.description}
            >
              <span className="risk-map-layers__chip-label">{layer.shortLabel}</span>
              {disabled ? (
                <span className="risk-map-layers__chip-status">Soon</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="risk-map-layers__legend" aria-label="Colour legend">
        {LEGEND_TIERS.map((tier) => (
          <span key={tier.key} className="risk-map-layers__legend-item">
            <span
              className="risk-map-layers__legend-swatch"
              style={{ background: tier.swatch }}
              aria-hidden="true"
            />
            {tier.label}
          </span>
        ))}
      </div>
    </div>
  );
}
