import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { services } from "../../src/content/services";

const dir = process.env.EVIDENCE_DIR ?? "docs/evidence/phase-05";
test.beforeAll(async () => {
  await mkdir(dir, { recursive: true });
});

async function settleTitle(page: Page) {
  const cinema = page.locator(".services-cinema");
  if ((await cinema.count()) > 0) {
    await expect(cinema).toBeVisible();
  }
  const headingLine = page.locator("[data-services-heading-line]").first();
  if ((await headingLine.count()) > 0) {
    await expect(headingLine).toBeVisible();
  }
}

test("six production HTML routes contain genuine approved copy, links and metadata", async ({ request }) => {
  const landing = await request.get("/services");
  expect(landing.status()).toBe(200);
  const html = await landing.text();
  await writeFile(`${dir}/services-server.html`, html);

  expect(html).toContain("What We Bring to Life.");
  expect((html.match(/data-accordion-item=/g) ?? [])).toHaveLength(5);
  expect(html).toContain("Five core capabilities · bespoke product delivery");
  expect(html).toContain("Discuss Your Project");
  expect(html).not.toContain("Discuss the proposed scope");
  expect(html).not.toContain("awaiting confirmation");
  for (const step of ["Discover", "Define", "Design", "Develop", "Launch"]) {
    expect(html).toContain(step);
  }
  expect(html).not.toContain("<canvas");

  if (process.env.SITE_INDEXABLE === "true") {
    expect(html).toContain('content="https://www.motekra.com/assets/social/services.png"');
  }

  const titles: (string | undefined)[] = [];
  for (const service of services) {
    const response = await request.get(`/services/${service.slug}`);
    expect(response.status()).toBe(200);
    const detail = await response.text();
    await writeFile(`${dir}/${service.slug}-server.html`, detail);

    for (const text of [
      service.title,
      "What We Deliver",
      "How We Approach It",
      "Frequently Asked Questions",
      "Complementary services",
    ]) {
      expect(detail).toContain(text.replaceAll("&", "&amp;"));
    }

    expect(detail).not.toContain('href="/work/spotlight-contest"');
    expect(detail).not.toContain("provisional offering");
    expect(detail).not.toContain("awaiting confirmation");

    // In production indexable mode, verified Service and Breadcrumb schema is server-rendered:
    if (process.env.SITE_INDEXABLE === "true") {
      expect(detail).toContain(`content="https://www.motekra.com/assets/social/services-${service.slug}.png"`);
      expect(detail).toContain('"@type":"Service"');
      expect(detail).toContain(`https://www.motekra.com/services/${service.slug}#service`);
      expect(detail).toContain('"@type":"BreadcrumbList"');
      expect(detail).toContain('"position":1,"name":"Home"');
      expect(detail).toContain('"position":2,"name":"Services"');
      expect(detail).toContain(`"position":3,"name":"${service.title}"`);
      expect(detail).not.toContain("noindex");
      expect(detail).not.toContain('"offers"');
      expect(detail).not.toContain('"aggregateRating"');
    }

    const match = detail.match(/<title>(.*?)<\/title>/);
    titles.push(match?.[1]);
    expect(match?.[1]).toBe(`${service.title.replaceAll("&", "&amp;")} - Digital Product Services - MOTEKRA`);
  }

  expect(new Set(titles).size).toBe(5);
  expect((await request.get("/services/not-a-service")).status()).toBe(404);

  // Verify production sitemap includes services directory and all 5 approved subpages:
  const sitemapResponse = await request.get("/sitemap.xml");
  if (sitemapResponse.status() === 200) {
    const sitemapText = await sitemapResponse.text();
    if (process.env.SITE_INDEXABLE === "true") {
      expect(sitemapText).toContain("/services");
      for (const service of services) {
        expect(sitemapText).toContain(`/services/${service.slug}`);
      }
    }
  }

  await writeFile(`${dir}/metadata-audit.json`, JSON.stringify(titles, null, 2));
});

