const { chromium } = require('@playwright/test');
const path = require('path');

async function testPages() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';

  // 1. Test Home page services section
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const homeServicesSection = await page.$('#home-services');
  if (!homeServicesSection) throw new Error('#home-services not found on HomePage');
  await homeServicesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take screenshot of home services section
  await homeServicesSection.screenshot({ path: path.join(brainDir, 'home_services_redesign.png') });
  console.log('Saved home_services_redesign.png');

  // Verify accordion buttons on home page
  const homeAccordionButtons = await homeServicesSection.$$('.service-accordion-header');
  console.log(`Home page service accordion buttons count: ${homeAccordionButtons.length}`);
  if (homeAccordionButtons.length !== 5) {
    throw new Error(`Expected 5 services in Home page accordion, got ${homeAccordionButtons.length}`);
  }

  // Click Web Development on Home page
  console.log('Clicking Web Development on Home page...');
  const webBtn = await homeServicesSection.$('#service-button-web-development');
  await webBtn.click();
  await page.waitForTimeout(1000);
  await homeServicesSection.screenshot({ path: path.join(brainDir, 'home_services_web_dev.png') });
  console.log('Saved home_services_web_dev.png');

  // 2. Test Services page
  console.log('Navigating to http://localhost:3000/services...');
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });
  const servicesContainer = await page.$('.services-container-shell');
  await servicesContainer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Check UI/UX Design (initial active)
  await servicesContainer.screenshot({ path: path.join(brainDir, 'services_page_ui_ux_real.png') });
  console.log('Saved services_page_ui_ux_real.png');

  // Click Web Development
  await page.click('#service-button-web-development');
  await page.waitForTimeout(1000);
  await servicesContainer.screenshot({ path: path.join(brainDir, 'services_page_web_dev_real.png') });
  console.log('Saved services_page_web_dev_real.png');

  // Click Mobile App Development
  await page.click('#service-button-mobile-app-development');
  await page.waitForTimeout(1000);
  await servicesContainer.screenshot({ path: path.join(brainDir, 'services_page_mobile_real.png') });
  console.log('Saved services_page_mobile_real.png');

  // Click Brand & Visual Design
  await page.click('#service-button-brand-visual-design');
  await page.waitForTimeout(1000);
  await servicesContainer.screenshot({ path: path.join(brainDir, 'services_page_brand_real.png') });
  console.log('Saved services_page_brand_real.png');

  // Click Product Strategy
  await page.click('#service-button-product-strategy');
  await page.waitForTimeout(1000);
  await servicesContainer.screenshot({ path: path.join(brainDir, 'services_page_strategy_real.png') });
  console.log('Saved services_page_strategy_real.png');

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

testPages().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
