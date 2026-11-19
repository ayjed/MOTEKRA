import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const dir = process.env.EVIDENCE_DIR ?? "docs/evidence/phase-06";
const founder = "/team/akinwumi-ayomiposi";

test.beforeAll(async () => {
  await mkdir(dir, { recursive: true });
});

test("server HTML preserves content, approved portrait, shared schema and publication boundaries", async ({ request }) => {
  for (const route of ["/about", founder]) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    await writeFile(`${dir}/${route === "/about" ? "about" : "founder"}-server.html`, html);

    // Approved founder identity and portrait photograph
    expect(html).toContain("Ayomiposi Akinwumi");
    expect(html).toContain("/assets/team/ayomiposi.webp");
    expect(html).not.toContain("awaiting confirmation");

    // Shared Person structured data
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"name":"Ayomiposi Akinwumi"');
    expect(html).toContain('"@id":"https://www.motekra.com/about#person"');

    // Route-specific titles and canonical URLs
    if (route === "/about") {
      expect(html).toContain("<title>About the Studio - MOTEKRA</title>");
      expect(html).toContain('<link rel="canonical" href="https://www.motekra.com/about"');
    } else {
      expect(html).toContain("<title>Ayomiposi Akinwumi - Software Developer &amp; Creative Technologist - MOTEKRA</title>");
      expect(html).toContain('<link rel="canonical" href="https://www.motekra.com/team/akinwumi-ayomiposi"');
    }

    // Publication boundaries
    expect(html).not.toContain('src="/images/founder/ayomiposi.webp"');
    expect(html).not.toContain('href="/work/spotlight-contest"');
    expect(html).not.toContain("akinwumi-ayomiposi.jpeg");
  }

  expect((await request.get("/assets/team/ayomiposi.webp")).status()).toBe(200);
  expect((await request.get("/assets/team/akinwumi-ayomiposi.jpeg")).status()).toBe(404);
  expect((await request.get("/team/unknown")).status()).toBe(404);
});

test("responsive editorial content and zero automated accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/about", founder]) {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `${dir}/${route === "/about" ? "about" : "founder"}-${width}.png`, fullPage: true });
      if ([1440, 390].includes(width)) {
        const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        await writeFile(`${dir}/axe-${route === "/about" ? "about" : "founder"}-${width}.json`, JSON.stringify(result, null, 2));
        expect(result.violations).toEqual([]);
      }
    }
  }
});

test("native disclosure controls, external profiles and route transitions work with keyboard", async ({ page }) => {
  await page.goto(founder);
  await page.locator(".skill-groups summary").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".skill-groups details").first()).not.toHaveAttribute("open");
  await page.keyboard.press("Enter");
  await expect(page.locator(".skill-groups li")).toHaveCount(15);
  await expect(page.getByRole("link", { name: "GitHub", exact: false }).first()).toHaveAttribute("href", "https://github.com/ayjed");
  await page.goto("/about");
  const summary = page.locator(".values-stack summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".values-stack details").first()).not.toHaveAttribute("open");
  await page.getByRole("link", { name: "Meet Ayomiposi" }).click();
  await expect(page).toHaveURL(new RegExp(founder));
  await expect(page.locator("main")).toBeFocused();
});

test("motion settles and live reduced-motion restores readable content", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/about");
  await expect.poll(() => page.locator("[data-editorial-line]").evaluateAll((nodes) => nodes.every((node) => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42) < 1))).toBe(true);
  await page.locator(".editorial-founder").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("[data-portrait-plane]").evaluate((node) => getComputedStyle(node).transform)).toBe("none");
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("no JavaScript retains biography skills values and navigation", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000" + founder);
  await expect(page.locator(".skill-groups li")).toHaveCount(15);
  await expect(page.locator(".editorial-bio")).toContainText("Software Developer");
  expect(await page.locator(".bio-word").first().evaluate((node) => parseFloat(getComputedStyle(node).marginInlineEnd))).toBeGreaterThan(0);
  await expect(page.locator(".founder-photograph").first()).toBeVisible();
  await expect(page.locator(".portrait-pending")).toHaveCount(0);
  await page.goto("http://127.0.0.1:3000/about");
  await expect(page.locator(".values-stack details")).toHaveCount(5);
  await expect(page.locator(".values-stack p").first()).toBeVisible();
  await expect(page.locator(".founder-photograph").first()).toBeVisible();
  await page.screenshot({ path: `${dir}/about-no-js.png`, fullPage: true });
  await context.close();
});
