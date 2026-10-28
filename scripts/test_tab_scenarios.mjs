import { chromium } from "@playwright/test";

async function runScenario(name, action) {
  console.log(`\n========================================`);
  console.log(`Running Scenario: ${name}`);
  console.log(`========================================`);

  const browser = await chromium.launch({ headless: true, channel: 'chrome' }).catch(() => chromium.launch({ headless: true, channel: 'msedge' }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const logs = [];
  page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`[PAGE ERROR] ${err.toString()}`));

  try {
    await action(page, context);
  } catch (err) {
    console.error(`Error in ${name}:`, err);
  } finally {
    await browser.close();
  }
}

async function main() {
  // Scenario A: Switch tab DURING preloader (e.g. at 200ms after navigation)
  await runScenario("Switch Tab During Preloader (at 200ms)", async (page, context) => {
    console.log("Navigating to http://localhost:3000/ ...");
    const navPromise = page.goto("http://localhost:3000/");
    await page.waitForTimeout(200);

    console.log("Switching to background tab...");
    const tab2 = await context.newPage();
    await tab2.goto("about:blank");
    await tab2.bringToFront();

    console.log("Waiting 10s in background...");
    await tab2.waitForTimeout(10000);

    console.log("Returning to MOTEKRA tab...");
    await page.bringToFront();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: "scenario-a-during-preloader.png" });

    const state = await page.evaluate(() => {
      const h1 = document.querySelector(".cinema-title");
      const words = Array.from(document.querySelectorAll(".hero-word"));
      const lead = document.querySelector(".lead[data-hero-support]");
      const buttons = document.querySelectorAll(".button-group[data-hero-support] a");
      const preloader = document.getElementById("motekra-preloader");
      const bodyClasses = document.body.className;
      const done = window.__motekra_preloader_done;
      const active = window.__motekra_preloader_active;

      return {
        bodyClasses,
        done,
        active,
        preloaderExists: Boolean(preloader),
        preloaderDisplay: preloader ? getComputedStyle(preloader).display : null,
        preloaderOpacity: preloader ? getComputedStyle(preloader).opacity : null,
        wordsCount: words.length,
        wordsSample: words.slice(0, 3).map(w => ({
          text: w.innerText,
          opacity: getComputedStyle(w).opacity,
          transform: getComputedStyle(w).transform,
          visibility: getComputedStyle(w).visibility,
        })),
        leadOpacity: lead ? getComputedStyle(lead).opacity : null,
        buttonsOpacity: buttons.length ? getComputedStyle(buttons[0]).opacity : null,
      };
    });

    console.log("Scenario A Result:", JSON.stringify(state, null, 2));
  });

  // Scenario B: Long inactivity (simulate clock drift / WebGL context loss / lagSmoothing)
  await runScenario("WebGL Context Loss simulation", async (page, context) => {
    console.log("Navigating and waiting for preloader...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    console.log("Simulating WebGL Context Loss on canvas...");
    const lostHandled = await page.evaluate(() => {
      const canvas = document.querySelector(".hero-product-handoff canvas");
      if (!canvas) return "No canvas found";
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) return "No gl context";
      const ext = gl.getExtension("WEBGL_lose_context");
      if (!ext) return "WEBGL_lose_context not supported";
      ext.loseContext();
      return "Context lost simulated";
    });
    console.log("Lost handled:", lostHandled);

    await page.waitForTimeout(1000);
    await page.screenshot({ path: "scenario-b-webgl-lost.png" });

    const state = await page.evaluate(() => {
      const boundary = document.querySelector(".scene-boundary");
      const poster = document.querySelector(".scene-poster");
      const webglLayer = document.querySelector(".webgl-layer");
      const status = document.querySelector(".scene-status");
      return {
        boundaryState: boundary?.getAttribute("data-scene-state"),
        posterOpacity: poster ? getComputedStyle(poster).opacity : null,
        webglOpacity: webglLayer ? getComputedStyle(webglLayer).opacity : null,
        statusText: status?.innerText,
      };
    });
    console.log("Scenario B Result:", JSON.stringify(state, null, 2));
  });

  // Scenario C: Page Visibility cycling after 2 minutes
  await runScenario("Page Visibility cycling multiple times with scroll", async (page, context) => {
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    console.log("Cycling visibility hidden / visible 5 times with delay...");
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('focus'));
      });
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: "scenario-c-visibility-cycle.png" });
    const state = await page.evaluate(() => {
      const words = Array.from(document.querySelectorAll(".hero-word"));
      const lead = document.querySelector(".lead[data-hero-support]");
      return {
        wordsSample: words.slice(0, 3).map(w => ({
          text: w.innerText,
          opacity: getComputedStyle(w).opacity,
          transform: getComputedStyle(w).transform,
        })),
        leadOpacity: lead ? getComputedStyle(lead).opacity : null,
      };
    });
    console.log("Scenario C Result:", JSON.stringify(state, null, 2));
  });
}

main().catch(console.error);