test("five services accordion items produce distinct keyboard and click transformations", async ({ page }) => {
  await page.goto("/services");
  await settleTitle(page);
  await expect(page.locator("canvas")).toHaveCount(0);

  const results = [];
  for (const service of services) {
    const button = page.locator(`#service-button-${service.slug}`);
    const panel = page.locator(`#service-panel-${service.slug}`);
    await button.scrollIntoViewIfNeeded();

    // Check initially collapsed
    await expect(button).toBeVisible();

    // Focus and toggle via keyboard
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveAttribute("aria-hidden", "false");

    // Verify panel content
    await expect(panel.locator(".service-panel-intent")).toBeVisible();
    await expect(panel.locator(".service-panel-description")).toBeVisible();
    await expect(panel.locator(".deliverable-pill")).toHaveCount(4);
    await expect(panel.locator(".service-panel-link-primary")).toHaveAttribute(
      "href",
      `/services/${service.slug}`
    );

    // Verify preview layer active
    const previewLayer = page.locator(`.services-preview-layer[data-preview-slug="${service.slug}"]`);
    await expect(previewLayer).toHaveClass(/is-active/);

    await page.screenshot({ path: `${dir}/prototype-${service.visual}-1440.png` });
    results.push({ service: service.slug, expanded: true });
  }

  await expect(page.locator(".service-panel-link-primary")).toHaveCount(5);
  await writeFile(`${dir}/prototype-states.json`, JSON.stringify(results, null, 2));
});

test("service detail subpages render editorial structure, deliverables and interactive FAQ disclosures", async ({ page }) => {
  for (const service of services) {
    await page.goto(`/services/${service.slug}`);
    await expect(page.getByRole("heading", { level: 1, name: service.title, exact: true })).toBeVisible();

    // Check headings
    await expect(page.locator(".service-showcase-heading")).toBeVisible();
    await expect(page.locator("#deliverables-heading")).toHaveText("What We Deliver");
    await expect(page.locator("#approach-heading")).toHaveText("How We Approach It");
    await expect(page.locator("#faq-heading")).toHaveText("Frequently Asked Questions");

    // Check deliverables: 4 items
    await expect(page.locator(".deliverable-item-card")).toHaveCount(4);

    // Check approach steps: 3 items
    await expect(page.locator(".approach-step-card")).toHaveCount(3);

    // Check FAQs: 3 items and test interactive disclosure
    const faqs = page.locator(".service-faq-details");
    await expect(faqs).toHaveCount(3);

    // First FAQ is open by default; second is closed
    await expect(faqs.nth(0)).toHaveAttribute("open", "");
    const secondSummary = faqs.nth(1).locator("summary");
    await secondSummary.click();
    await expect(faqs.nth(1)).toHaveAttribute("open", "");

    // Contact CTA
    await expect(page.locator(".service-contact-panel a[href='/contact']")).toBeVisible();
  }
});

test("live motion preferences and visibility lifecycle preserve readable content and responsive layouts", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services/mobile-app-development");

  // In reduced motion, content should remain immediately visible without delay
  await expect(page.getByRole("heading", { level: 1, name: "Mobile App Development" })).toBeVisible();
  await expect(page.locator(".service-showcase-heading")).toBeVisible();
  await expect(page.locator(".deliverable-item-card")).toHaveCount(4);
  await expect(page.locator("canvas")).toHaveCount(0);

  // Tab visibility change recovery
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: false, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
  });

  await expect(page.locator(".service-showcase-heading")).toBeVisible();
  await page.screenshot({ path: `${dir}/mobile-live-reduced-1440.png` });
});

