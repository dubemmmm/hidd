import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="shell not-found-page__inner">
        <div className="section-heading__eyebrow">Page not found</div>
        <p className="not-found-page__code">404</p>
        <h1>We could not find that page.</h1>
        <p>
          The address may belong to an older version of the HIDD website, or the page may have moved.
          Choose a useful destination below.
        </p>
        <nav className="not-found-page__actions" aria-label="Useful destinations">
          <Link href="/services" className="button button--primary">Explore Services</Link>
          <Link href="/insights" className="button button--ghost">Browse Insights</Link>
          <Link href="/risk-map" className="button button--ghost">Open Area Compare</Link>
          <Link href="/contact" className="button button--ghost">Contact HIDD</Link>
        </nav>
      </div>
    </section>
  );
}
