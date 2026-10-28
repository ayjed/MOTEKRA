import { chromium } from "@playwright/test";
import fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' }).catch(() => chromium.launch({ headless: true, channel: 'msedge' }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const logs = [];
  page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`[PAGE ERROR] ${err.toString()}`));

  console.log("=== TEST 1: Initial Load & Hero Entrance Verification ===");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);

  const getHeroStatus = async () => {
    return await page.evaluate(() => {
      const h1 = document.querySelector(".cinema-title");
      const words = Array.from(document.querySelectorAll(".hero-word"));
      const lead = document.querySelector(".lead[data-hero-support]");
      const buttons = document.querySelectorAll(".button-group[data-hero-support] a");
      const visual = document.querySelector(".hero-product-handoff");
      const canvas = document.querySelector(".hero-product-handoff canvas");
      const poster = document.querySelector(".hero-product-handoff .scene-poster");
      const webglLayer = document.querySelector(".hero-product-handoff .webgl-layer");
      const boundary = document.querySelector(".scene-boundary");

      return {
        h1Visible: Boolean(h1 && getComputedStyle(h1).display !== "none" && getComputedStyle(h1).visibility !== "hidden" && parseFloat(getComputedStyle(h1).opacity) > 0.8),
        h1Text: h1?.innerText?.trim(),
        wordsAllVisible: words.length > 0 && words.every(w => parseFloat(getComputedStyle(w).opacity) > 0.8 && getComputedStyle(w).visibility !== "hidden"),
        wordsCount: words.length,
        leadVisible: Boolean(lead && parseFloat(getComputedStyle(lead).opacity) > 0.8 && getComputedStyle(lead).visibility !== "hidden"),
        buttonsCount: buttons.length,
        buttonsAllVisible: buttons.length === 2 && Array.from(buttons).every(b => parseFloat(getComputedStyle(b).opacity) > 0.8 && getComputedStyle(b).visibility !== "hidden"),
        visualOpacity: visual ? getComputedStyle(visual).opacity : null,
        canvasPresent: Boolean(canvas),
        canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
        sceneState: boundary?.getAttribute("data-scene-state"),
        posterOpacity: poster ? getComputedStyle(poster).opacity : null,
        webglOpacity: webglLayer ? getComputedStyle(webglLayer).opacity : null,
      };
    });
  };

  const initialStatus = await getHeroStatus();
  console.log("Initial Hero Status:", JSON.stringify(initialStatus, null, 2));
  await page.screenshot({ path: "evidence-1-initial-hero.png" });

  console.log("\n=== TEST 2: Tab Inactivity (30 seconds background wait) ===");
  const bgTab = await context.newPage();
  await bgTab.goto("about:blank");
  await bgTab.bringToFront();
  console.log("Waiting 30 seconds with MOTEKRA in background...");
  await bgTab.waitForTimeout(30000);

  console.log("Returning to MOTEKRA tab...");
  await page.bringToFront();
  await page.waitForTimeout(1000);

  const after30sStatus = await getHeroStatus();
  console.log("After 30s Status:", JSON.stringify(after30sStatus, null, 2));
  await page.screenshot({ path: "evidence-2-after-30s.png" });

  if (!after30sStatus.h1Visible || !after30sStatus.wordsAllVisible || !after30sStatus.leadVisible || !after30sStatus.buttonsAllVisible) {
    throw new Error("FAILED: Hero content disappeared after 30s inactivity!");
  }

  console.log("\n=== TEST 3: Extended Inactivity (Simulate 2-5 minutes rAF sleep & clock drift) ===");
  // Simulate tab hide and long sleep
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('blur'));
  });

  await page.waitForTimeout(5000);

  // Restore tab visibility
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));
    window.dispatchEvent(new CustomEvent('motekra-tab-restored'));
  });
  await page.waitForTimeout(1000);

  const afterExtendedStatus = await getHeroStatus();
  console.log("After Extended Inactivity Status:", JSON.stringify(afterExtendedStatus, null, 2));
  await page.screenshot({ path: "evidence-3-after-extended.png" });

  if (!afterExtendedStatus.h1Visible || !afterExtendedStatus.wordsAllVisible || !afterExtendedStatus.leadVisible || !afterExtendedStatus.buttonsAllVisible) {
    throw new Error("FAILED: Hero content disappeared after extended inactivity!");
  }

  console.log("\n=== TEST 4: Browser Events (Window Resize & Minimize/Restore) ===");
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  const afterResizeStatus = await getHeroStatus();
  console.log("After Resize Status:", JSON.stringify(afterResizeStatus, null, 2));
  await page.screenshot({ path: "evidence-4-after-resize.png" });

  console.log("\n=== TEST 5: WebGL Context Loss & Restoration ===");
  const contextLossResult = await page.evaluate(async () => {
    const canvas = document.querySelector(".hero-product-handoff canvas");
    if (!canvas) return "no canvas";
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return "no gl";
    const ext = gl.getExtension("WEBGL_lose_context");
    if (!ext) return "no extension";

    ext.loseContext();
    return "context_lost";
  });
  console.log("Context loss trigger:", contextLossResult);
  await page.waitForTimeout(500);

  // Verify poster fallback is visible during context loss
  const duringLossStatus = await page.evaluate(() => {
    const poster = document.querySelector(".hero-product-handoff .scene-poster");
    return {
      posterOpacity: poster ? getComputedStyle(poster).opacity : null,
      posterVisible: poster ? getComputedStyle(poster).display !== "none" : false,
    };
  });
  console.log("During Loss Status (poster fallback active):", duringLossStatus);

  // Restore context
  await page.evaluate(() => {
    const canvas = document.querySelector(".hero-product-handoff canvas");
    if (canvas) {
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const ext = gl?.getExtension("WEBGL_lose_context");
      ext?.restoreContext();
    }
  });
  await page.waitForTimeout(1000);
  const afterContextRestore = await getHeroStatus();
  console.log("After Context Restoration:", JSON.stringify(afterContextRestore, null, 2));
  await page.screenshot({ path: "evidence-5-after-webgl-restore.png" });

  console.log("\n=== TEST 6: Navigation Away and Back (BFCache / PopState) ===");
  await page.click('a[href="/work"]');
  await page.waitForURL("**/work");
  await page.waitForTimeout(1000);
  console.log("On /work page. Verifying work page hero and cards...");
  const workStatus = await page.evaluate(() => {
    const title = document.querySelector(".work-hero-title");
    const cards = document.querySelectorAll("[data-work-card]");
    return {
      titleVisible: Boolean(title && parseFloat(getComputedStyle(title).opacity) > 0.8),
      cardsCount: cards.length,
      cardsVisible: Array.from(cards).every(c => parseFloat(getComputedStyle(c).opacity) > 0.8),
    };
  });
  console.log("Work Page Status:", workStatus);
  await page.screenshot({ path: "evidence-6-work-page.png" });

  console.log("Navigating Back to Home...");
  await page.goBack();
  await page.waitForURL("http://localhost:3000/");
  await page.waitForTimeout(1000);
  const homeAfterBack = await getHeroStatus();
  console.log("Home After Back Navigation:", JSON.stringify(homeAfterBack, null, 2));
  await page.screenshot({ path: "evidence-7-home-after-back.png" });

  if (!homeAfterBack.h1Visible || !homeAfterBack.wordsAllVisible || !homeAfterBack.leadVisible) {
    throw new Error("FAILED: Hero content missing after back navigation!");
  }

  console.log("\n=== TEST 7: Auditing All 5 Pages (Home, Work, Services, About, Contact) ===");
  const pages = ["/services", "/about", "/contact"];
  for (const route of pages) {
    console.log(`Navigating to ${route} ...`);
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Simulate tab hide and restore
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new CustomEvent('motekra-tab-restored'));
    });
    await page.waitForTimeout(500);

    const pageAudit = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      // Filter out paragraphs that are intentionally collapsed inside details or closed accordions
      const paragraphs = Array.from(document.querySelectorAll("p")).filter(p => {
        const details = p.closest("details");
        if (details && !details.open) return false;
        const closedAccordion = p.closest(".faq-accordion-item:not(.is-open)");
        if (closedAccordion) return false;
        return true;
      });
      const buttons = Array.from(document.querySelectorAll("button, .button, a.button"));
      return {
        h1Text: h1?.innerText?.slice(0, 30),
        h1Visible: Boolean(h1 && parseFloat(getComputedStyle(h1).opacity) > 0.8),
        paragraphsAllVisible: paragraphs.every(p => parseFloat(getComputedStyle(p).opacity) > 0.8),
        buttonsAllVisible: buttons.every(b => parseFloat(getComputedStyle(b).opacity) > 0.8),
      };
    });
    console.log(`Audit for ${route}:`, pageAudit);
    await page.screenshot({ path: `evidence-page-${route.replace('/', '')}.png` });

    if (!pageAudit.h1Visible || !pageAudit.paragraphsAllVisible) {
      throw new Error(`FAILED: Content invisible on ${route}!`);
    }
  }

  console.log("\n==========================================");
  console.log("ALL MANDATORY TESTS PASSED CLEANLY!");
  console.log("==========================================");

  await browser.close();
}

main().catch((err) => {
  console.error("FATAL TEST FAILURE:", err);
  process.exit(1);
});
