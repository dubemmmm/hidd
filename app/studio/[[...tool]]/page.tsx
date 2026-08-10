import { StudioShell } from "@/components/studio-shell";
import { sanityEnvReady } from "@/lib/sanity";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: { index: false, follow: false }
};

export default function StudioPage() {
  if (!sanityEnvReady) {
    return (
      <section className="section">
        <div className="shell shell--support">
          <div className="content-panel">
            <div className="section-heading__eyebrow">Sanity Studio</div>
            <h1>Connect Sanity to enable editorial publishing.</h1>
            <p>
              Add `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and
              `NEXT_PUBLIC_SANITY_API_VERSION` to your environment, then reload this route.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return <StudioShell />;
}
