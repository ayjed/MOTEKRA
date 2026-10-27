const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function capture3dScene() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';
  const publicHeroDir = path.join(process.cwd(), 'public', 'assets', 'hero');
  if (!fs.existsSync(publicHeroDir)) {
    fs.mkdirSync(publicHeroDir, { recursive: true });
  }

  // 1. Desktop Capture (1440x900 viewport)
  console.log('Capturing Desktop 3D Scene...');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for WebGL canvas to be ready and animated to settled state
  await page.waitForSelector('.webgl-layer canvas', { state: 'visible', timeout: 15000 });
  // Wait for 3.5 seconds so elapsed time > 2.2s and scene is fully settled
  await page.waitForTimeout(4000);

  // Get canvas element
  const canvas = await page.$('.webgl-layer canvas');
  if (!canvas) throw new Error('Could not find .webgl-layer canvas');

  // Save full canvas snapshot
  const desktopCanvasPath = path.join(publicHeroDir, 'hero-devices-desktop.png');
  await canvas.screenshot({ path: desktopCanvasPath, omitBackground: true });
  console.log('Saved', desktopCanvasPath);

  // Also take a screenshot of .scene-boundary for reference
  const boundary = await page.$('.scene-boundary');
  if (boundary) {
    const boundaryPath = path.join(brainDir, 'desktop_scene_boundary.png');
    await boundary.screenshot({ path: boundaryPath });
    console.log('Saved', boundaryPath);
  }

  // 2. Mobile Capture (390x844 viewport)
  console.log('Capturing Mobile 3D Scene...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await mobilePage.waitForSelector('.webgl-layer canvas', { state: 'visible', timeout: 15000 });
  await mobilePage.waitForTimeout(4000);

  const mobileCanvas = await mobilePage.$('.webgl-layer canvas');
  if (mobileCanvas) {
    const mobileCanvasPath = path.join(publicHeroDir, 'hero-devices-mobile.png');
    await mobileCanvas.screenshot({ path: mobileCanvasPath, omitBackground: true });
    console.log('Saved', mobileCanvasPath);
  }

  const mobileBoundary = await mobilePage.$('.scene-boundary');
  if (mobileBoundary) {
    const mobileBoundaryPath = path.join(brainDir, 'mobile_scene_boundary.png');
    await mobileBoundary.screenshot({ path: mobileBoundaryPath });
    console.log('Saved', mobileBoundaryPath);
  }

  await page.close();
  await mobilePage.close();
  await browser.close();
  console.log('Capture completed successfully!');
}

capture3dScene().catch((err) => {
  console.error(err);
  process.exit(1);
});
