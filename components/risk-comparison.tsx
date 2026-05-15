"use client";

import { useEffect, useMemo, useState } from "react";

import { riskLayers, scoreToTier } from "@/lib/data/map-areas";
import type { MapArea, RiskTier } from "@/lib/types";

type RiskComparisonProps = {
  areas: MapArea[];
};

const tierLabels: Record<RiskTier, string> = {
  low: "Low risk",
  medium: "Mid risk",
  high: "High risk"
};

const seriesStyles = [
  {
    stroke: "#1f5ca8",
    fill: "rgba(31, 92, 168, 0.18)",
    marker: "#1f5ca8"
  },
  {
    stroke: "#c59a3a",
    fill: "rgba(197, 154, 58, 0.18)",
    marker: "#c59a3a"
  },
  {
    stroke: "#8f3a30",
    fill: "rgba(143, 58, 48, 0.14)",
    marker: "#8f3a30"
  }
] as const;

const chartConfig = {
  width: 760,
  height: 620,
  centerX: 380,
  centerY: 300,
  radius: 246
};

const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function getPoint(angle: number, distance: number) {
  return {
    x: chartConfig.centerX + Math.cos(angle) * distance,
    y: chartConfig.centerY + Math.sin(angle) * distance
  };
}

function getPolygonString(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function getLabelAnchor(x: number) {
  if (Math.abs(x - chartConfig.centerX) < 16) return "middle";
  return x > chartConfig.centerX ? "start" : "end";
}

export default function RiskComparison({ areas }: RiskComparisonProps) {
  const maxCompare = 3;
  const initialCompareSlugs = areas.slice(0, 2).map((area) => area.slug);
  const [compareSlugs, setCompareSlugs] = useState(initialCompareSlugs);
  const [activeSlug, setActiveSlug] = useState(initialCompareSlugs[0] ?? "");

  useEffect(() => {
    if (areas.length === 0) return;

    const allowedSlugs = new Set(areas.map((area) => area.slug));
    const nextCompareSlugs = compareSlugs
      .filter((slug) => allowedSlugs.has(slug))
      .slice(0, maxCompare);

    if (nextCompareSlugs.length === 0) {
      nextCompareSlugs.push(...areas.slice(0, maxCompare).map((area) => area.slug));
    }

    if (nextCompareSlugs.join("|") !== compareSlugs.join("|")) {
      setCompareSlugs(nextCompareSlugs);
    }

    if (!nextCompareSlugs.includes(activeSlug)) {
      setActiveSlug(nextCompareSlugs[0] ?? "");
    }
  }, [activeSlug, areas, compareSlugs]);

  const comparedAreas = compareSlugs
    .map((slug) => areas.find((area) => area.slug === slug))
    .filter((area): area is MapArea => Boolean(area));

  const activeArea = comparedAreas.find((area) => area.slug === activeSlug) ?? comparedAreas[0];

  const chartAxes = useMemo(() => {
    const angleStep = (Math.PI * 2) / riskLayers.length;

    return riskLayers.map((layer, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const axisPoint = getPoint(angle, chartConfig.radius);
      const labelPoint = getPoint(angle, chartConfig.radius + 42);

      return {
        ...layer,
        angle,
        axisPoint,
        labelPoint
      };
    });
  }, []);

  const comparedSeries = comparedAreas.map((area, index) => {
    const style = seriesStyles[index % seriesStyles.length];
    const points = chartAxes.map((axis) =>
      getPoint(axis.angle, chartConfig.radius * (clampScore(area.layerScores[axis.key]) / 100))
    );

    return {
      area,
      style,
      points,
      polygon: getPolygonString(points)
    };
  });

  const factorRows = riskLayers.map((layer) => ({
    key: layer.key,
    label: layer.label,
    description: layer.description,
    cells: comparedAreas.map((area) => ({
      areaSlug: area.slug,
      tier: scoreToTier(area.layerScores[layer.key])
    }))
  }));

  const mobileSlots = Array.from({ length: maxCompare }, (_, index) => compareSlugs[index] ?? "");

  function commitCompareSlugs(nextValues: string[]) {
    const nextCompareSlugs: string[] = [];

    for (const value of nextValues) {
      if (!value || nextCompareSlugs.includes(value)) continue;
      nextCompareSlugs.push(value);
    }

    if (nextCompareSlugs.length === 0 && areas[0]) {
      nextCompareSlugs.push(areas[0].slug);
    }

    const trimmed = nextCompareSlugs.slice(0, maxCompare);
    setCompareSlugs(trimmed);

    if (!trimmed.includes(activeSlug)) {
      setActiveSlug(trimmed[0] ?? "");
    }
  }

  function handleToggleCompare(slug: string) {
    const isSelected = compareSlugs.includes(slug);

    if (isSelected) {
      if (compareSlugs.length === 1) return;

      const nextCompareSlugs = compareSlugs.filter((entry) => entry !== slug);
      setCompareSlugs(nextCompareSlugs);

      if (activeSlug === slug) {
        setActiveSlug(nextCompareSlugs[0] ?? "");
      }

      return;
    }

    if (compareSlugs.length >= maxCompare) return;

    setCompareSlugs([...compareSlugs, slug]);
    setActiveSlug(slug);
  }

  function handleMobileSlotChange(index: number, value: string) {
    const nextValues = [...mobileSlots];
    nextValues[index] = value;
    commitCompareSlugs(nextValues);
  }

  if (!activeArea) return null;

  return (
    <div className="risk-map-surface risk-map-surface--page">
      <div className="risk-map-surface__map">
        <div className="risk-map-surface__map-header">
          <span className="section-heading__eyebrow">Five launch neighbourhoods</span>
        </div>

        <div className="risk-radar-controls">
          <div className="risk-radar-controls__copy">
            <strong>Choose the locations to compare</strong>
            <span>
              Build the comparison set below. The chart shows shape and relative exposure, while
              the table underneath translates each factor into a public-facing risk band.
            </span>
          </div>

          <div className="risk-radar-mobile-selects" aria-label="Mobile neighbourhood selectors">
            {mobileSlots.map((slotValue, index) => {
              const selectedElsewhere = new Set(
                mobileSlots.filter((value, slotIndex) => slotIndex !== index && value)
              );

              return (
                <label key={`mobile-slot-${index}`} className="risk-radar-mobile-select">
                  <span>Compare {index + 1}</span>
                  <select
                    value={slotValue}
                    onChange={(event) => handleMobileSlotChange(index, event.target.value)}
                  >
                    {index > 0 ? <option value="">None</option> : null}
                    {areas.map((area) => (
                      <option
                        key={area.slug}
                        value={area.slug}
                        disabled={selectedElsewhere.has(area.slug)}
                      >
                        {area.name}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>

          <div className="risk-radar-chips" role="group" aria-label="Neighbourhood comparison set">
            {areas.map((area) => {
              const isSelected = compareSlugs.includes(area.slug);
              const isDisabled = !isSelected && compareSlugs.length >= maxCompare;

              return (
                <button
                  key={area.slug}
                  type="button"
                  className={`risk-radar-chip ${isSelected ? "is-selected" : ""} ${
                    isDisabled ? "is-disabled" : ""
                  }`}
                  aria-pressed={isSelected}
                  aria-disabled={isDisabled}
                  onClick={() => handleToggleCompare(area.slug)}
                >
                  <span className="risk-radar-chip__title">{area.name}</span>
                  <span className={`risk-radar-chip__tier risk-radar-chip__tier--${area.riskGrade}`}>
                    {tierLabels[area.riskGrade]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="risk-radar-layout risk-radar-layout--page">
          <div className="risk-radar-chart-shell">
            <div className="risk-radar-legend" aria-label="Selected comparison locations">
              {comparedSeries.map((series) => (
                <button
                  key={series.area.slug}
                  type="button"
                  className={`risk-radar-legend__item ${
                    activeArea.slug === series.area.slug ? "is-active" : ""
                  }`}
                  onClick={() => setActiveSlug(series.area.slug)}
                >
                  <span
                    className="risk-radar-legend__swatch"
                    style={{
                      backgroundColor: series.style.fill,
                      borderColor: series.style.stroke
                    }}
                    aria-hidden="true"
                  />
                  <span>{series.area.name}</span>
                </button>
              ))}
            </div>

            <div className="risk-radar-chart-frame">
              <svg
                viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
                className="risk-radar-chart"
                role="img"
                aria-label="Radar chart comparing neighbourhood risk dimensions"
              >
                {gridLevels.map((level) => {
                  const points = chartAxes.map((axis) =>
                    getPoint(axis.angle, chartConfig.radius * level)
                  );

                  return (
                    <polygon
                      key={level}
                      points={getPolygonString(points)}
                      className="risk-radar-chart__grid"
                    />
                  );
                })}

                {chartAxes.map((axis) => (
                  <line
                    key={axis.key}
                    x1={chartConfig.centerX}
                    y1={chartConfig.centerY}
                    x2={axis.axisPoint.x}
                    y2={axis.axisPoint.y}
                    className="risk-radar-chart__axis"
                  />
                ))}

                {comparedSeries.map((series) => (
                  <g key={series.area.slug}>
                    <polygon
                      points={series.polygon}
                      className={`risk-radar-chart__shape ${
                        activeArea.slug === series.area.slug ? "is-active" : ""
                      }`}
                      style={{
                        fill: series.style.fill,
                        stroke: series.style.stroke
                      }}
                      onClick={() => setActiveSlug(series.area.slug)}
                    />

                    {series.points.map((point, index) => (
                      <circle
                        key={`${series.area.slug}-${chartAxes[index].key}`}
                        cx={point.x}
                        cy={point.y}
                        r={activeArea.slug === series.area.slug ? 8.5 : 7}
                        className="risk-radar-chart__marker"
                        style={{
                          fill: series.style.marker,
                          stroke: "#ffffff"
                        }}
                      />
                    ))}
                  </g>
                ))}

                {chartAxes.map((axis) => (
                  <text
                    key={`${axis.key}-label`}
                    x={axis.labelPoint.x}
                    y={axis.labelPoint.y}
                    textAnchor={getLabelAnchor(axis.labelPoint.x)}
                    className="risk-radar-chart__label"
                  >
                    {axis.shortLabel}
                  </text>
                ))}
              </svg>
            </div>

            <div className="risk-radar-scale-note">
              <strong>Reading the chart</strong>
              <span>Closer to the edge means higher relative risk exposure on that dimension.</span>
            </div>

            <div className="risk-radar-table">
              <div className="risk-radar-table__intro">
                <strong>Factor comparison table</strong>
                <span>
                  Each cell translates the hidden score into a public-facing risk band for the
                  selected neighbourhood.
                </span>
              </div>

              <div className="risk-radar-table__wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Factor</th>
                      {comparedAreas.map((area) => (
                        <th key={area.slug} scope="col">
                          <div className="risk-radar-table__heading">
                            <span>{area.name}</span>
                            <small>{tierLabels[area.riskGrade]}</small>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {factorRows.map((row) => (
                      <tr key={row.key}>
                        <th scope="row">
                          <div className="risk-radar-table__factor">
                            <strong>{row.label}</strong>
                            <span>{row.description}</span>
                          </div>
                        </th>
                        {row.cells.map((cell) => (
                          <td key={`${row.key}-${cell.areaSlug}`}>
                            <span
                              className={`risk-radar-table__tier risk-radar-table__tier--${cell.tier}`}
                            >
                              {tierLabels[cell.tier]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="risk-radar-mobile-list">
                {factorRows.map((row) => (
                  <article key={row.key} className="risk-radar-mobile-card">
                    <div className="risk-radar-mobile-card__factor">
                      <strong>{row.label}</strong>
                      <span>{row.description}</span>
                    </div>

                    <div className="risk-radar-mobile-card__cells">
                      {row.cells.map((cell, index) => {
                        const area = comparedAreas[index];

                        if (!area) {
                          return null;
                        }

                        return (
                          <div
                            key={`${row.key}-${cell.areaSlug}-mobile`}
                            className="risk-radar-mobile-card__cell"
                          >
                            <span>{area.name}</span>
                            <strong
                              className={`risk-radar-table__tier risk-radar-table__tier--${cell.tier}`}
                            >
                              {tierLabels[cell.tier]}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
