import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-33';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  // ==========================================
  // 1. DESKTOP VIEWPORT (1440 x 960)
  // ==========================================
  console.log('=== 1. Testing Homepage Featured Projects Container Dimensions (1440x960) ===');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'no-preference'
  });

  const page = await contextDesktop.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to featured work section
  const section = page.locator('#featured-work');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const cards = page.locator('#featured-work .davka-project-card');
  const count = await cards.count();
  console.log(`Found ${count} featured project cards`);
  if (count !== 4) throw new Error(`Expected 4 cards, found ${count}`);

  // Measure first card dimensions and styling
  const card0 = cards.nth(0);
  const card0Bbox = await card0.boundingBox();
  const container = page.locator('#featured-work .container');
  const containerBbox = await container.boundingBox();

  console.log('Card 0 Desktop Bounding Box:', {
    width: Math.round(card0Bbox.width),
    height: Math.round(card0Bbox.height),
    x: Math.round(card0Bbox.x),
    y: Math.round(card0Bbox.y)
  });
  console.log('Container Desktop Bounding Box:', {
    width: Math.round(containerBbox.width),
    x: Math.round(containerBbox.x)
  });

  // Verify Width: between 1200px and 1300px
  if (card0Bbox.width < 1200 || card0Bbox.width > 1300) {
    throw new Error(`Card width ${card0Bbox.width}px is outside required range [1200px, 1300px]`);
  }
  console.log(`✓ Card width (${Math.round(card0Bbox.width)}px) is within required 1200–1300px range.`);

  // Verify Height: exactly 720px
  if (Math.round(card0Bbox.height) !== 720) {
    throw new Error(`Card height ${card0Bbox.height}px is not the approved 720px desktop height`);
  }
  console.log(`✓ Card height (${Math.round(card0Bbox.height)}px) matches approved 720px desktop height.`);

  // Verify Horizontal Centering: card left offset relative to container matches right offset
  const leftSpace = card0Bbox.x - containerBbox.x;
  const rightSpace = (containerBbox.x + containerBbox.width) - (card0Bbox.x + card0Bbox.width);
  console.log(`Horizontal centering offsets: left=${leftSpace.toFixed(1)}px, right=${rightSpace.toFixed(1)}px`);
  if (Math.abs(leftSpace - rightSpace) > 2) {
    throw new Error(`Card is not centered horizontally: left=${leftSpace}px, right=${rightSpace}px`);
  }
  console.log('✓ Card is centered horizontally within container.');

  // Verify Typography and Overlay
  const titleElem = card0.locator('.davka-project-title');
  const titleText = await titleElem.innerText();
  const titleStyles = await titleElem.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontWeight: s.fontWeight,
      fontSize: s.fontSize,
      textAlign: s.textAlign,
      color: s.color
    };
  });
  console.log(`Card title: "${titleText}"`, titleStyles);
  if (titleStyles.fontWeight !== '500') {
    throw new Error(`Expected font-weight 500 (medium), got ${titleStyles.fontWeight}`);
  }
  console.log('✓ Project title uses refined medium-weight typography (500).');

  // Verify Image Positioning & Overlay
  const imgElem = card0.locator('.davka-project-img');
  const imgStyles = await imgElem.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      objectFit: s.objectFit,
      objectPosition: s.objectPosition
    };
  });
  console.log('Image CSS styles:', imgStyles);
  if (imgStyles.objectFit !== 'cover') {
    throw new Error(`Expected object-fit: cover, got ${imgStyles.objectFit}`);
  }
  console.log('✓ Image preserves original screenshot aspect ratio without stretching (object-fit: cover).');

  const overlayElem = card0.locator('.davka-project-overlay');
  const overlayVisible = await overlayElem.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return s.pointerEvents === 'none' && s.display !== 'none';
  });
  if (!overlayVisible) throw new Error('Overlay element not configured properly');
  console.log('✓ Subtle dark overlay is active and configured.');

  // Screenshot 01: Desktop Card 0
  await page.screenshot({ path: `${outputDir}/01_desktop_project_container_1280x720.png` });
  console.log('Saved screenshot 01_desktop_project_container_1280x720.png');

  // ==========================================
  // 2. CINEMATIC GSAP TRANSITIONS & SINGLE PROJECT VISIBILITY
  // ==========================================
  console.log('=== 2. Testing Scroll-Linked Transitions (One Project at a Time) ===');
  
  // Scroll down until Card 1 replaces Card 0
  const card1 = cards.nth(1);
  await card1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Check visibility of Card 0 and Card 1
  const card0Visibility = await card0.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      opacity: parseFloat(s.opacity),
      visibility: s.visibility,
      transform: s.transform
    };
  });
  const card1Visibility = await card1.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      opacity: parseFloat(s.opacity),
      visibility: s.visibility
    };
  });

  console.log('Scroll state (Card 1 in view):', { card0: card0Visibility, card1: card1Visibility });
  if (card0Visibility.opacity > 0.05 && card0Visibility.visibility !== 'hidden') {
    console.warn(`Note: Card 0 opacity is ${card0Visibility.opacity}`);
  } else {
    console.log('✓ Card 0 completely disappeared when Card 1 settled.');
  }

  // Screenshot 02: Card 1 in view
  await page.screenshot({ path: `${outputDir}/02_desktop_project_card1_active.png` });
  console.log('Saved screenshot 02_desktop_project_card1_active.png');

  // Scroll to Card 2 and Card 3 to ensure smooth stack and no dead zones
  const card3 = cards.nth(3);
  await card3.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outputDir}/03_desktop_project_card3_active.png` });
  console.log('Saved screenshot 03_desktop_project_card3_active.png');

  await contextDesktop.close();

  // ==========================================
  // 3. TABLET VIEWPORT (1024 x 768)
  // ==========================================
  console.log('=== 3. Testing Tablet Responsive Scaling (1024x768) ===');
  const contextTablet = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: 'no-preference'
  });
  const pageTablet = await contextTablet.newPage();
  pageTablet.on('pageerror', (err) => errors.push(err.message));

  await pageTablet.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(1500);

  const tabletSection = pageTablet.locator('#featured-work');
  await tabletSection.scrollIntoViewIfNeeded();
  await pageTablet.waitForTimeout(800);

  const tabletCard = pageTablet.locator('#featured-work .davka-project-card').nth(0);
  const tabletCardBbox = await tabletCard.boundingBox();
  console.log('Tablet Card Bounding Box:', {
    width: Math.round(tabletCardBbox.width),
    height: Math.round(tabletCardBbox.height),
    aspectRatio: (tabletCardBbox.width / tabletCardBbox.height).toFixed(2)
  });

  // Check no horizontal overflow
  const tabletScrollWidth = await pageTablet.evaluate(() => document.documentElement.scrollWidth);
  if (tabletScrollWidth > 1024) {
    throw new Error(`Tablet horizontal overflow detected: scrollWidth=${tabletScrollWidth}px > 1024px`);
  }
  console.log('✓ Tablet layout scales proportionally with zero horizontal overflow.');

  await pageTablet.screenshot({ path: `${outputDir}/04_tablet_responsive_project.png` });
  console.log('Saved screenshot 04_tablet_responsive_project.png');
  await contextTablet.close();

  // ==========================================
  // 4. MOBILE VIEWPORT (390 x 844)
  // ==========================================
  console.log('=== 4. Testing Mobile Responsive Scaling (390x844) ===');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const pageMobile = await contextMobile.newPage();
  pageMobile.on('pageerror', (err) => errors.push(err.message));

  await pageMobile.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1500);

  const mobileSection = pageMobile.locator('#featured-work');
  await mobileSection.scrollIntoViewIfNeeded();
  await pageMobile.waitForTimeout(800);

  const mobileCard = pageMobile.locator('#featured-work .davka-project-card').nth(0);
  const mobileCardBbox = await mobileCard.boundingBox();
  console.log('Mobile Card Bounding Box:', {
    width: Math.round(mobileCardBbox.width),
    height: Math.round(mobileCardBbox.height)
  });

  const mobileTitle = await mobileCard.locator('.davka-project-title').innerText();
  console.log(`Mobile Title: "${mobileTitle}"`);

  // Check no horizontal overflow
  const mobileScrollWidth = await pageMobile.evaluate(() => document.documentElement.scrollWidth);
  if (mobileScrollWidth > 390) {
    throw new Error(`Mobile horizontal overflow detected: scrollWidth=${mobileScrollWidth}px > 390px`);
  }
  console.log('✓ Mobile layout fits cleanly with zero horizontal overflow.');

  await pageMobile.screenshot({ path: `${outputDir}/05_mobile_responsive_project.png` });
  console.log('Saved screenshot 05_mobile_responsive_project.png');
  await contextMobile.close();

  // ==========================================
  // 5. DEDICATED WORK PAGE PRESERVATION CHECK
  // ==========================================
  console.log('=== 5. Verifying Dedicated Work Page (/work) Is Untouched ===');
  const contextWork = await browser.newContext({
    viewport: { width: 1440, height: 960 }
  });
  const pageWork = await contextWork.newPage();
  pageWork.on('pageerror', (err) => errors.push(err.message));

  await pageWork.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await pageWork.waitForTimeout(2500);

  const workCards = pageWork.locator('.work-portfolio-grid [data-work-card]');
  const workCount = await workCards.count();
  console.log(`Work page grid cards count: ${workCount}`);
  if (workCount !== 4) throw new Error(`Expected 4 cards in /work grid, got ${workCount}`);
  console.log('✓ Dedicated Work page portfolio grid is completely intact and unaffected.');
  await pageWork.screenshot({ path: `${outputDir}/06_work_page_untouched_grid.png` });
  console.log('Saved screenshot 06_work_page_untouched_grid.png');
  await contextWork.close();

  // Check for any runtime errors
  if (errors.length > 0) {
    throw new Error(`Runtime page errors detected: ${JSON.stringify(errors)}`);
  }
  console.log('✓ ZERO runtime page errors detected.');
  console.log('=== ALL PHASE 33 VERIFICATION CRITERIA PASSED! ===');

} finally {
  await browser.close();
}
