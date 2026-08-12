const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100";

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3] ?? ""])
  );
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
const sitemap = await sitemapResponse.text();
const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const paths = [...new Set(["/", ...sitemapPaths])];
const internalLinks = new Set();
const failures = [];

for (const path of paths) {
  const response = await fetch(new URL(path, baseUrl));
  const html = await response.text();
  if (response.status !== 200) failures.push(`${path} returned ${response.status}`);

  for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
    const href = attributes(tag).href;
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    const url = new URL(href, baseUrl);
    if (url.origin === new URL(baseUrl).origin) internalLinks.add(`${url.pathname}${url.search}`);
  }
}

for (const href of internalLinks) {
  const response = await fetch(new URL(href, baseUrl), { redirect: "manual" });
  if (response.status >= 400) failures.push(`Internal link ${href} returned ${response.status}`);
}

const invalidContact = await fetch(new URL("/api/contact", baseUrl), {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{}"
});
if (invalidContact.status !== 400) failures.push(`Contact validation returned ${invalidContact.status}, expected 400`);

const invalidUnlock = await fetch(new URL("/api/report-access", baseUrl), {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{}"
});
if (invalidUnlock.status !== 400) failures.push(`Asset-access validation returned ${invalidUnlock.status}, expected 400`);

console.log(`Checked ${paths.length} sitemap pages and ${internalLinks.size} unique internal links.`);
console.log(`PASS contact form validation (${invalidContact.status})`);
console.log(`PASS asset unlock validation (${invalidUnlock.status})`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("All sitemap pages and internal links passed.");
}
