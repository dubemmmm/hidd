const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100";
const preferredOrigin = "https://www.hiddadvisory.com";
const expectedImage = `${preferredOrigin}/og/hidd-advisory-og-v1.png`;

const pages = [
  { path: "/", title: "Independent Property Intelligence", schema: "Organization" },
  { path: "/services/home-inspection", title: "Home Inspection", schema: "Service" },
  {
    path: "/case-studies/undisclosed-mortgage-clean-looking-title",
    title: "Mortgage",
    schema: "Article",
    additionalType: "https://schema.org/CaseStudy"
  },
  {
    path: "/insights/property-due-diligence-lagos",
    title: "Property Due Diligence",
    schema: "Article"
  },
  { path: "/faqs", title: "Frequently Asked Questions", schema: "FAQPage" }
];

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
      match[1],
      match[2] ?? match[3] ?? ""
    ])
  );
}

function meta(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/g) ?? []) {
    const attrs = attributes(tag);
    if (attrs.property === key || attrs.name === key) return attrs.content;
  }
  return null;
}

function canonical(html) {
  for (const tag of html.match(/<link\b[^>]*>/g) ?? []) {
    const attrs = attributes(tag);
    if (attrs.rel === "canonical") return attrs.href;
  }
  return null;
}

function jsonLd(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

let failures = 0;

for (const page of pages) {
  const response = await fetch(new URL(page.path, baseUrl));
  const html = await response.text();
  const title = meta(html, "og:title");
  const description = meta(html, "og:description");
  const image = meta(html, "og:image");
  const url = meta(html, "og:url");
  const canonicalUrl = canonical(html);
  const schemas = jsonLd(html);
  const expectedCanonical = `${preferredOrigin}${page.path === "/" ? "" : page.path}`;
  const matchingSchema = schemas.find((item) => item["@type"] === page.schema);

  const passed =
    response.status === 200 &&
    title?.includes(page.title) &&
    Boolean(description) &&
    image === expectedImage &&
    url === expectedCanonical &&
    canonicalUrl === expectedCanonical &&
    Boolean(matchingSchema) &&
    (!page.additionalType || matchingSchema?.additionalType === page.additionalType) &&
    !html.toLowerCase().includes("chatgpt.com") &&
    !image?.endsWith(".svg");

  if (!passed) failures += 1;
  console.log(`${passed ? "PASS" : "FAIL"} ${page.path}`);
  if (!passed) {
    console.log({ status: response.status, title, description, image, url, canonicalUrl });
  }
}

const imageResponse = await fetch(new URL("/og/hidd-advisory-og-v1.png", baseUrl));
const imageBytes = new Uint8Array(await imageResponse.arrayBuffer());
const isPng =
  imageBytes[0] === 0x89 &&
  imageBytes[1] === 0x50 &&
  imageBytes[2] === 0x4e &&
  imageBytes[3] === 0x47;
const imagePassed = imageResponse.status === 200 && imageResponse.headers.get("content-type") === "image/png" && isPng;
if (!imagePassed) failures += 1;
console.log(`${imagePassed ? "PASS" : "FAIL"} hosted PNG social image`);

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
const sitemap = await sitemapResponse.text();
const sitemapPassed =
  sitemapResponse.status === 200 &&
  sitemap.includes(`${preferredOrigin}/services/home-inspection`) &&
  sitemap.includes(`${preferredOrigin}/case-studies/`) &&
  sitemap.includes(`${preferredOrigin}/insights/`) &&
  !sitemap.includes("https://hiddadvisory.com/");
if (!sitemapPassed) failures += 1;
console.log(`${sitemapPassed ? "PASS" : "FAIL"} preferred-www XML sitemap`);

if (failures > 0) {
  console.error(`${failures} SEO metadata check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`All ${pages.length + 2} SEO metadata checks passed.`);
}
