const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function testServices() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000/services...');
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });

  // 1. Verify Heading
  const heading = await page.textContent('#services-main-heading');
  console.log('Heading text:', heading?.trim());
  if (!heading?.includes('What We Bring to Life')) {
    throw new Error('Heading does not match "What We Bring to Life."');
  }

  // 2. Check all 5 service buttons
  const serviceButtons = await page.$$('.service-accordion-header');
  console.log(`Found ${serviceButtons.length} service headers.`);
  if (serviceButtons.length !== 5) {
    throw new Error(`Expected 5 services, found ${serviceButtons.length}`);
  }

  const titles = await page.$$eval('.service-accordion-title', (els) => els.map((e) => e.textContent?.trim()));
  console.log('Services rendered:', titles);

  // 3. Verify initial active service (UI/UX Design)
  const initialExpanded = await page.$eval('#service-button-ui-ux-design', (el) => el.getAttribute('aria-expanded'));
  console.log('UI/UX Design initial aria-expanded:', initialExpanded);
  if (initialExpanded !== 'true') {
    throw new Error('Initial service UI/UX Design is not expanded');
  }

  // 4. Verify preview layer for UI/UX Design is active
  const uiUxLayerActive = await page.$eval('[data-preview-slug="ui-ux-design"]', (el) => el.classList.contains('is-active'));
  console.log('UI/UX Design preview layer is-active:', uiUxLayerActive);

  // Take screenshot of initial state
  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';
  await page.screenshot({ path: path.join(brainDir, 'services_desktop_ui_ux.png'), fullPage: false });
  console.log('Saved services_desktop_ui_ux.png');

  // 5. Click "Web Development"
  console.log('Clicking Web Development...');
  await page.click('#service-button-web-development');
  await page.waitForTimeout(400);

  const webExpanded = await page.$eval('#service-button-web-development', (el) => el.getAttribute('aria-expanded'));
  const uiUxCollapsed = await page.$eval('#service-button-ui-ux-design', (el) => el.getAttribute('aria-expanded'));
  const webLayerActive = await page.$eval('[data-preview-slug="web-development"]', (el) => el.classList.contains('is-active'));
  console.log('Web Development aria-expanded:', webExpanded);
  console.log('UI/UX Design aria-expanded after click:', uiUxCollapsed);
  console.log('Web Development preview layer is-active:', webLayerActive);

  if (webExpanded !== 'true' || uiUxCollapsed !== 'false' || !webLayerActive) {
    throw new Error('Clicking Web Development failed to toggle accordion states properly');
  }

  // 6. Click "Mobile App Development"
  console.log('Clicking Mobile App Development...');
  await page.click('#service-button-mobile-app-development');
  await page.waitForTimeout(400);

  const mobileExpanded = await page.$eval('#service-button-mobile-app-development', (el) => el.getAttribute('aria-expanded'));
  const mobileLayerActive = await page.$eval('[data-preview-slug="mobile-app-development"]', (el) => el.classList.contains('is-active'));
  console.log('Mobile App Development aria-expanded:', mobileExpanded);
  console.log('Mobile preview layer is-active:', mobileLayerActive);

  // 7. Keyboard Navigation test: focus and trigger Product Strategy
  console.log('Testing keyboard navigation...');
  await page.focus('#service-button-product-strategy');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);

  const strategyExpanded = await page.$eval('#service-button-product-strategy', (el) => el.getAttribute('aria-expanded'));
  const strategyLayerActive = await page.$eval('[data-preview-slug="product-strategy"]', (el) => el.classList.contains('is-active'));
  console.log('Product Strategy keyboard aria-expanded:', strategyExpanded);
  console.log('Product Strategy preview layer is-active:', strategyLayerActive);

  if (strategyExpanded !== 'true' || !strategyLayerActive) {
    throw new Error('Keyboard activation of Product Strategy failed');
  }

  await page.screenshot({ path: path.join(brainDir, 'services_desktop_strategy.png'), fullPage: false });
  console.log('Saved services_desktop_strategy.png');

  // 8. Mobile viewport test
  console.log('Testing mobile viewport (375x812)...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);

  // Check mobile preview is visible
  const mobilePreviewVisible = await page.$eval('#service-panel-product-strategy .service-mobile-preview', (el) => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none';
  });
  console.log('Mobile preview in active panel visible:', mobilePreviewVisible);

  await page.screenshot({ path: path.join(brainDir, 'services_mobile_view.png'), fullPage: false });
  console.log('Saved services_mobile_view.png');

  console.log('ALL SERVICES TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

testServices().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
