import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const routes = ["/", "/work", "/services", "/about", "/contact"];
const widths = [1440, 1024, 768, 390, 320];
const evidence = process.env.EVIDENCE_DIR ?? "docs/evidence/phase-01";

test("production HTML includes crawlable content, links and safe metadata", async ({ request }) => {
  for (const route of [...routes, "/insights", "/services/ui-ux-design", "/services/web-development", "/services/mobile-app-development", "/services/product-strategy", "/services/brand-visual-design"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html).toContain("<h1");
    expect(html).toContain('id="main-content"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain("noindex");
    expect(html).not.toContain("hello@motekra.com");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  }
  const home = await (await request.get("/")).text();
  for (const text of ["Products", "We design and build high-performance", "Discover", "Define", "Design", "Develop", "Launch", "Experiments"]) expect(home).toContain(text);
});

test("unapproved detail content returns a real 404", async ({ request }) => {
  for (const route of ["/work/spotlight-contest", "/team/unconfirmed", "/insights/unwritten", "/services/unknown", "/missing-page"]) {
    expect((await request.get(route)).status(), route).toBe(404);
  }
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("<loc>");
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
});

test("responsive scaffold screenshots and no horizontal overflow", async ({ page }) => {
  test.setTimeout(180_000);
  await mkdir(evidence, { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of widths) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}px`).toBe(true);
      await page.screenshot({ path: `${evidence}/${route === "/" ? "home" : route.slice(1)}-${width}.png`, fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});

test("keyboard skip link, native mobile navigation and truthful form state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content", { exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByLabel("Open navigation").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/contact/);
  await expect(page.getByRole("button", { name: "Submission unavailable" })).toBeDisabled();
});

test("no-JavaScript and reduced-motion content remains available", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3000${route}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("link", { name: "MOTEKRA home" }).first()).toBeVisible();
  }
  await page.goto("http://127.0.0.1:3000/");
  await page.screenshot({ path: `${evidence}/home-390-no-js-reduced-motion.png`, fullPage: true });
  await page.getByLabel("Open navigation").click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.screenshot({ path: `${evidence}/home-390-no-js-navigation.png`, fullPage: true });
  await context.close();
});
