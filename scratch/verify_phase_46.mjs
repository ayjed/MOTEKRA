import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const outDir = path.resolve("docs/evidence/phase-46");
fs.mkdirSync(outDir, { recursive: true });

async function runVerification() {
  console.log("Launching browser for Phase 46 verification...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();

  try {
    // -------------------------------------------------------------
    // Test 1: Desktop Viewport (1440 x 900)
    // -------------------------------------------------------------
    console.log("\n--- Testing Desktop Viewport (1440x900) ---");
    const desktopPage = await context.newPage();
    await desktopPage.setViewportSize({ width: 1440, height: 900 });
    await desktopPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    // Scroll to Services section
    const servicesSection = desktopPage.locator("[data-services-container]");
    await servicesSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(600);

    // Initial state: UI/UX Design preview active in stack, all 5 accordion buttons collapsed
    const buttons = desktopPage.locator(".service-accordion-header");
    const count = await buttons.count();
    console.log(`Accordion items count: ${count}`);

    for (let i = 0; i < count; i++) {
      const expanded = await buttons.nth(i).getAttribute("aria-expanded");
      console.log(`  Item ${i} aria-expanded: ${expanded}`);
      if (expanded !== "false") {
        throw new Error(`Expected item ${i} to be collapsed initially`);
      }
    }

    // Verify initial desktop preview layer: ui-ux-design is active
    const initialActiveLayer = desktopPage.locator(".services-preview-layer.is-active");
    const initialSlug = await initialActiveLayer.getAttribute("data-preview-slug");
    console.log(`Initial active preview slug: ${initialSlug}`);
    if (initialSlug !== "ui-ux-design") {
      throw new Error(`Expected initial active slug to be ui-ux-design, got ${initialSlug}`);
    }

    // Check UI/UX image in preview
    const uiUxImg = initialActiveLayer.locator("img");
    const uiUxSrc = await uiUxImg.getAttribute("src");
    const uiUxAlt = await uiUxImg.getAttribute("alt");
    console.log(`UI/UX image src: ${uiUxSrc}`);
    console.log(`UI/UX image alt: ${uiUxAlt}`);

    // Capture screenshot of initial state (UI/UX Design preview)
    await desktopPage.screenshot({
      path: path.join(outDir, "desktop-1440-services-initial-ui-ux.png"),
      fullPage: false,
    });
    console.log("Captured desktop-1440-services-initial-ui-ux.png");

    // Click Web Development button (index 1)
    console.log("\nClicking 'Web Development' accordion header...");
    await buttons.nth(1).click();
    await desktopPage.waitForTimeout(600);

    // Verify Web Development is expanded
    const webDevExpanded = await buttons.nth(1).getAttribute("aria-expanded");
    console.log(`Web Development aria-expanded: ${webDevExpanded}`);
    if (webDevExpanded !== "true") {
      throw new Error("Expected Web Development to be expanded");
    }

    // Verify preview layer switched to web-development
    const activeLayer2 = desktopPage.locator(".services-preview-layer.is-active");
    const slug2 = await activeLayer2.getAttribute("data-preview-slug");
    console.log(`Active preview slug after click: ${slug2}`);
    if (slug2 !== "web-development") {
      throw new Error(`Expected active slug to be web-development, got ${slug2}`);
    }

    const webDevImg = activeLayer2.locator("img");
    const webDevSrc = await webDevImg.getAttribute("src");
    const webDevAlt = await webDevImg.getAttribute("alt");
    console.log(`Web Dev image src: ${webDevSrc}`);
    console.log(`Web Dev image alt: ${webDevAlt}`);

    // Capture screenshot with Web Development open
    await desktopPage.screenshot({
      path: path.join(outDir, "desktop-1440-services-web-development-open.png"),
      fullPage: false,
    });
    console.log("Captured desktop-1440-services-web-development-open.png");

    // Click UI/UX Design button (index 0)
    console.log("\nClicking 'UI/UX Design' accordion header...");
    await buttons.nth(0).click();
    await desktopPage.waitForTimeout(600);

    const uiUxExpanded2 = await buttons.nth(0).getAttribute("aria-expanded");
    const webDevExpanded2 = await buttons.nth(1).getAttribute("aria-expanded");
    console.log(`UI/UX Design aria-expanded: ${uiUxExpanded2}`);
    console.log(`Web Development aria-expanded: ${webDevExpanded2}`);
    if (uiUxExpanded2 !== "true" || webDevExpanded2 !== "false") {
      throw new Error("Expected UI/UX Design open and Web Development closed");
    }

    await desktopPage.screenshot({
      path: path.join(outDir, "desktop-1440-services-ui-ux-open.png"),
      fullPage: false,
    });
    console.log("Captured desktop-1440-services-ui-ux-open.png");

    // Click UI/UX Design again to collapse
    console.log("\nClicking 'UI/UX Design' again to test toggle collapse...");
    await buttons.nth(0).click();
    await desktopPage.waitForTimeout(600);

    const uiUxExpanded3 = await buttons.nth(0).getAttribute("aria-expanded");
    console.log(`UI/UX Design aria-expanded after second click: ${uiUxExpanded3}`);
    if (uiUxExpanded3 !== "false") {
      throw new Error("Expected UI/UX Design to collapse to false");
    }

    // Click Mobile App Development (index 2) to verify other services untouched
    console.log("\nClicking 'Mobile App Development' to verify preserved service visual...");
    await buttons.nth(2).click();
    await desktopPage.waitForTimeout(600);

    const activeLayerMobile = desktopPage.locator(".services-preview-layer.is-active");
    const slugMobile = await activeLayerMobile.getAttribute("data-preview-slug");
    console.log(`Active preview slug for Mobile App Development: ${slugMobile}`);
    if (slugMobile !== "mobile-app-development") {
      throw new Error(`Expected mobile-app-development, got ${slugMobile}`);
    }

    const mobileImg = activeLayerMobile.locator("img");
    const mobileSrc = await mobileImg.getAttribute("src");
    console.log(`Mobile App Dev image src: ${mobileSrc}`);
    if (!mobileSrc.includes("mobile-app-development.jpg")) {
      throw new Error("Expected original mobile-app-development.jpg to be preserved");
    }

    await desktopPage.screenshot({
      path: path.join(outDir, "desktop-1440-services-mobile-app-open.png"),
      fullPage: false,
    });
    console.log("Captured desktop-1440-services-mobile-app-open.png");
    await desktopPage.close();

    // -------------------------------------------------------------
    // Test 2: Mobile Viewport (390 x 844)
    // -------------------------------------------------------------
    console.log("\n--- Testing Mobile Viewport (390x844) ---");
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 390, height: 844 });
    await mobilePage.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    const mServicesSection = mobilePage.locator("[data-services-container]");
    await mServicesSection.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(600);

    const mButtons = mobilePage.locator(".service-accordion-header");

    // Open UI/UX Design on mobile
    console.log("Opening UI/UX Design on mobile...");
    await mButtons.nth(0).click();
    await mobilePage.waitForTimeout(600);

    // Verify mobile preview image
    const mItemUiUx = mobilePage.locator(".service-accordion-item[data-accordion-item='ui-ux-design']");
    const mUiUxPreview = mItemUiUx.locator(".mobile-preview-box");
    await mUiUxPreview.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(300);

    await mobilePage.screenshot({
      path: path.join(outDir, "mobile-390-ui-ux-preview.png"),
      fullPage: false,
    });
    console.log("Captured mobile-390-ui-ux-preview.png");

    // Open Web Development on mobile
    console.log("Opening Web Development on mobile...");
    await mButtons.nth(1).click();
    await mobilePage.waitForTimeout(600);

    const mItemWebDev = mobilePage.locator(".service-accordion-item[data-accordion-item='web-development']");
    const mWebDevPreview = mItemWebDev.locator(".mobile-preview-box");
    await mWebDevPreview.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(300);

    await mobilePage.screenshot({
      path: path.join(outDir, "mobile-390-web-dev-preview.png"),
      fullPage: false,
    });
    console.log("Captured mobile-390-web-dev-preview.png");
    await mobilePage.close();

    // -------------------------------------------------------------
    // Test 3: Tablet Viewport (768 x 1024)
    // -------------------------------------------------------------
    console.log("\n--- Testing Tablet Viewport (768x1024) ---");
    const tabletPage = await context.newPage();
    await tabletPage.setViewportSize({ width: 768, height: 1024 });
    await tabletPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    const tServices = tabletPage.locator("[data-services-container]");
    await tServices.scrollIntoViewIfNeeded();
    await tabletPage.waitForTimeout(600);

    const tButtons = tabletPage.locator(".service-accordion-header");
    await tButtons.nth(0).click();
    await tabletPage.waitForTimeout(600);

    await tabletPage.screenshot({
      path: path.join(outDir, "tablet-768-ui-ux-open.png"),
      fullPage: false,
    });
    console.log("Captured tablet-768-ui-ux-open.png");
    await tabletPage.close();

    // -------------------------------------------------------------
    // Test 4: Regression Protection (Work Page & Home Featured Projects)
    // -------------------------------------------------------------
    console.log("\n--- Testing Regression Protection ---");
    const regPage = await context.newPage();
    await regPage.setViewportSize({ width: 1440, height: 900 });

    // Check /work page
    await regPage.goto("http://localhost:3000/work", { waitUntil: "networkidle" });
    const workCards = regPage.locator("[data-work-card]");
    const workCardCount = await workCards.count();
    console.log(`Work page project cards count: ${workCardCount}`);
    if (workCardCount !== 4) {
      throw new Error(`Expected 4 projects on /work, found ${workCardCount}`);
    }

    const workTitles = await regPage.locator(".work-card-title").allTextContents();
    console.log(`Work page project titles: ${JSON.stringify(workTitles)}`);

    // Check Home page Featured Projects
    await regPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    const homeCards = regPage.locator(".davka-project-card");
    const homeCardCount = await homeCards.count();
    console.log(`Home page featured projects count: ${homeCardCount}`);
    if (homeCardCount !== 2) {
      throw new Error(`Expected 2 featured projects on Home, found ${homeCardCount}`);
    }
    const homeTitles = await regPage.locator(".davka-project-title").allTextContents();
    console.log(`Home page featured project titles: ${JSON.stringify(homeTitles)}`);

    await regPage.close();
    console.log("\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

runVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
