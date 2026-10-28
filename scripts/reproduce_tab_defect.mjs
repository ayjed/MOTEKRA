import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' }).catch(() => chromium.launch({ headless: true, channel: 'msedge' }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const consoleLogs = [];
  page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => consoleLogs.push(`[PAGE ERROR] ${err.toString()}`));

  console.log("1. Navigating to http://localhost:3000/ ...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  // Wait for preloader to finish (body has class preloader-finished or #motekra-preloader removed)
  console.log("2. Waiting for preloader and hero entrance to complete...");
  await page.waitForTimeout(3000);

  // Take screenshot of settled hero state
  await page.screenshot({ path: "test-before-inactivity.png" });

  const getHeroState = async () => {
    return await page.evaluate(() => {
      const h1 = document.querySelector(".cinema-title");
      const words = Array.from(document.querySelectorAll(".hero-word"));
      const lead = document.querySelector(".lead[data-hero-support]");
      const buttons = document.querySelectorAll(".button-group[data-hero-support] a");
      const visual = document.querySelector(".hero-product-handoff");
      const canvas = document.querySelector(".hero-product-handoff canvas");
      const poster = document.querySelector(".hero-product-handoff .scene-poster");
      const webglLayer = document.querySelector(".hero-product-handoff .webgl-layer");

      return {
        h1: h1 ? {
          text: h1.innerText,
          display: getComputedStyle(h1).display,
          opacity: getComputedStyle(h1).opacity,
          visibility: getComputedStyle(h1).visibility,
          rect: h1.getBoundingClientRect(),
        } : null,
        wordsCount: words.length,
        wordsSample: words.slice(0, 3).map(w => ({
          text: w.innerText,
          opacity: getComputedStyle(w).opacity,
          transform: getComputedStyle(w).transform,
          visibility: getComputedStyle(w).visibility,
        })),
        lead: lead ? {
          text: lead.innerText.slice(0, 30),
          opacity: getComputedStyle(lead).opacity,
          transform: getComputedStyle(lead).transform,
          visibility: getComputedStyle(lead).visibility,
          rect: lead.getBoundingClientRect(),
        } : null,
        buttonsCount: buttons.length,
        buttons: Array.from(buttons).map(b => ({
          text: b.innerText,
          opacity: getComputedStyle(b).opacity,
          visibility: getComputedStyle(b).visibility,
          rect: b.getBoundingClientRect(),
        })),
        visual: visual ? {
          opacity: getComputedStyle(visual).opacity,
          transform: getComputedStyle(visual).transform,
          rect: visual.getBoundingClientRect(),
        } : null,
        canvas: canvas ? {
          width: canvas.width,
          height: canvas.height,
          rect: canvas.getBoundingClientRect(),
        } : null,
        posterOpacity: poster ? getComputedStyle(poster).opacity : null,
        webglOpacity: webglLayer ? getComputedStyle(webglLayer).opacity : null,
      };
    });
  };

  const beforeState = await getHeroState();
  console.log("State BEFORE inactivity:", JSON.stringify(beforeState, null, 2));

  console.log("3. Switching to a new background tab...");
  const secondTab = await context.newPage();
  await secondTab.goto("about:blank");
  await secondTab.bringToFront();

  console.log("4. Simulating tab inactivity (waiting 15s in background)...");
  await secondTab.waitForTimeout(15000);

  console.log("5. Bringing MOTEKRA tab back to front...");
  await page.bringToFront();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: "test-after-inactivity.png" });
  const afterState = await getHeroState();
  console.log("State AFTER inactivity:", JSON.stringify(afterState, null, 2));

  console.log("Console logs captured:", consoleLogs);

  await browser.close();
}

main().catch(console.error);
