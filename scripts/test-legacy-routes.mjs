const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100";

const checks = [
  ["/blog/", 301, "/insights"],
  ["/services/property-due-diligence", 301, "/services/legal-due-diligence"],
  ["/services/property-valuation", 301, "/services/valuation"],
  ["/services/property-risk-advisory", 301, "/services/risk-intelligence"],
  ["/home-inspection", 301, "/services/home-inspection"],
  ["/what-a-home-inspection-reveals-that-sellers-do-not-disclose", 301, "/services/home-inspection"],
  ["/is-the-property-worth-the-price-how-valuation-can-save-you-millions", 301, "/insights"],
  ["/why-diaspora-nigerians-are-most-at-risk-when-buying-property-back-home", 301, "/insights"],
  ["/buying-property-in-nigeria-7-costly-mistakes-due-diligence-can-help-you-avoid", 301, "/insights/lagos-buyers-checklist"],
  ["/shop/", 404, null],
  ["/shop/old-product/", 404, null],
  ["/shops/", 404, null],
  ["/an-old-page-with-no-replacement/", 404, null]
];

let failures = 0;

for (const [pathname, expectedStatus, expectedLocation] of checks) {
  const response = await fetch(new URL(pathname, baseUrl), { redirect: "manual" });
  const location = response.headers.get("location");
  const locationPath = location ? new URL(location, baseUrl).pathname : null;
  const passed = response.status === expectedStatus && locationPath === expectedLocation;

  if (!passed) failures += 1;
  console.log(
    `${passed ? "PASS" : "FAIL"} ${pathname} -> ${response.status}${locationPath ? ` ${locationPath}` : ""}`
  );
}

if (failures > 0) {
  process.exitCode = 1;
  console.error(`${failures} legacy route check(s) failed.`);
} else {
  console.log(`All ${checks.length} legacy route checks passed.`);
}
