"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { requiresReportEmail } from "@/lib/report-access-policy";
import type { ReportAsset } from "@/lib/types";

type ReportsLibraryProps = {
  assets: ReportAsset[];
  initialAssetSlug?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const ALL_CATEGORIES = "All";
const INITIAL_GROUP_SIZE = 6;

export function ReportsLibrary({ assets, initialAssetSlug }: ReportsLibraryProps) {
  const firstLive = assets.find((asset) => asset.status === "live");
  const defaultSlug = initialAssetSlug ?? firstLive?.slug ?? assets[0]?.slug ?? "";

  const [activeSlug, setActiveSlug] = useState(defaultSlug);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [downloadHref, setDownloadHref] = useState("");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(assets.map((asset) => asset.category)));
    return [ALL_CATEGORIES, ...unique];
  }, [assets]);

  const showCategoryFilter = categories.length > 2;

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesCategory = activeCategory === ALL_CATEGORIES || asset.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      return [
        asset.title,
        asset.summary,
        asset.category,
        ...(asset.intendedAudience ?? []),
        ...(asset.coverageAreas ?? [])
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [activeCategory, assets, query]);

  const liveAssets = filteredAssets.filter((asset) => asset.status === "live");
  const upcomingAssets = filteredAssets.filter((asset) => asset.status === "coming-soon");

  const activeAsset = useMemo(
    () => filteredAssets.find((asset) => asset.slug === activeSlug) ?? filteredAssets[0],
    [activeSlug, filteredAssets]
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
          formConfirmation: formData.get("formConfirmation"),
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
        error instanceof Error ? error.message : "Something went wrong while requesting the resource."
      );
    }
  }

  if (assets.length === 0) {
    return (
      <div className="reports-library reports-library--empty-state">
        <div className="reports-library__empty-card">
          <span className="section-heading__eyebrow">Resources in preparation</span>
          <h3>New buyer resources are coming soon.</h3>
          <p>
            HIDD reports, checklists, and practical property guides will appear here as they are
            released. In the meantime, our articles remain available without registration.
          </p>
          <Link href="#browse-articles" className="button button--ghost">
            Browse buyer articles
          </Link>
        </div>
      </div>
    );
  }

  const emailRequired = activeAsset ? requiresReportEmail(activeAsset) : true;

  return (
    <div className="reports-library">
      <div className="reports-library__stack">
        <div className="reports-library__toolbar">
          <label className="reports-library__search">
            <span>Search resources</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search reports, checklists, and guides"
            />
          </label>
          <span className="reports-library__result-count">
            {filteredAssets.length} {filteredAssets.length === 1 ? "resource" : "resources"}
          </span>
        </div>

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
            description="PDF reports and checklists are provided after a short name and email form."
            assets={liveAssets}
            activeSlug={activeAsset?.slug ?? ""}
            onSelect={selectAsset}
            initialSize={INITIAL_GROUP_SIZE}
          />
        ) : null}

        {upcomingAssets.length > 0 ? (
          <ReportGroup
            heading="Upcoming releases"
            count={upcomingAssets.length}
            description="Join the release list and HIDD will notify you when these resources become available."
            assets={upcomingAssets}
            activeSlug={activeAsset?.slug ?? ""}
            onSelect={selectAsset}
            initialSize={INITIAL_GROUP_SIZE}
          />
        ) : null}

        {filteredAssets.length === 0 ? (
          <div className="reports-library__empty reports-library__empty--filtered">
            <strong>No matching resources</strong>
            <p>Try a different search term or view all resource types.</p>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                setQuery("");
                setActiveCategory(ALL_CATEGORIES);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      {activeAsset ? <div className="reports-library__panel">
        <div className="reports-library__panel-copy">
          <span className="section-heading__eyebrow">
            {activeAsset.status === "live" ? "Selected resource" : "Upcoming resource"}
          </span>
          <h3>{activeAsset.title}</h3>
          <p>{activeAsset.summary}</p>
          <Link href={`/insights/resources/${activeAsset.slug}`} className="reports-library__detail-link">
            View full resource details →
          </Link>
        </div>

        {activeAsset.status === "live" && !emailRequired && activeAsset.assetUrl ? (
          <div className="reports-library__download reports-library__download--direct">
            <p>This resource is available without registration.</p>
            <a href={activeAsset.assetUrl} className="button button--primary" download>
              Download resource
            </a>
          </div>
        ) : (
        <form className="reports-library__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>Full Name</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>

          <div className="field--hidden" aria-hidden="true">
            <input
              type="text"
              name="formConfirmation"
              tabIndex={-1}
              autoComplete="new-password"
              data-1p-ignore
              data-lpignore="true"
            />
          </div>

          <p className="form-privacy">
            We use your details to provide the selected resource or notify you when an upcoming
            resource is released. Available downloads are provided immediately after submission.
            See our <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>

          <div className="reports-library__form-footer">
            <button type="submit" className="button button--primary" disabled={status === "submitting"}>
              {status === "submitting"
                ? "Submitting..."
                : activeAsset.status === "live"
                  ? "Get resource"
                  : "Join waitlist"}
            </button>
            <p className={`form-message form-message--${status}`}>
              {status === "idle" &&
                (activeAsset.status === "live"
                  ? "Enter your email to unlock the current release."
                  : "Register interest and HIDD will notify you when this resource is released.")}
              {status === "success" && responseMessage}
              {status === "error" && responseMessage}
            </p>
          </div>
        </form>
        )}

        {downloadHref ? (
          <div className="reports-library__download">
            <span className="section-heading__eyebrow">Access granted</span>
            <a href={downloadHref} className="button button--ghost" download>
              Download resource
            </a>
          </div>
        ) : null}
      </div> : null}
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
  initialSize: number;
};

function ReportGroup({ heading, description, count, assets, activeSlug, onSelect, initialSize }: ReportGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleAssets = expanded ? assets : assets.slice(0, initialSize);
  const hasMore = assets.length > initialSize;

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
      <div className="reports-library__grid">
        {visibleAssets.map((asset) => (
          <button
            type="button"
            key={asset.slug}
            className={`report-card ${asset.slug === activeSlug ? "is-active" : ""}`}
            onClick={() => onSelect(asset.slug)}
          >
            <span className="report-card__category">{asset.category}</span>
            <strong>{asset.title}</strong>
            <p>{asset.summary}</p>
            {(asset.fileFormat || asset.pageCount) ? (
              <span className="report-card__meta">
                {[asset.fileFormat, asset.pageCount ? `${asset.pageCount} pages` : ""].filter(Boolean).join(" · ")}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {hasMore ? (
        <button type="button" className="reports-library__show-more" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show fewer" : `Show all ${assets.length}`}
        </button>
      ) : null}
    </section>
  );
}
