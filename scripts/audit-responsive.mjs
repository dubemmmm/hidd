const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100";
const cdpPort = process.env.CDP_PORT ?? "9224";

const routes = [
  "/",
  "/services",
  "/services/home-inspection",
  "/services/comprehensive-report",
  "/risk-map",
  "/risk-map/ikoyi",
  "/risk-map/methodology",
  "/case-studies",
  "/case-studies/undisclosed-mortgage-clean-looking-title",
  "/insights",
  "/insights/property-due-diligence-lagos",
  "/about",
  "/contact",
  "/faqs",
  "/privacy-policy",
  "/terms",
  "/not-a-real-page"
];

const viewports = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 1, mobile: true },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
];

const targets = await fetch(`http://127.0.0.1:${cdpPort}/json`).then((response) => response.json());
const page = targets.find((target) => target.type === "page" && target.url.startsWith("http"));
if (!page?.webSocketDebuggerUrl) throw new Error("No browser page target is available.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const consoleErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    consoleErrors.push(message.params?.exceptionDetails?.text ?? "Runtime exception");
  }
  if (message.method === "Log.entryAdded" && message.params?.entry?.level === "error") {
    consoleErrors.push(message.params.entry.text);
  }
});

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function waitFor(method, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.removeEventListener("message", listener);
      reject(new Error(`Timed out waiting for ${method}`));
    }, timeoutMs);
    function listener(event) {
      const message = JSON.parse(event.data);
      if (message.method !== method) return;
      clearTimeout(timer);
      socket.removeEventListener("message", listener);
      resolve(message.params);
    }
    socket.addEventListener("message", listener);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

const results = [];

for (const viewport of viewports) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
    screenWidth: viewport.width,
    screenHeight: viewport.height
  });
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: viewport.mobile,
    maxTouchPoints: viewport.mobile ? 5 : 1
  });

  for (const route of routes) {
    consoleErrors.length = 0;
    const loaded = waitFor("Page.loadEventFired");
    await send("Page.navigate", { url: new URL(route, baseUrl).href });
    await loaded;
    await new Promise((resolve) => setTimeout(resolve, 350));

    const evaluation = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const root = document.documentElement;
        const interactiveSelector = 'button, input:not([type="hidden"]), select, textarea, a.button, .menu-toggle';
        const interactive = [...document.querySelectorAll(interactiveSelector)]
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
          });
        const undersized = interactive
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { tag: element.tagName.toLowerCase(), label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 50), width: Math.round(rect.width), height: Math.round(rect.height) };
          })
          .filter((item) => item.width < 40 || item.height < 40)
          .slice(0, 10);
        const overflow = [...document.querySelectorAll('body *')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            if (style.position === 'fixed' || style.position === 'sticky') return false;
            if (element.closest('[class*="track"], [class*="scroll"], .map-shell')) return false;
            let ancestor = element.parentElement;
            while (ancestor && ancestor !== document.body) {
              const ancestorStyle = getComputedStyle(ancestor);
              if (['auto', 'scroll'].includes(ancestorStyle.overflowX)) return false;
              ancestor = ancestor.parentElement;
            }
            return rect.right > innerWidth + 2 || rect.left < -2;
          })
          .map((element) => ({ tag: element.tagName.toLowerCase(), className: String(element.className).slice(0, 90), right: Math.round(element.getBoundingClientRect().right) }))
          .slice(0, 10);
        const brokenImages = [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src)
          .slice(0, 10);
        const nav = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        return {
          title: document.title,
          statusPage: Boolean(document.querySelector('.not-found-page')),
          viewportWidth: innerWidth,
          documentWidth: Math.max(root.scrollWidth, document.body?.scrollWidth || 0),
          horizontalOverflow: Math.max(root.scrollWidth, document.body?.scrollWidth || 0) > innerWidth + 2,
          overflow,
          undersized,
          brokenImages,
          missingImageAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
          menuToggleVisible: (() => { const item = document.querySelector('.menu-toggle'); return Boolean(item && getComputedStyle(item).display !== 'none'); })(),
          primaryNavVisible: (() => { const item = document.querySelector('.site-nav'); return Boolean(item && getComputedStyle(item).display !== 'none'); })(),
          durationMs: nav ? Math.round(nav.duration) : null,
          transferKb: Math.round(resources.reduce((total, item) => total + (item.transferSize || 0), 0) / 1024),
          resourceCount: resources.length
        };
      })()`
    });

    results.push({ viewport: viewport.name, route, ...evaluation.result.value, consoleErrors: [...consoleErrors] });
  }
}

socket.close();

let failures = 0;
for (const result of results) {
  const issues = [];
  if (result.horizontalOverflow) issues.push(`overflow ${result.documentWidth}/${result.viewportWidth}`);
  if (result.overflow.length) issues.push(`${result.overflow.length} overflowing elements`);
  if (result.brokenImages.length) issues.push(`${result.brokenImages.length} broken images`);
  if (result.missingImageAlt) issues.push(`${result.missingImageAlt} images missing alt`);
  if (result.consoleErrors.length && result.route !== "/not-a-real-page") issues.push(`${result.consoleErrors.length} console errors`);
  if (result.viewport === "mobile" && !result.menuToggleVisible) issues.push("mobile menu toggle hidden");
  if (issues.length) failures += 1;
  console.log(`${issues.length ? "FAIL" : "PASS"} ${result.viewport.padEnd(7)} ${result.route} ${issues.join("; ")}`);
  if (issues.length) console.log(JSON.stringify({ overflow: result.overflow, brokenImages: result.brokenImages, consoleErrors: result.consoleErrors }, null, 2));
}

const summary = {
  pages: results.length,
  failures,
  maxTransferKb: Math.max(...results.map((result) => result.transferKb)),
  slowest: [...results].sort((a, b) => (b.durationMs ?? 0) - (a.durationMs ?? 0)).slice(0, 5).map(({ viewport, route, durationMs, transferKb, resourceCount }) => ({ viewport, route, durationMs, transferKb, resourceCount }))
};
console.log("SUMMARY", JSON.stringify(summary, null, 2));
if (failures) process.exitCode = 1;
