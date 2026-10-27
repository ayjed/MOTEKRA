import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const evidence = "docs/evidence/phase-02";
test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });

test("lab content is server-rendered, noindex and absent from sitemap", async ({ request }) => {
  const response = await request.get("/motion-lab");
  expect(response.status()).toBe(200);
  const html = await response.text();
  for (const text of ["Motion with", "a point of view.", "Readable first.", "concept UI", "noindex"]) expect(html).toContain(text);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("motion-lab");
});

test("desktop scene, pointer depth, focus preview and error fallback work", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/motion-lab");
  const scene = page.locator(".scene-boundary");
  await expect(scene).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await expect(page.locator(".webgl-layer canvas")).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 960 });
  await expect(scene).toHaveAttribute("data-scene-quality", "balanced");
  await expect(scene).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await page.screenshot({ path: `${evidence}/lab-balanced-1024.png`, fullPage: false });
  await page.setViewportSize({ width: 1440, height: 960 });
  await expect(scene).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await expect.poll(() => page.locator("h1 [data-line]").evaluateAll((nodes) => nodes.every((node) => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42) < 1)), { timeout: 20_000 }).toBe(true);
  await expect(page.locator("[data-handoff]")).toHaveAttribute("data-motion-active", "true");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(scene).toHaveAttribute("data-scene-state", "paused");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(scene).toHaveAttribute("data-scene-state", "ready");
  await page.getByRole("button", { name: "Use static visual" }).click();
  await expect(scene).toHaveAttribute("data-scene-state", "poster");
  await expect(page.locator(".webgl-layer canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Use static visual" }).click();
  await expect(scene).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await page.getByRole("button", { name: "Change interface state" }).click();
  await expect(page.getByRole("button", { name: "Change interface state" })).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: `${evidence}/lab-desktop-1440.png`, fullPage: true });

  await page.getByRole("link", { name: "Explore the Studies" }).click();
  const tilt = page.locator(".pointer-tilt");
  await tilt.hover({ position: { x: 30, y: 40 } });
  await expect.poll(() => tilt.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  const previewLink = page.getByRole("link", { name: "Explore Proposed Design Scope" });
  await previewLink.focus();
  await expect(page.locator(".hover-preview")).toHaveAttribute("data-preview-active", "true");
  await page.screenshot({ path: `${evidence}/focus-preview.png`, fullPage: false });
  await expect(scene).toHaveAttribute("data-scene-state", "paused");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(scene).toHaveAttribute("data-scene-state", "ready");
  await page.locator(".webgl-layer canvas").evaluate((canvas) => canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(scene).toHaveAttribute("data-scene-state", "error");
  await expect(page.locator(".webgl-layer canvas")).toHaveCount(0);
  await expect(page.locator(".scene-poster")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: `${evidence}/webgl-error-fallback.png`, fullPage: false });
  expect(errors).toEqual([]);
});

test("route roundtrips clean GSAP triggers and preserve active navigation/back", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/motion-lab");
  await expect.poll(() => page.evaluate(() => window.__motekraMotionDiagnostics?.().triggers ?? 0)).toBeGreaterThan(0);
  await expect(page.locator("h1").locator("..")).toHaveAttribute("data-motion-active", "true");
  await expect.poll(() => page.locator("h1 [data-line]").evaluateAll((nodes) => nodes.every((node) => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42) < 1)), { timeout: 20_000 }).toBe(true);
  const probe = await page.evaluateHandle(() => window.__motekraMotionDiagnostics!);
  const baseline = await probe.evaluate((fn) => fn().triggers);
  for (let i = 0; i < 3; i++) {
    await page.getByRole("link", { name: "Test a Route Transition" }).click();
    await expect(page).toHaveURL(/\/work$/, { timeout: 20_000 });
    await expect(page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Work", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.locator("main")).toBeFocused();
    await expect.poll(() => probe.evaluate((fn) => fn().triggers)).toBe(0);
    await page.goBack();
    await expect(page).toHaveURL(/motion-lab/, { timeout: 20_000 });
    await expect.poll(() => probe.evaluate((fn) => fn().triggers)).toBe(baseline);
  }
  await probe.dispose();
});

