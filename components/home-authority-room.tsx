"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import type { AuthorityMetric } from "@/lib/authority-metric-types";

import styles from "./home-authority-room.module.css";

type DisplayMetric = {
  id: string;
  value: number;
  prefix: string;
  suffix: string;
  decimalPlaces: number;
  label: string;
  category: string;
  note: string;
};

type HomeAuthorityRoomProps = {
  districtCount: number;
  caseStudyCount: number;
  authorityMetrics: AuthorityMetric[];
};

const markerPositions = [
  { x: "4%", y: "9%", dx: "-54px", dy: "-30px" },
  { x: "73%", y: "9%", dx: "54px", dy: "-30px" },
  { x: "1%", y: "43%", dx: "-65px", dy: "0px" },
  { x: "76%", y: "43%", dx: "65px", dy: "0px" },
  { x: "8%", y: "75%", dx: "-35px", dy: "48px" },
  { x: "68%", y: "75%", dx: "35px", dy: "48px" }
] as const;

function RollingNumber({ metric, entered, delay }: { metric: DisplayMetric; entered: boolean; delay: number }) {
  const { value, decimalPlaces, prefix, suffix } = metric;
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!entered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    setDisplayValue(0);
    let frame = 0;
    let startedAt = 0;
    const duration = 850;
    const tick = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const elapsed = Math.max(0, timestamp - startedAt - delay);
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const precision = 10 ** decimalPlaces;
      setDisplayValue(Math.round(value * eased * precision) / precision);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [delay, entered, value]);

  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(displayValue);

  return (
    <span className={styles.rollingNumber}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function HomeAuthorityRoom({ districtCount, caseStudyCount, authorityMetrics }: HomeAuthorityRoomProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const frameworkMetrics: DisplayMetric[] = [
    {
      id: "disciplines",
      value: 4,
      prefix: "",
      suffix: "",
      decimalPlaces: 0,
      category: "Professional review",
      label: "Specialist disciplines",
      note: "Inspection, legal due diligence, location-risk intelligence, and valuation can be reviewed together or engaged separately."
    },
    {
      id: "districts",
      value: districtCount,
      prefix: "",
      suffix: "",
      decimalPlaces: 0,
      category: "Location intelligence",
      label: "District profiles",
      note: "Each published district brief gives buyers a dated view of the location factors that may affect a property decision."
    },
    {
      id: "dimensions",
      value: 7,
      prefix: "",
      suffix: "",
      decimalPlaces: 0,
      category: "Risk methodology",
      label: "Fixed scoring dimensions",
      note: "Every district is assessed against the same seven dimensions so comparisons retain a consistent basis."
    },
    {
      id: "verdicts",
      value: 3,
      prefix: "",
      suffix: "",
      decimalPlaces: 0,
      category: "Decision clarity",
      label: "Report verdict positions",
      note: "The Comprehensive Report concludes with one clear position: Proceed, Proceed with Conditions, or Do Not Proceed."
    },
    {
      id: "cases",
      value: caseStudyCount,
      prefix: "",
      suffix: "",
      decimalPlaces: 0,
      category: "Applied evidence",
      label: "Published buyer cases",
      note: "The case-study archive shows how inspection, title, location, and valuation findings changed real property decisions."
    },
    {
      id: "buyer-side",
      value: 1,
      prefix: "",
      suffix: "",
      decimalPlaces: 0,
      category: "Independent mandate",
      label: "Side represented: the buyer",
      note: "HIDD works for the buyer—not the seller, agent, or developer involved in the property under review."
    }
  ];

  const verifiedMetrics: DisplayMetric[] = authorityMetrics.map((metric) => ({
    id: metric.id,
    value: metric.value,
    prefix: metric.prefix,
    suffix: metric.suffix,
    decimalPlaces: metric.decimalPlaces,
    label: metric.metricName,
    category: metric.category,
    note: metric.shortDescription
  }));
  const metrics = verifiedMetrics.length > 0 ? verifiedMetrics : frameworkMetrics;

  const activeMetric = metrics[activeIndex];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true);
      return;
    }

    setMotionReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    const fallback = window.setTimeout(() => setEntered(true), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${motionReady ? styles.motionReady : ""} ${entered ? styles.entered : ""}`}
    >
      <div className="shell shell--hero">
        <div className={styles.intro}>
          <div>
            <p className={styles.context}>HIDD evidence framework</p>
            <h2>What stands behind a HIDD recommendation.</h2>
          </div>
        </div>

        <div className={styles.room}>
          <div className={styles.registerHeader}>
            <span>Evidence register</span>
            <strong>{metrics.length} disclosed indicators</strong>
          </div>
          <span className={styles.scan} aria-hidden="true" />
          <div className={styles.axisHorizontal} aria-hidden="true" />
          <div className={styles.axisVertical} aria-hidden="true" />

          <article className={styles.report} aria-live="polite">
            <div className={styles.reportMasthead}>
              <span className={styles.seal}>H</span>
              <div>
                <span>Decision evidence</span>
              </div>
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(metrics.length).padStart(2, "0")}</span>
            </div>
            <p className={styles.reportCategory}>{activeMetric.category}</p>
            <strong className={styles.reportNumber}>
              <RollingNumber metric={activeMetric} entered={entered} delay={260} />
            </strong>
            <h3>{activeMetric.label}</h3>
            <p className={styles.reportNote}>{activeMetric.note}</p>
          </article>

          <div className={styles.markers} aria-label="Evidence behind HIDD recommendations">
            {metrics.map((metric, index) => (
              <button
                type="button"
                key={metric.id}
                className={`${styles.marker} ${index === activeIndex ? styles.markerActive : ""}`}
                style={{
                  "--marker-x": markerPositions[index].x,
                  "--marker-y": markerPositions[index].y,
                  "--marker-dx": markerPositions[index].dx,
                  "--marker-dy": markerPositions[index].dy,
                  "--marker-delay": `${180 + index * 90}ms`
                } as CSSProperties}
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
              >
                <span>{metric.category}</span>
                <strong><RollingNumber metric={metric} entered={entered} delay={220 + index * 70} /></strong>
                <small>{metric.label}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <p>Select an evidence point to see what supports it.</p>
          <div>
            <Link href="/risk-map/methodology">Review the methodology</Link>
            <Link href="/case-studies">Read buyer case studies</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
