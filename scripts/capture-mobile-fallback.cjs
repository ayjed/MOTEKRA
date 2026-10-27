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

  // Mobile Capture (390x844 viewport, dpr 2)
  console.log('Capturing Mobile 3D Scene pure canvas...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  
  // Expose an override before loading so sceneQuality sees width: 1024 or allows 3D
  await mobilePage.addInitScript(() => {
    // Override window.innerWidth for snapshot calculation while keeping actual layout at 390
    let originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      get: () => 1024,
      configurable: true
    });
  });

  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('.webgl-layer canvas', { state: 'visible', timeout: 15000 });
  await mobilePage.waitForTimeout(4000);

  // Hide extraneous elements
  await mobilePage.evaluate(() => {
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

  const canvas = await mobilePage.locator('.webgl-layer canvas').first();
  const mobilePng = path.join(outDir, 'hero-devices-mobile.png');
  await canvas.screenshot({ path: mobilePng, omitBackground: true });
  console.log('Saved', mobilePng);

  await mobilePage.close();
  await browser.close();
  console.log('Mobile capture finished!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
