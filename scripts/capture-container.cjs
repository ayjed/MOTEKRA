const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });

  const container = await page.$('.services-container-shell');
  if (!container) throw new Error('Container not found');
  await container.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';
  await container.screenshot({ path: path.join(brainDir, 'container_ui_ux.png') });
  console.log('Saved container_ui_ux.png');

  // Click Web Development
  await page.click('#service-button-web-development');
  await page.waitForTimeout(1000);
  await container.screenshot({ path: path.join(brainDir, 'container_web_dev.png') });
  console.log('Saved container_web_dev.png');

  // Click Mobile App Development
  await page.click('#service-button-mobile-app-development');
  await page.waitForTimeout(1000);
  await container.screenshot({ path: path.join(brainDir, 'container_mobile_app.png') });
  console.log('Saved container_mobile_app.png');

  await browser.close();
  console.log('All screenshots saved!');
})();
