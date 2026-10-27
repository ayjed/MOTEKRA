const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });

  const outDir = path.join(process.cwd(), 'public', 'assets', 'hero');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Desktop Capture (1440x900 viewport)
  console.log('Capturing Desktop 3D Scene pure canvas...');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForSelector('.webgl-layer canvas', { state: 'visible', timeout: 15000 });
  // Wait for 3.5s so elapsed time > 2.2s and scene is fully settled
  await page.waitForTimeout(4000);

  // Hide all extraneous elements in hero
  await page.evaluate(() => {
    const selectors = [
      '.hero-copy', '.hero-orbit', '.product-axis', '.capability-tag',
      '.hero-scene-caption', '.cinema-baseline', '.scene-poster',
      '.scene-status', '.site-header', '.home-work'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.style.setProperty('display', 'none', 'important'));
    });
    const hero = document.querySelector('.home-hero');
    if (hero) hero.style.setProperty('background', 'transparent', 'important');
    document.body.style.setProperty('background', 'transparent', 'important');
    document.documentElement.style.setProperty('background', 'transparent', 'important');
  });

  const canvas = await page.locator('.webgl-layer canvas').first();
  const desktopPng = path.join(outDir, 'hero-devices-desktop.png');
  await canvas.screenshot({ path: desktopPng, omitBackground: true });
  console.log('Saved', desktopPng);

  await page.close();
  await browser.close();
  console.log('Capture script finished!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
