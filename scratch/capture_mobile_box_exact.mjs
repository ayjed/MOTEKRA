import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const buttons = page.locator(".service-accordion-header");

  // 1. Open UI/UX Design
  await buttons.nth(0).click();
  await page.waitForTimeout(600);

  const uiUxBox = page.locator(".service-accordion-item[data-accordion-item='ui-ux-design'] .mobile-preview-box");
  await uiUxBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await uiUxBox.screenshot({ path: "docs/evidence/phase-46/mobile-preview-box-ui-ux.png" });
  console.log("Saved mobile-preview-box-ui-ux.png");

  // 2. Open Web Development
  await buttons.nth(1).click();
  await page.waitForTimeout(600);

  const webDevBox = page.locator(".service-accordion-item[data-accordion-item='web-development'] .mobile-preview-box");
  await webDevBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await webDevBox.screenshot({ path: "docs/evidence/phase-46/mobile-preview-box-web-dev.png" });
  console.log("Saved mobile-preview-box-web-dev.png");

  await browser.close();
}

main().catch(console.error);

