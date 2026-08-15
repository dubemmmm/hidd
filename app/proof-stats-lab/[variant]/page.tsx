import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProofStatsPrototype, PrototypeSwitcher } from "@/components/proof-stats-prototype";
import { isProofVariant, proofVariants } from "@/lib/proof-stats-lab";

import styles from "../proof-stats-lab.module.css";

type PrototypePageProps = {
  params: Promise<{ variant: string }> | { variant: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return proofVariants.map(({ slug }) => ({ variant: slug }));
}

export async function generateMetadata({ params }: PrototypePageProps): Promise<Metadata> {
  const { variant } = await Promise.resolve(params);
  const concept = proofVariants.find((item) => item.slug === variant);
  return {
    title: concept ? `${concept.name} Prototype` : "Proof Points Prototype",
    robots: { index: false, follow: false, nocache: true }
  };
}

export default async function PrototypePage({ params }: PrototypePageProps) {
  const { variant } = await Promise.resolve(params);
  if (!isProofVariant(variant)) notFound();
  const concept = proofVariants.find((item) => item.slug === variant)!;

  return (
    <div className={`${styles.lab} ${styles.focusPage}`}>
      <header className={styles.labIntro}>
        <div className="shell">
          <p className={styles.labLabel}>Temporary design lab · focused view</p>
          <h1>{concept.name}</h1>
          <p className={styles.labDescription}>{concept.summary}</p>
          <div className={styles.demoNotice} role="note">
            <strong>Demonstration figures only.</strong> This route is no-indexed and is not linked from the public navigation.
          </div>
          <PrototypeSwitcher active={variant} />
        </div>
      </header>
      <main className={styles.focusStage}>
        <div className="shell">
          <ProofStatsPrototype variant={variant} />
        </div>
      </main>
    </div>
  );
}
