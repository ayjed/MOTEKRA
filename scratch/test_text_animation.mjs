import { chromium } from "file:///C:/Users/DELL/Desktop/MESH%20PROJECT/MOTEKRA/node_modules/@playwright/test/index.mjs";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const PAGES = [
  { name: "home", path: "/" },
  { name: "work", path: "/work" },
  { name: "services", path: "/services" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "case-study", path: "/work/spotlight-contest" },
  { name: "profile", path: "/team/akinwumi-ayomiposi" },
];

const EVIDENCE_DIR = path.resolve("docs/evidence/phase-43");
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

async function runTests() {
  console.log("=== Phase 43: Text Animation QA & Verification ===");
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });

  const report = {
    timestamp: new Date().toISOString(),
    viewportsTested: VIEWPORTS.map((v) => v.name),
    pagesTested: PAGES.map((p) => p.name),
    results: [],
  };

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const p of PAGES) {
      console.log(`Navigating to ${p.path} [${vp.name}]...`);
      await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Check text visibility on initial load
      const initialTextStats = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
        const allVisible = headings.every((h) => {
          const style = window.getComputedStyle(h);
          const rect = h.getBoundingClientRect();
          return style.opacity !== "0" && style.visibility !== "hidden" && rect.width > 0;
        });
        return { count: headings.length, allVisible };
      });

      // Scroll smoothly through the page to trigger all scroll animations
      await page.evaluate(async () => {
        const distance = 400;
        const totalHeight = document.body.scrollHeight;
        let current = 0;
        while (current < totalHeight) {
          window.scrollBy(0, distance);
          current += distance;
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(600);

      // Scroll back up to test reverse scrolling (Requirement #4: Keep completed text visible)
      await page.evaluate(async () => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(400);

      // Simulate tab switch / inactive state (Requirement #8: Prevent disappearing text)
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", { value: true, writable: true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.waitForTimeout(200);
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", { value: false, writable: true });
        document.dispatchEvent(new Event("visibilitychange"));
        window.dispatchEvent(new Event("focus"));
        window.dispatchEvent(new CustomEvent("motekra-tab-restored"));
      });
      await page.waitForTimeout(300);

      // Verify all text elements remain fully visible and non-zero opacity
      const finalHealth = await page.evaluate(() => {
        const elementsToCheck = Array.from(
          document.querySelectorAll(
            "h1, h2, h3, [data-line], [data-work-title-line], [data-process-title-line], [data-testimonials-title-line], [data-services-heading-line], [data-editorial-line], .hero-word, .lead"
          )
        );
        let hiddenCount = 0;
        const failures = [];
        elementsToCheck.forEach((el) => {
          const style = window.getComputedStyle(el);
          const opacity = parseFloat(style.opacity);
          const visibility = style.visibility;
          if (opacity === 0 || visibility === "hidden") {
            hiddenCount++;
            failures.push({
              tag: el.tagName,
              text: el.textContent?.slice(0, 30),
              class: el.className,
              opacity,
              visibility,
            });
          }
        });
        return {
          totalChecked: elementsToCheck.length,
          hiddenCount,
          failures,
        };
      });

      console.log(
        `  Page ${p.path} [${vp.name}]: Checked ${finalHealth.totalChecked} elements, hidden=${finalHealth.hiddenCount}`
      );

      // Capture screenshot
      const shotPath = path.join(EVIDENCE_DIR, `${p.name}-${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      report.results.push({
        page: p.name,
        path: p.path,
        viewport: vp.name,
        initialTextVisible: initialTextStats.allVisible,
        finalElementsChecked: finalHealth.totalChecked,
        hiddenCount: finalHealth.hiddenCount,
        passed: finalHealth.hiddenCount === 0,
        screenshot: shotPath,
      });
    }

    await context.close();
  }

  await browser.close();

  const totalTests = report.results.length;
  const passedTests = report.results.filter((r) => r.passed).length;
  console.log(`\n=== QA Summary: ${passedTests}/${totalTests} tests passed ===`);

  fs.writeFileSync(path.join(EVIDENCE_DIR, "qa-report.json"), JSON.stringify(report, null, 2));
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

