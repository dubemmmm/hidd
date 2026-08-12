const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100";
const cdpPort = process.env.CDP_PORT ?? "9224";
const targets = await fetch(`http://127.0.0.1:${cdpPort}/json`).then((response) => response.json());
const page = targets.find((target) => target.type === "page" && target.url.startsWith("http"));
if (!page?.webSocketDebuggerUrl) throw new Error("No browser page target is available.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
});
function send(method, params = {}) {
  const requestId = ++id;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
}
function waitForLoad(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Navigation timed out.")), timeoutMs);
    function listener(event) {
      if (JSON.parse(event.data).method !== "Page.loadEventFired") return;
      clearTimeout(timer);
      socket.removeEventListener("message", listener);
      resolve();
    }
    socket.addEventListener("message", listener);
  });
}
async function navigate(path) {
  const loaded = waitForLoad();
  await send("Page.navigate", { url: new URL(path, baseUrl).href });
  await loaded;
}
async function evaluate(expression) {
  return (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
}
async function clickSelector(selector) {
  const rect = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    const bounds = element.getBoundingClientRect();
    return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
  })()`);
  if (!rect) throw new Error(`Could not find ${selector}.`);
  const x = rect.x + rect.width / 2;
  const y = rect.y + rect.height / 2;
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}

await send("Page.enable");
await send("Runtime.enable");

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await navigate("/");
await new Promise((resolve) => setTimeout(resolve, 1000));
await clickSelector(".menu-toggle");
await new Promise((resolve) => setTimeout(resolve, 200));
const mobileOpened = await evaluate(`(() => { const button = document.querySelector('.menu-toggle'); return { expanded: button?.getAttribute('aria-expanded'), navOpen: document.querySelector('.site-nav')?.classList.contains('site-nav--open'), servicesVisible: document.querySelector('a[href="/services"].site-nav__link')?.getBoundingClientRect().width > 0 }; })()`);
if (mobileOpened.expanded !== "true" || !mobileOpened.navOpen || !mobileOpened.servicesVisible) {
  throw new Error(`Mobile navigation did not open correctly: ${JSON.stringify(mobileOpened)}`);
}
await clickSelector('a[href="/services"].site-nav__link');
await new Promise((resolve) => setTimeout(resolve, 500));
const mobilePath = await evaluate("location.pathname");
if (mobilePath !== "/services") throw new Error(`Mobile navigation reached ${mobilePath}.`);
console.log("PASS mobile menu opens and navigates to Services");

await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await navigate("/");
await new Promise((resolve) => setTimeout(resolve, 1000));
const desktopState = await evaluate(`(() => { const nav = document.querySelector('.site-nav'); const toggle = document.querySelector('.menu-toggle'); return { navVisible: nav && getComputedStyle(nav).display !== 'none', toggleVisible: toggle && getComputedStyle(toggle).display !== 'none' }; })()`);
if (!desktopState.navVisible || desktopState.toggleVisible) {
  throw new Error(`Desktop navigation visibility is incorrect: ${JSON.stringify(desktopState)}`);
}
await clickSelector('a[href="/about"].site-nav__link');
await new Promise((resolve) => setTimeout(resolve, 500));
const desktopPath = await evaluate("location.pathname");
if (desktopPath !== "/about") throw new Error(`Desktop navigation reached ${desktopPath}.`);
console.log("PASS desktop navigation reaches About");

socket.close();
