const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function testHandoff() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });

  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';
  const framesDir = path.join(brainDir, 'handoff_frames');
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  console.log('--- TEST 1: Desktop Initial Load and Frame-by-Frame Handoff ---');
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  
  // Disable cache to simulate fresh visit
  await page.route('**/*', route => route.continue());

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // Frame 1: Immediate first visible frame (Poster rendering)
  const frame1Path = path.join(framesDir, 'frame_01_first_render.png');
  await page.screenshot({ path: frame1Path });
  console.log('Frame 1 captured (immediate SSR poster):', frame1Path);

  // Check that the removed elements are NOT present in the DOM
  const eyebrowTag = await page.$('.hero-eyebrow-wrap');
  const productAxis = await page.$('.product-axis');
  const heroCaption = await page.$('.hero-scene-caption');
  const cinemaBaseline = await page.$('.cinema-baseline');

  console.log('Verification of removed elements:');
  console.log(' - hero-eyebrow-wrap:', eyebrowTag === null ? 'REMOVED (PASS)' : 'STILL PRESENT (FAIL)');
  console.log(' - product-axis:', productAxis === null ? 'REMOVED (PASS)' : 'STILL PRESENT (FAIL)');
  console.log(' - hero-scene-caption:', heroCaption === null ? 'REMOVED (PASS)' : 'STILL PRESENT (FAIL)');
  console.log(' - cinema-baseline:', cinemaBaseline === null ? 'REMOVED (PASS)' : 'STILL PRESENT (FAIL)');

  if (eyebrowTag || productAxis || heroCaption || cinemaBaseline) {
    throw new Error('Some requested elements were not removed from the hero!');
  }

  // Frame 2: WebGL initializing
  await page.waitForTimeout(400);
  const frame2Path = path.join(framesDir, 'frame_02_webgl_init.png');
  await page.screenshot({ path: frame2Path });
  console.log('Frame 2 captured (WebGL init):', frame2Path);

  // Frame 3: WebGL rendered and handoff ready
  await page.waitForSelector('.webgl-layer canvas', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(600);
  const frame3Path = path.join(framesDir, 'frame_03_handoff_crossfade.png');
  await page.screenshot({ path: frame3Path });
  console.log('Frame 3 captured (handoff crossfade):', frame3Path);

  // Frame 4: Fully interactive 3D WebGL settled
  await page.waitForTimeout(1500);
  const frame4Path = path.join(framesDir, 'frame_04_3d_interactive.png');
  await page.screenshot({ path: frame4Path });
  console.log('Frame 4 captured (interactive 3D):', frame4Path);

  // Test pointer tilt interaction
  console.log('Testing pointer tilt interaction...');
  await page.mouse.move(950, 400);
  await page.waitForTimeout(300);
  const tiltPath = path.join(framesDir, 'frame_05_pointer_tilt.png');
  await page.screenshot({ path: tiltPath });
  console.log('Frame 5 captured (pointer tilt):', tiltPath);

  // Test scroll-linked motion
  console.log('Testing scroll-linked transition...');
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const scrollPath = path.join(framesDir, 'frame_06_scroll_transition.png');
  await page.screenshot({ path: scrollPath });
  console.log('Frame 6 captured (scroll transition):', scrollPath);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);

  // Capture hero crop to closely inspect alignment between frame 1 and frame 4
  const heroElement = await page.$('.home-hero');
  if (heroElement) {
    const heroSettledPath = path.join(brainDir, 'hero_settled_crop.png');
    await heroElement.screenshot({ path: heroSettledPath });
    console.log('Hero crop saved:', heroSettledPath);
  }

  await page.close();
  await context.close();

  console.log('--- TEST 2: Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(500);

  const mobileHeroPath = path.join(framesDir, 'mobile_hero_view.png');
  await mobilePage.screenshot({ path: mobileHeroPath });
  console.log('Mobile hero captured:', mobileHeroPath);

  await mobilePage.close();
  await mobileContext.close();

  await browser.close();
  console.log('--- ALL MANDATORY TESTS PASSED SUCCESSFULLY! ---');
}

testHandoff().catch(err => {
  console.error(err);
  process.exit(1);
});
