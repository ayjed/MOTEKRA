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

  const uiUxItem = page.locator(".service-accordion-item[data-accordion-item='ui-ux-design']");
  await uiUxItem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await uiUxItem.screenshot({ path: "docs/evidence/phase-46/mobile-ui-ux-item.png" });
  console.log("Saved mobile-ui-ux-item.png");

  // 2. Open Web Development
  await buttons.nth(1).click();
  await page.waitForTimeout(600);

  const webDevItem = page.locator(".service-accordion-item[data-accordion-item='web-development']");
  await webDevItem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await webDevItem.screenshot({ path: "docs/evidence/phase-46/mobile-web-dev-item.png" });
  console.log("Saved mobile-web-dev-item.png");

  await browser.close();
}

main().catch(console.error);