test("reduced motion reverts timelines and removes WebGL live", async ({ page }) => {
  await page.goto("/motion-lab");
  await expect(page.locator("[data-handoff]")).toHaveAttribute("data-motion-active", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "poster");
  await expect(page.locator(".webgl-layer canvas")).toHaveCount(0);
  await expect(page.locator("[data-motion-active]")).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-line]").first()).toHaveCSS("transform", "none");
  await page.screenshot({ path: `${evidence}/lab-reduced-motion.png`, fullPage: true });
  await page.getByRole("link", { name: "Back to top", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("link", { name: "MOTEKRA home" }).first()).toBeFocused();
});

test("320px touch drawer traps focus, closes on Escape and retains poster", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/motion-lab");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-quality", "poster");
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `${evidence}/lab-mobile-320.png`, fullPage: true });
  await page.getByLabel("Open navigation").tap();
  const dialog = page.getByRole("dialog", { name: "Main navigation" });
  await expect(dialog).toBeVisible();
  expect(Math.round((await dialog.boundingBox())!.width)).toBe(288);
  await expect(page.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.screenshot({ path: `${evidence}/navigation-320.png` });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByLabel("Open navigation")).toBeFocused();
  await page.setViewportSize({ width: 767, height: 800 });
  await page.getByLabel("Open navigation").tap();
  await expect(dialog).toBeVisible();
  expect((await dialog.boundingBox())!.width).toBeCloseTo(767 * .9, 0);
  await page.screenshot({ path: `${evidence}/navigation-767.png` });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByLabel("Open navigation").tap();
  await dialog.getByRole("link", { name: /^Contact/ }).click();
  await expect(page).toHaveURL(/contact/, { timeout: 20_000 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await context.close();
});

test("no JavaScript leaves content, poster and mobile navigation usable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/motion-lab");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore the Studies" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByLabel("Open navigation").click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.screenshot({ path: `${evidence}/lab-no-js-320.png`, fullPage: true });
  await context.close();
});

test("unsupported WebGL and low-capability devices retain the poster", async ({ browser }) => {
  for (const mode of ["no-webgl", "low-memory"] as const) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    await context.addInitScript((kind) => {
      if (kind === "low-memory") Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => 2 });
      else {
        const original = HTMLCanvasElement.prototype.getContext;
        Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { value: function (type: string, options: unknown) {
          return type.startsWith("webgl") ? null : Reflect.apply(original, this, [type, options]);
        } });
      }
    }, mode);
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/motion-lab");
    await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", mode === "no-webgl" ? "error" : "poster");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".scene-poster")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `${evidence}/${mode}-fallback.png` });
    await context.close();
  }
});

test("record a short motion walkthrough", async ({ browser }) => {
  test.setTimeout(90_000);
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: `${evidence}/recording`, size: { width: 1280, height: 800 } } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/motion-lab");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  // Deliberate pauses are for the human-readable recording, not test synchronization.
  await page.waitForTimeout(1200);
  await page.mouse.move(1050, 400, { steps: 18 });
  await page.getByRole("button", { name: "Change interface state" }).click();
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 450);
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 650);
  await page.waitForTimeout(1200);
  await page.locator(".pointer-tilt").hover({ position: { x: 40, y: 50 } });
  await page.getByRole("link", { name: "Explore Proposed Design Scope" }).focus();
  await page.waitForTimeout(1200);
  await page.getByRole("link", { name: "Explore Proposed Design Scope" }).click();
  await expect(page).toHaveURL(/ui-ux-design/);
  await page.waitForTimeout(1000);
  await page.goBack();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const video = page.video()!;
  await context.close();
  await video.saveAs(`${evidence}/motion-walkthrough.webm`);
  await video.delete();
});