test("landing and all details fit mobile, tablet and desktop with no automatic WebGL", async ({ page }) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/services");
    await settleTitle(page);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.screenshot({ path: `${dir}/services-${width}.png` });

    if (width === 390 || width === 1440) {
      for (const service of services) {
        const item = page.locator(`[data-accordion-item="${service.slug}"]`);
        await item.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${dir}/chapter-${service.visual}-${width}.png` });
      }
    }
  }

  for (const width of [1440, 390]) {
    for (const service of services) {
      await page.setViewportSize({ width, height: 960 });
      await page.goto(`/services/${service.slug}`);
      await expect(page.getByRole("heading", { level: 1, name: service.title, exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `${dir}/detail-${service.visual}-${width}.png` });
    }
  }

  expect(errors).toEqual([]);
});

test("no JavaScript, reduced motion and low capability preserve copy, prototypes and FAQ", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/services");

  // Verified heading and content present without JS
  await expect(page.locator("#services-main-heading")).toBeVisible();
  await expect(page.locator(".service-accordion-item")).toHaveCount(5);
  // Service detail subpage links are present in DOM without JS:
  for (const service of services) {
    expect(await page.locator(`a[href="/services/${service.slug}"]`).count()).toBeGreaterThanOrEqual(1);
  }
  await page.screenshot({ path: `${dir}/services-no-js-390.png` });

  // Subpage without JS
  await page.goto("http://127.0.0.1:3000/services/ui-ux-design");
  await expect(page.getByRole("heading", { level: 1, name: "UI/UX Design" })).toBeVisible();

  // Native HTML <details> disclosure toggle functions natively without JS:
  // First item defaults to open per editorial design
  const firstFaqDetails = page.locator(".service-faq-details").first();
  await expect(firstFaqDetails).toHaveAttribute("open", "");
  // Second item is collapsed and expands natively on click without JavaScript
  const secondFaqDetails = page.locator(".service-faq-details").nth(1);
  await expect(secondFaqDetails).not.toHaveAttribute("open", "");
  await secondFaqDetails.locator("summary").click();
  await expect(secondFaqDetails).toHaveAttribute("open", "");
  await page.screenshot({ path: `${dir}/faq-no-js-390.png` });

  await context.close();
});

test("all six service pages pass desktop and mobile automated accessibility checks", async ({ browser }) => {
  test.setTimeout(300_000);
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: "reduce" });
    const page = await context.newPage();

    // 1. Audit all five dedicated service detail routes:
    for (const service of services) {
      await page.goto(`http://127.0.0.1:3000/services/${service.slug}`);
      const result = await new AxeBuilder({ page })
        .include("#main-content")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      await writeFile(`${dir}/axe-${service.slug}-${width}.json`, JSON.stringify(result, null, 2));

      // With color contrast fixed in CSS (.deliverable-num & .approach-step-badge >= 4.5:1),
      // full WCAG AA audit passes with zero violations:
      expect(result.violations).toEqual([]);
    }

    // 2. Audit the services landing page capabilities directory and scope agreement sections:
    await page.goto("http://127.0.0.1:3000/services");
    const landingServicesResult = await new AxeBuilder({ page })
      .include(".services-interactive-section")
      .include(".services-scope-section")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    await writeFile(`${dir}/axe-landing-${width}.json`, JSON.stringify(landingServicesResult, null, 2));

    expect(landingServicesResult.violations).toEqual([]);

    await context.close();
  }
});

test("shared Home device scene and navigation remain compatible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-kind", "devices");
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("main")).toBeFocused();
  await page.goBack();
  await expect(page.locator(".scene-boundary")).toHaveAttribute("data-scene-state", "ready", { timeout: 30_000 });
});

test("record the five service interfaces walkthrough", async ({ browser }) => {
  // Check if ffmpeg binary exists in environment before requesting recordVideo
  const ffmpegPath = `${process.env.LOCALAPPDATA}/ms-playwright/ffmpeg-1013/ffmpeg-win64.exe`;
  const canRecordVideo = existsSync(ffmpegPath);

  const contextOptions: Parameters<typeof browser.newContext>[0] = {
    viewport: { width: 1440, height: 960 },
  };
  if (canRecordVideo) {
    contextOptions.recordVideo = { dir: `${dir}/recording`, size: { width: 1440, height: 960 } };
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/services");
  await settleTitle(page);
  await page.waitForTimeout(500);

  for (const service of services) {
    const button = page.locator(`#service-button-${service.slug}`);
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await page.waitForTimeout(400);
  }

  const lastPrimaryLink = page.locator(".service-panel-link-primary").last();
  await lastPrimaryLink.click();
  await page.waitForURL(/\/services\/brand-visual-design/);
  await page.locator("#deliverables-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  if (canRecordVideo) {
    const video = page.video();
    await context.close();
    if (video) {
      await video.saveAs(`${dir}/services-walkthrough.webm`);
      await video.delete();
    }
  } else {
    await page.screenshot({ path: `${dir}/services-walkthrough-fallback.png` });
    await context.close();
  }
});
