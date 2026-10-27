import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const dir = process.env.EVIDENCE_DIR ?? "docs/evidence/phase-03";
test.beforeAll(async () => { await mkdir(dir, { recursive: true }); });

test("Home HTML contains the eight-section storyboard and honest content", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  await writeFile(`${dir}/home-server.html`, html);
  expect((html.match(/data-home-section=/g) ?? [])).toHaveLength(8);
  for (const text of ["Digital Products for what’s Next.", "We design and build high-performance", "Real Projects.", "Bring to Life.", "Discover", "Define", "Design", "Develop", "Launch", "Akinwumi Ayomiposi", "Founder &amp;", "Experiments", "Have Something", "Concept", "In Development"]) expect(html).toContain(text);
  for (const unsupported of ["hello@motekra.com", "6+ Projects", "3+ Years", "testimonial", 'href="/work/spotlight-contest"']) expect(html).not.toContain(unsupported);
  const brand = Buffer.from(await (await request.get("/assets/brand/motekra-mark.png")).body());
  expect(createHash("sha256").update(brand).digest("hex")).toBe(createHash("sha256").update(await readFile("MOTEKRA_X_Profile_400x400.png")).digest("hex"));
  expect((await request.get("/team/akinwumi-ayomiposi")).status()).toBe(200);
});

test("desktop hero, handoff and all five process stages respond to scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await expect.poll(() => page.locator("[data-hero-glyph]").evaluateAll((nodes) => nodes.every((node) => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42) < 1)), { timeout: 20_000 }).toBe(true);
  await page.screenshot({ path: `${dir}/hero-1440.png` });
  const initial = await page.locator(".hero-product-handoff").evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.wheel(0, 620);
  await expect.poll(() => page.locator(".hero-product-handoff").evaluate((element) => getComputedStyle(element).transform)).not.toBe(initial);
  const steps = page.locator("[data-process-step]");
  for (let i = 0; i < 5; i++) {
    await steps.nth(i).evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight * .60));
    await expect(page.locator(".process-narrative")).toHaveAttribute("data-stage", String(i));
    await expect(steps.nth(i)).toHaveAttribute("aria-current", "step");
    await page.screenshot({ path: `${dir}/process-${i + 1}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.locator(".hero-product-handoff").evaluate((element) => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) < 1)).toBe(true);
  await page.screenshot({ path: `${dir}/home-1440.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test("five service demonstrations work by keyboard and expose real detail links", async ({ page }) => {
  await page.goto("/");
  const details = page.locator(".interactive-service");
  await expect(details).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    const summary = details.nth(i).locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details.nth(i)).toHaveAttribute("open", "");
    await expect(details.nth(i).locator(".demo-result")).toBeVisible();
  }
  await page.screenshot({ path: `${dir}/service-interactions.png` });
  await expect(page.locator(".home-service-card a.service-detail-link")).toHaveCount(5);
  await page.locator(".home-service-card a.service-detail-link").first().click();
  await expect(page).toHaveURL(/services\/ui-ux-design/, { timeout: 20_000 });
});

test("live reduced-motion changes and route returns restore the Home scene", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-cinema")).toHaveAttribute("data-motion-active", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-motion-active]")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator(".home-cinema")).toHaveCount(0);
  await page.goBack();
  await expect(page.locator(".home-cinema")).toHaveAttribute("data-motion-active", "true");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("mobile, reduced-motion and no-JavaScript preserve content and actions", async ({ browser }) => {
  for (const width of [390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/");
    await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-quality", "poster");
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("link", { name: "Back to top", exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.screenshot({ path: `${dir}/home-${width}.png`, fullPage: true });
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-home-section]")).toHaveCount(8);
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.locator(".interactive-service summary").first().click();
  await expect(page.locator(".interactive-service").first()).toHaveAttribute("open", "");
  await page.screenshot({ path: `${dir}/home-no-js-390.png`, fullPage: true });
  await context.close();
});

test("axe accessibility audit at desktop and mobile reduced motion", async ({ browser }) => {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    await writeFile(`${dir}/axe-${width}.json`, JSON.stringify(results, null, 2));
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
    await context.close();
  }
});

test("record the desktop eight-section walkthrough", async ({ browser }) => {
  test.setTimeout(180_000);
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, recordVideo: { dir: `${dir}/recording`, size: { width: 1440, height: 960 } } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await page.waitForTimeout(1800);
  await page.mouse.move(1160, 370, { steps: 20 });
  for (const section of ["#featured-work", "#home-services", "#home-process", "#home-founder", "#creative-lab", "#home-contact"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    if (section === "#home-services") await page.locator(".interactive-service summary").first().click();
    if (section === "#home-process") {
      for (let i = 0; i < 5; i++) { await page.locator("[data-process-step]").nth(i).evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight * .45)); await page.waitForTimeout(550); }
    }
    await page.waitForTimeout(1100);
  }
  await page.getByRole("link", { name: "Let’s Talk", exact: true }).click();
  await expect(page).toHaveURL(/contact/, { timeout: 20_000 });
  await page.waitForTimeout(900);
  const video = page.video()!;
  await context.close();
  await video.saveAs(`${dir}/home-walkthrough.webm`);
  await video.delete();
});
