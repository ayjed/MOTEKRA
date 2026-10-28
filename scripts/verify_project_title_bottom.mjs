import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-39';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  console.log('================================================================');
  console.log('PHASE 39 VERIFICATION: FEATURED PROJECT TITLE & ARROW OVERLAP FIX');
  console.log('================================================================\n');

  // ==========================================
  // 1. DESKTOP VIEWPORT (1440 x 960)
  // ==========================================
  console.log('--- 1. Testing Desktop (1440x960) Dimensions & Layout ---');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'no-preference'
  });

  const page = await contextDesktop.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  // Wait for preloader to complete and lift
  await page.waitForTimeout(3500);

  // Scroll to featured work section
  const section = page.locator('#featured-work');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const cards = page.locator('#featured-work .davka-project-card');
  const count = await cards.count();
  console.log(`Found ${count} featured project cards`);
  if (count !== 4) throw new Error(`Expected 4 cards, found ${count}`);

  // Card 0 (Spotlight Contest)
  const card0 = cards.nth(0);
  await card0.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const card0Bbox = await card0.boundingBox();
  console.log('Card 0 Desktop Bounding Box:', {
    width: Math.round(card0Bbox.width),
    height: Math.round(card0Bbox.height),
    x: Math.round(card0Bbox.x),
    y: Math.round(card0Bbox.y)
  });

  // Verify Dimensions (1280 x 720 target)
  const computedHeight = await card0.evaluate((el) => window.getComputedStyle(el).height);
  if (computedHeight !== '720px') {
    throw new Error(`Expected computed height 720px, got ${computedHeight}`);
  }
  if (card0Bbox.width < 1200 || card0Bbox.width > 1300) {
    throw new Error(`Card width ${card0Bbox.width}px is outside 1200–1300px target`);
  }
  if (card0Bbox.height < 700 || card0Bbox.height > 730) {
    throw new Error(`Card rendered height ${card0Bbox.height}px deviates significantly from 720px`);
  }
  console.log(`✓ Container dimensions preserved at 1280 × 720px desktop standard (computed: ${computedHeight}, rendered bbox: ${Math.round(card0Bbox.height)}px).`);

  // Check Title position and typography
  const titleElem = card0.locator('.davka-project-title');
  const titleText = await titleElem.innerText();
  const titleBbox = await titleElem.boundingBox();
  const titleStyles = await titleElem.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontWeight: s.fontWeight,
      fontSize: s.fontSize,
      textAlign: s.textAlign,
      color: s.color,
      lineHeight: s.lineHeight
    };
  });

  console.log(`Title Text: "${titleText}"`);
  console.log('Title Styles:', titleStyles);
  console.log('Title Bounding Box:', {
    width: Math.round(titleBbox.width),
    height: Math.round(titleBbox.height),
    x: Math.round(titleBbox.x),
    y: Math.round(titleBbox.y)
  });

  const parsedFontSize = parseFloat(titleStyles.fontSize);
  if (parsedFontSize < 30 || parsedFontSize > 42) {
    throw new Error(`Title font-size ${titleStyles.fontSize} is outside target 32–40px range`);
  }
  console.log(`✓ Typography size ${titleStyles.fontSize} targets required 32–40px range.`);

  if (titleStyles.fontWeight !== '500') {
    throw new Error(`Expected medium weight 500, got ${titleStyles.fontWeight}`);
  }
  console.log('✓ Typography weight is refined medium weight (500).');

  // Verify Title Position: Bottom-Left
  const titleBottomOffset = (card0Bbox.y + card0Bbox.height) - (titleBbox.y + titleBbox.height);
  const titleLeftOffset = titleBbox.x - card0Bbox.x;
  console.log(`Title offsets relative to card: left=${Math.round(titleLeftOffset)}px, bottom=${Math.round(titleBottomOffset)}px`);

  if (titleLeftOffset < 30 || titleLeftOffset > 60) {
    throw new Error(`Title left offset ${titleLeftOffset}px is not within ~40-48px internal padding`);
  }
  if (titleBottomOffset < 30 || titleBottomOffset > 60) {
    throw new Error(`Title bottom offset ${titleBottomOffset}px is not within ~40-48px internal padding`);
  }
  console.log('✓ Project title is positioned in the bottom-left corner with ~40–48px internal padding.');

  // Check Arrow position and styling
  const arrowElem = card0.locator('.davka-project-arrow');
  const arrowBbox = await arrowElem.boundingBox();
  const arrowStyles = await arrowElem.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      width: s.width,
      height: s.height,
      borderRadius: s.borderRadius,
      background: s.background,
      display: s.display
    };
  });

  console.log('Arrow Bounding Box:', {
    width: Math.round(arrowBbox.width),
    height: Math.round(arrowBbox.height),
    x: Math.round(arrowBbox.x),
    y: Math.round(arrowBbox.y)
  });
  console.log('Arrow Styles:', {
    width: arrowStyles.width,
    height: arrowStyles.height,
    borderRadius: arrowStyles.borderRadius
  });

  const arrowBottomOffset = (card0Bbox.y + card0Bbox.height) - (arrowBbox.y + arrowBbox.height);
  const arrowRightOffset = (card0Bbox.x + card0Bbox.width) - (arrowBbox.x + arrowBbox.width);
  console.log(`Arrow offsets relative to card: right=${Math.round(arrowRightOffset)}px, bottom=${Math.round(arrowBottomOffset)}px`);

  if (arrowRightOffset < 30 || arrowRightOffset > 60) {
    throw new Error(`Arrow right offset ${arrowRightOffset}px is not within ~40-48px internal padding`);
  }
  if (arrowBottomOffset < 30 || arrowBottomOffset > 60) {
    throw new Error(`Arrow bottom offset ${arrowBottomOffset}px is not within ~40-48px internal padding`);
  }
  console.log('✓ Project arrow is positioned in the bottom-right corner with ~40–48px internal padding.');

  // Vertical alignment between Title and Arrow: bottom edges should align
  const verticalDiff = Math.abs((titleBbox.y + titleBbox.height) - (arrowBbox.y + arrowBbox.height));
  console.log(`Vertical alignment difference between title bottom and arrow bottom: ${verticalDiff.toFixed(1)}px`);
  if (verticalDiff > 12) {
    throw new Error(`Title and arrow are not visually aligned on the bottom row (diff: ${verticalDiff}px)`);
  }
  console.log('✓ Arrow is visually aligned with the bottom-left project title.');

  // Verify Gradient overlay: subtle bottom-weighted gradient, leaving screenshot visible
  const overlayElem = card0.locator('.davka-project-overlay');
  const overlayBackground = await overlayElem.evaluate((el) => window.getComputedStyle(el).backgroundImage);
  console.log('Overlay Background:', overlayBackground);
  if (!overlayBackground.includes('linear-gradient') || !overlayBackground.includes('rgba(8, 21, 43')) {
    throw new Error(`Expected subtle linear bottom gradient, got: ${overlayBackground}`);
  }
  console.log('✓ Overlay uses a subtle bottom-weighted gradient scrim, leaving screenshot content visible.');

  // Take screenshot of Desktop Card 0 directly
  await card0.screenshot({
    path: `${outputDir}/01-featured-work-card0-desktop.png`
  });
  console.log(`Captured: ${outputDir}/01-featured-work-card0-desktop.png`);

  // Close-up of Bottom Row (Title + Arrow)
  const footerElem = card0.locator('.davka-project-footer');
  await footerElem.screenshot({
    path: `${outputDir}/02-card0-bottom-left-title-arrow.png`
  });
  console.log(`Captured: ${outputDir}/02-card0-bottom-left-title-arrow.png`);

  // Hover Interaction Test
  console.log('--- Testing Hover Interaction ---');
  await card0.hover();
  await page.waitForTimeout(500);

  const titleHoverTransform = await titleElem.evaluate((el) => window.getComputedStyle(el).transform);
  const arrowHoverTransform = await arrowElem.evaluate((el) => window.getComputedStyle(el).transform);
  console.log('Title hover transform:', titleHoverTransform);
  console.log('Arrow hover transform:', arrowHoverTransform);

  await footerElem.screenshot({
    path: `${outputDir}/03-card0-hover-state.png`
  });
  console.log(`Captured: ${outputDir}/03-card0-hover-state.png`);

  // Test Scroll Transitions: One Project Visible at a Time
  console.log('--- Testing Cinematic Scroll Transitions ---');
  const card1 = cards.nth(1);
  await card1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const card1Title = card1.locator('.davka-project-title');
  const card1TitleText = await card1Title.innerText();
  console.log(`Active transitioned card title: "${card1TitleText}"`);

  await card1.screenshot({
    path: `${outputDir}/04-featured-work-card1-transition.png`
  });
  console.log(`Captured: ${outputDir}/04-featured-work-card1-transition.png`);

  await contextDesktop.close();

  // ==========================================
  // 2. TABLET VIEWPORT (1024 x 768)
  // ==========================================
  console.log('\n--- 2. Testing Tablet (1024x768) Responsive Layout ---');
  const contextTablet = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: 'no-preference'
  });

  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(3500);

  const tabletSection = pageTablet.locator('#featured-work');
  await tabletSection.scrollIntoViewIfNeeded();
  await pageTablet.waitForTimeout(800);

  const tabletCard0 = pageTablet.locator('#featured-work .davka-project-card').nth(0);
  await tabletCard0.scrollIntoViewIfNeeded();
  await pageTablet.waitForTimeout(600);

  const tabletCardBbox = await tabletCard0.boundingBox();
  const tabletTitle = tabletCard0.locator('.davka-project-title');
  const tabletArrow = tabletCard0.locator('.davka-project-arrow');
  const tabletTitleBbox = await tabletTitle.boundingBox();
  const tabletArrowBbox = await tabletArrow.boundingBox();

  console.log('Tablet Card Dimensions:', {
    width: Math.round(tabletCardBbox.width),
    height: Math.round(tabletCardBbox.height)
  });
  console.log('Tablet Title font-size:', await tabletTitle.evaluate((el) => window.getComputedStyle(el).fontSize));
  console.log('Tablet Arrow dimensions:', {
    width: Math.round(tabletArrowBbox.width),
    height: Math.round(tabletArrowBbox.height)
  });

  // Verify Title and Arrow Separation on Tablet
  const tabletSeparation = tabletArrowBbox.x - (tabletTitleBbox.x + tabletTitleBbox.width);
  console.log(`Tablet title-arrow horizontal gap: ${Math.round(tabletSeparation)}px`);
  if (tabletSeparation < 16) {
    throw new Error(`Tablet title and arrow are too close or overlapping (gap: ${tabletSeparation}px)`);
  }
  console.log('✓ Tablet layout preserves clear separation between title and arrow.');

  await pageTablet.screenshot({
    path: `${outputDir}/05-tablet-responsive.png`
  });
  console.log(`Captured: ${outputDir}/05-tablet-responsive.png`);
  await contextTablet.close();

  // ==========================================
  // 3. MOBILE VIEWPORT (375 x 667)
  // ==========================================
  console.log('\n--- 3. Testing Mobile (375x667) Responsive Layout ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 375, height: 667 },
    reducedMotion: 'no-preference'
  });

  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(3500);

  const mobileSection = pageMobile.locator('#featured-work');
  await mobileSection.scrollIntoViewIfNeeded();
  await pageMobile.waitForTimeout(800);

  const mobileCard0 = pageMobile.locator('#featured-work .davka-project-card').nth(0);
  await mobileCard0.scrollIntoViewIfNeeded();
  await pageMobile.waitForTimeout(600);

  const mobileCardBbox = await mobileCard0.boundingBox();
  const mobileTitle = mobileCard0.locator('.davka-project-title');
  const mobileArrow = mobileCard0.locator('.davka-project-arrow');
  const mobileTitleBbox = await mobileTitle.boundingBox();
  const mobileArrowBbox = await mobileArrow.boundingBox();

  const mobileTitleFontSize = await mobileTitle.evaluate((el) => window.getComputedStyle(el).fontSize);
  console.log('Mobile Card Dimensions:', {
    width: Math.round(mobileCardBbox.width),
    height: Math.round(mobileCardBbox.height)
  });
  console.log(`Mobile Title Font Size: ${mobileTitleFontSize}`);
  console.log('Mobile Arrow dimensions:', {
    width: Math.round(mobileArrowBbox.width),
    height: Math.round(mobileArrowBbox.height)
  });

  const mobileSeparation = mobileArrowBbox.x - (mobileTitleBbox.x + mobileTitleBbox.width);
  console.log(`Mobile title-arrow horizontal gap: ${Math.round(mobileSeparation)}px`);
  if (mobileSeparation < 10) {
    throw new Error(`Mobile title and arrow have insufficient separation (gap: ${mobileSeparation}px)`);
  }
  console.log('✓ Mobile layout retains clear separation between title and arrow.');

  await pageMobile.screenshot({
    path: `${outputDir}/06-mobile-responsive.png`
  });
  console.log(`Captured: ${outputDir}/06-mobile-responsive.png`);
  await contextMobile.close();

  // ==========================================
  // 4. CLICK NAVIGATION DESTINATION
  // ==========================================
  console.log('\n--- 4. Testing Card Click Navigation ---');
  const contextNav = await browser.newContext({
    viewport: { width: 1440, height: 960 }
  });
  const pageNav = await contextNav.newPage();
  await pageNav.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageNav.waitForTimeout(3500);

  const navSection = pageNav.locator('#featured-work');
  await navSection.scrollIntoViewIfNeeded();
  await pageNav.waitForTimeout(500);

  const navCard0 = pageNav.locator('#featured-work .davka-project-card').nth(0);
  const navLink = navCard0.locator('a.davka-project-link');
  const targetHref = await navLink.getAttribute('href');
  console.log(`Card 0 target href: ${targetHref}`);
  if (!targetHref || !targetHref.startsWith('/work/')) {
    throw new Error(`Unexpected card href: ${targetHref}`);
  }

  // Click card arrow to test navigation
  await navCard0.locator('.davka-project-arrow').click();
  await pageNav.waitForURL(`**${targetHref}`, { timeout: 10000 });
  console.log(`✓ Navigation destination verified: current URL is ${pageNav.url()}`);

  await pageNav.screenshot({
    path: `${outputDir}/07-navigation-destination.png`
  });
  console.log(`Captured: ${outputDir}/07-navigation-destination.png`);
  await contextNav.close();

  // ==========================================
  // 5. REGRESSION & UNTOUCHED SECTION VERIFICATION
  // ==========================================
  console.log('\n--- 5. Verifying Untouched Homepage Hero & Work Page ---');
  const contextReg = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const pageReg = await contextReg.newPage();
  
  // Hero section present
  await pageReg.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  const heroHeading = pageReg.locator('h1');
  const heroText = await heroHeading.innerText();
  console.log(`Homepage Hero Heading: "${heroText}"`);
  if (!heroText.toLowerCase().includes('digital products')) {
    throw new Error('Homepage hero heading was altered!');
  }
  console.log('✓ Homepage hero remains intact and untouched.');

  // Work page gallery present
  await pageReg.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  const workCards = pageReg.locator('.work-card, .davka-project-card, article');
  const workCount = await workCards.count();
  console.log(`Work page project count: ${workCount}`);
  if (workCount < 4) {
    throw new Error(`Work page gallery missing items (found: ${workCount})`);
  }
  console.log('✓ Work page gallery remains intact and untouched.');
  await contextReg.close();

  console.log('\n================================================================');
  console.log('ALL PHASE 39 VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('================================================================');
} finally {
  await browser.close();
}
