import type { Metadata } from "next";
import Link from "next/link";

import { ProofStatsPrototype, PrototypeSwitcher } from "@/components/proof-stats-prototype";
import { proofVariants } from "@/lib/proof-stats-lab";

import styles from "./proof-stats-lab.module.css";

export const metadata: Metadata = {
  title: "Proof Points Prototype Lab",
  description: "Temporary design concepts for HIDD Advisory's homepage proof points.",
  robots: { index: false, follow: false, nocache: true }
};

export default function ProofStatsLabPage() {
  return (
    <div className={styles.lab}>
      <header className={styles.labIntro}>
        <div className="shell">
          <p className={styles.labLabel}>Temporary design lab · not indexed</p>
          <h1>The Decision Room.</h1>
          <p className={styles.labDescription}>
            The retained proof-point direction for HIDD&apos;s homepage. The real homepage has not been changed.
          </p>
          <div className={styles.demoNotice} role="note">
            <strong>Demonstration figures only.</strong> Replace every number with a verified HIDD total before publishing.
          </div>
          <PrototypeSwitcher />
        </div>
      </header>

      <div className={styles.gallery}>
        {proofVariants.map((variant, index) => (
          <article className={styles.galleryItem} key={variant.slug}>
            <div className={`shell ${styles.galleryMeta}`}>
              <div>
                <span>Concept {index + 1} of {proofVariants.length}</span>
                <h2>{variant.name}</h2>
                <p>{variant.summary}</p>
              </div>
              <Link href={`/proof-stats-lab/${variant.slug}`}>Open focused view →</Link>
            </div>
            <div className="shell">
              <ProofStatsPrototype variant={variant.slug} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
