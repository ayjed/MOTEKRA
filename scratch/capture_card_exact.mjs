import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const card = page.locator(".services-preview-card");
  const box = await card.boundingBox();
  console.log("Services preview card bounding box without scroll:", box);

  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const boxAfter = await card.boundingBox();
  console.log("Services preview card bounding box after scroll:", boxAfter);

  // Take screenshot of just the preview card!
  await card.screenshot({ path: "docs/evidence/phase-46/element-preview-card-ui-ux.png" });
  console.log("Saved docs/evidence/phase-46/element-preview-card-ui-ux.png");

  // Click Web Development button
  const webDevBtn = page.locator(".service-accordion-header").nth(1);
  await webDevBtn.click();
  await page.waitForTimeout(700);

  await card.screenshot({ path: "docs/evidence/phase-46/element-preview-card-web-dev.png" });
  console.log("Saved docs/evidence/phase-46/element-preview-card-web-dev.png");

  // Also take full section screenshot
  const section = page.locator(".services-container-shell");
  await section.screenshot({ path: "docs/evidence/phase-46/services-section-desktop.png" });
  console.log("Saved docs/evidence/phase-46/services-section-desktop.png");

  await browser.close();
}

main().catch(console.error);

