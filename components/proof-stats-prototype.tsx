"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import {
  proofMetrics,
  proofVariants,
  type ProofMetric,
  type ProofVariant
} from "@/lib/proof-stats-lab";

import styles from "@/app/proof-stats-lab/proof-stats-lab.module.css";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function useEntered<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, entered };
}

function selectWithTransition(update: () => void) {
  const transitionDocument = document as ViewTransitionDocument;
  if (transitionDocument.startViewTransition) {
    transitionDocument.startViewTransition(update);
  } else {
    update();
  }
}

function RollingNumber({ metric, entered, delay = 0 }: { metric: ProofMetric; entered: boolean; delay?: number }) {
  const formatted = `${metric.prefix}${new Intl.NumberFormat("en-NG").format(metric.value)}${metric.suffix}`;

  return (
    <span className={styles.rollingNumber} aria-label={formatted}>
      <span aria-hidden="true">
        {[...formatted].map((character, index) => {
          const digit = Number(character);
          if (Number.isNaN(digit)) {
            return <span className={styles.fixedCharacter} key={`${character}-${index}`}>{character}</span>;
          }
          return (
            <span className={styles.digitWindow} key={`${character}-${index}`}>
              <span
                className={styles.digitTrack}
                data-entered={entered ? "true" : "false"}
                style={{
                  "--digit": digit,
                  "--digit-delay": `${delay + index * 48}ms`
                } as CSSProperties}
              >
                {Array.from({ length: 10 }, (_, item) => <span key={item}>{item}</span>)}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

function VerificationTag({ metric }: { metric: ProofMetric }) {
  return (
    <span className={`${styles.verificationTag} ${metric.verification === "site-verified" ? styles.verified : ""}`}>
      {metric.verification === "site-verified" ? "Confirmed from current website" : "Demonstration total"}
    </span>
  );
}

function DecisionRoom() {
  const { ref, entered } = useEntered<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(6);
  const activeMetric = proofMetrics[activeIndex];
  const positions = [
    { x: "5%", y: "8%", dx: "-70px", dy: "-40px" },
    { x: "38%", y: "4%", dx: "0px", dy: "-70px" },
    { x: "72%", y: "9%", dx: "70px", dy: "-50px" },
    { x: "3%", y: "61%", dx: "-80px", dy: "30px" },
    { x: "73%", y: "62%", dx: "80px", dy: "30px" },
    { x: "22%", y: "77%", dx: "-30px", dy: "70px" },
    { x: "55%", y: "79%", dx: "30px", dy: "70px" }
  ];

  return (
    <section ref={ref} className={`${styles.prototype} ${styles.decisionRoom} ${entered ? styles.entered : ""}`}>
      <div className={styles.roomTopline}>
        <h2>Put every signal on the table.</h2>
        <p>Select any evidence marker to inspect its basis.</p>
      </div>
      <div className={styles.assessmentTable}>
        <span className={styles.tableSweep} aria-hidden="true" />
        {proofMetrics.map((metric, index) => (
          <button
            type="button"
            key={metric.key}
            className={`${styles.evidenceMarker} ${index === activeIndex ? styles.markerActive : ""}`}
            style={{
              "--marker-x": positions[index].x,
              "--marker-y": positions[index].y,
              "--marker-dx": positions[index].dx,
              "--marker-dy": positions[index].dy,
              "--marker-delay": `${180 + index * 85}ms`
            } as CSSProperties}
            onClick={() => selectWithTransition(() => setActiveIndex(index))}
            aria-pressed={index === activeIndex}
          >
            <span>{metric.category}</span>
            <strong><RollingNumber metric={metric} entered={entered} delay={250 + index * 75} /></strong>
            <small>{metric.label}</small>
          </button>
        ))}

        <article className={styles.decisionReport}>
          <span className={styles.reportBinding} aria-hidden="true" />
          <div className={styles.reportSeal}>H</div>
          <VerificationTag metric={activeMetric} />
          <span className={styles.reportLabel}>Selected evidence</span>
          <h3>{activeMetric.label}</h3>
          <p>{activeMetric.note}</p>
          <div className={styles.reportVerdictLine}>
            <span>Evidence indexed</span>
            <strong>{String(activeIndex + 1).padStart(2, "0")}/{String(proofMetrics.length).padStart(2, "0")}</strong>
          </div>
        </article>
      </div>
    </section>
  );
}

export function ProofStatsPrototype({ variant: _variant }: { variant: ProofVariant }) {
  return <DecisionRoom />;
}

export function PrototypeSwitcher({ active }: { active?: ProofVariant }) {
  return (
    <nav className={styles.switcher} aria-label="Proof point concepts">
      <Link href="/proof-stats-lab" className={!active ? styles.activeLink : undefined}>Overview</Link>
      {proofVariants.map((variant) => (
        <Link
          key={variant.slug}
          href={`/proof-stats-lab/${variant.slug}`}
          className={active === variant.slug ? styles.activeLink : undefined}
        >
          {variant.name.replace("The ", "")}
        </Link>
      ))}
    </nav>
  );
}
