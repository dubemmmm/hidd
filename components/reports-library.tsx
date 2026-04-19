"use client";

import { useMemo, useState } from "react";

import type { ReportAsset } from "@/lib/types";

type ReportsLibraryProps = {
  assets: ReportAsset[];
  initialAssetSlug?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const ALL_CATEGORIES = "All";
const CATEGORY_FILTER_THRESHOLD = 4;

export function ReportsLibrary({ assets, initialAssetSlug }: ReportsLibraryProps) {
  const firstLive = assets.find((asset) => asset.status === "live");
  const defaultSlug = initialAssetSlug ?? firstLive?.slug ?? assets[0]?.slug ?? "";

  const [activeSlug, setActiveSlug] = useState(defaultSlug);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [status, setStatus] = useState<Status>("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [downloadHref, setDownloadHref] = useState("");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(assets.map((asset) => asset.category)));
    return [ALL_CATEGORIES, ...unique];
  }, [assets]);

  const showCategoryFilter = categories.length - 1 >= CATEGORY_FILTER_THRESHOLD;

  const filteredAssets = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) return assets;
    return assets.filter((asset) => asset.category === activeCategory);
  }, [activeCategory, assets]);

  const liveAssets = filteredAssets.filter((asset) => asset.status === "live");
  const upcomingAssets = filteredAssets.filter((asset) => asset.status === "coming-soon");

  const activeAsset = useMemo(
    () => assets.find((asset) => asset.slug === activeSlug) ?? assets[0],
    [activeSlug, assets]
  );

  function selectAsset(slug: string) {
    setActiveSlug(slug);
    setStatus("idle");
    setResponseMessage("");
    setDownloadHref("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAsset) return;

    setStatus("submitting");
    setResponseMessage("");
    setDownloadHref("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/report-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          assetSlug: activeAsset.slug,
          website: formData.get("website"),
          submittedAt: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Request failed");
      }

      setStatus("success");
      setResponseMessage(result.message ?? "Access request recorded.");
      setDownloadHref(result.assetUrl ?? "");
    } catch (error) {
      setStatus("error");
      setResponseMessage(
        error instanceof Error ? error.message : "Something went wrong while requesting the asset."
      );
    }
  }

  if (!activeAsset) return null;

  return (
    <div className="reports-library">
      <div className="reports-library__stack">
        {showCategoryFilter ? (
          <div className="reports-library__filters" role="tablist" aria-label="Filter reports by category">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                role="tab"
                aria-selected={category === activeCategory}
                className={`reports-library__filter ${category === activeCategory ? "is-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        ) : null}

        {liveAssets.length > 0 ? (
          <ReportGroup
            heading="Available now"
            count={liveAssets.length}
            description="Unlock these assets instantly with your email."
            assets={liveAssets}
            activeSlug={activeSlug}
            onSelect={selectAsset}
          />
        ) : null}

        {upcomingAssets.length > 0 ? (
          <ReportGroup
            heading="Upcoming releases"
            count={upcomingAssets.length}
            description="Join the waitlist and HIDD will notify you on release."
            assets={upcomingAssets}
            activeSlug={activeSlug}
            onSelect={selectAsset}
          />
        ) : null}

        {filteredAssets.length === 0 ? (
          <p className="reports-library__empty">No reports in this category yet.</p>
        ) : null}
      </div>

      <div className="reports-library__panel">
        <div className="reports-library__panel-copy">
          <span className="section-heading__eyebrow">
            {activeAsset.status === "live" ? "Selected asset" : "Waitlist asset"}
          </span>
          <h3>{activeAsset.title}</h3>
          <p>{activeAsset.summary}</p>
        </div>

        <form className="reports-library__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>Full Name</span>
              <input type="text" name="name" placeholder="Adaora Okafor" required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
          </div>

          <label className="field field--hidden" aria-hidden="true">
            <span>Website</span>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="reports-library__form-footer">
            <button type="submit" className="button button--primary" disabled={status === "submitting"}>
              {status === "submitting"
                ? "Submitting..."
                : activeAsset.status === "live"
                  ? "Unlock asset"
                  : "Join waitlist"}
            </button>
            <p className={`form-message form-message--${status}`}>
              {status === "idle" &&
                (activeAsset.status === "live"
                  ? "Enter your email to unlock the current release."
                  : "Register interest and HIDD will notify you when this asset is released.")}
              {status === "success" && responseMessage}
              {status === "error" && responseMessage}
            </p>
          </div>
        </form>

        {downloadHref ? (
          <div className="reports-library__download">
            <span className="section-heading__eyebrow">Access granted</span>
            <a href={downloadHref} className="button button--ghost" download>
              Download current asset file
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type ReportGroupProps = {
  heading: string;
  description: string;
  count: number;
  assets: ReportAsset[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

function ReportGroup({ heading, description, count, assets, activeSlug, onSelect }: ReportGroupProps) {
  return (
    <section className="reports-library__group" aria-label={heading}>
      <header className="reports-library__group-header">
        <div>
          <h4 className="reports-library__group-title">
            {heading}
            <span className="reports-library__group-count">{count}</span>
          </h4>
          <p className="reports-library__group-description">{description}</p>
        </div>
      </header>
      <div className="reports-library__rail">
        {assets.map((asset) => (
          <button
            type="button"
            key={asset.slug}
            className={`report-card ${asset.slug === activeSlug ? "is-active" : ""}`}
            onClick={() => onSelect(asset.slug)}
          >
            <span className="report-card__category">{asset.category}</span>
            <strong>{asset.title}</strong>
            <p>{asset.summary}</p>
            <span className={`report-card__status report-card__status--${asset.status}`}>
              {asset.status === "live" ? "Launch-ready asset" : "Coming soon"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
