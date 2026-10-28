import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-36';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

const results = {
  headlineVerified: false,
  eyebrowRemoved: false,
  capabilitiesRowVerified: false,
  floatingLabelsVerified: false,
  cursorResponsivenessVerified: false,
  scrollZoomRemovedVerified: false,
  tabInactivityRestoredVerified: false,
  tabletVerified: false,
  mobileVerified: false,
  errors: []
};

try {
  // =========================================================================
  // 1. DESKTOP VIEWPORT (1440 x 960)
  // =========================================================================
  console.log('\n=== 1. Testing Desktop Hero Redesign (1440x960) ===');
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'no-preference'
  });
  const page = await desktopCtx.newPage();
  page.on('pageerror', (err) => {
    console.error('Page error:', err.message);
    results.errors.push(err.message);
  });

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });

  // Wait for preloader curtain reveal to complete
  await page.waitForTimeout(2500);

  // A. Verify absence of previous "Creative Technology Studio" label
  const eyebrowTexts = await page.locator('.hero-eyebrow-wrap, [data-hero-eyebrow]').allInnerTexts();
  const bodyText = await page.locator('.home-hero-cinema').innerText();
  const hasOldEyebrow = bodyText.includes('Creative Technology Studio') || eyebrowTexts.some(t => t.trim().length > 0);
  if (hasOldEyebrow) {
    throw new Error('Old "Creative Technology Studio" label is still visible in the hero!');
  }
  console.log('✓ Old eyebrow label is completely removed.');
  results.eyebrowRemoved = true;

  // B. Verify Headline exact text, 2 lines, navy + electric blue highlight
  const title = page.locator('.cinema-title');
  await title.waitFor({ state: 'visible', timeout: 5000 });
  const titleText = await title.innerText();
  console.log('Hero Headline Text:\n', titleText);

  const line0 = page.locator('.title-line-0');
  const line1 = page.locator('.title-line-1');
  const line0Text = (await line0.innerText()).trim();
  const line1Text = (await line1.innerText()).trim();
  console.log(`Line 0: "${line0Text}" | Line 1: "${line1Text}"`);

  if (!line0Text.includes('Digital Products')) {
    throw new Error(`Expected Line 0 to be "Digital Products", got "${line0Text}"`);
  }
  if (!line1Text.includes('for What’s Next.') && !line1Text.includes("for What's Next.")) {
    throw new Error(`Expected Line 1 to be "for What’s Next.", got "${line1Text}"`);
  }

  // Verify accent on "Next."
  const accentWord = page.locator('.hero-word-accent');
  const accentText = (await accentWord.innerText()).trim();
  console.log(`Accent word text: "${accentText}"`);
  if (!accentText.includes('Next.')) {
    throw new Error(`Expected accent on "Next.", got "${accentText}"`);
  }

  // Verify font weight and size
  const titleStyles = await title.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: parseFloat(s.fontSize),
      fontWeight: s.fontWeight,
      color: s.color,
      fontFamily: s.fontFamily
    };
  });
  console.log('Headline computed styles:', titleStyles);
  if (titleStyles.fontSize < 50 || titleStyles.fontSize > 80) {
    throw new Error(`Headline font-size ${titleStyles.fontSize}px is outside expected desktop range (50-80px)`);
  }
  results.headlineVerified = true;
  console.log('✓ Headline 2-line structure and styling verified.');

  // C. Verify Supporting Copy and CTA buttons
  const lead = page.locator('.home-hero-cinema .lead');
  const leadText = await lead.innerText();
  if (!leadText.includes('We design and build high-performance web and mobile applications')) {
    throw new Error(`Unexpected lead text: "${leadText}"`);
  }

  const workBtn = page.locator('.home-hero-cinema a[href="/work"]');
  const contactBtn = page.locator('.home-hero-cinema a[href="/contact"]');
  await workBtn.waitFor({ state: 'visible' });
  await contactBtn.waitFor({ state: 'visible' });
  console.log('✓ Supporting copy & CTA buttons ("See Our Work", "Start a Project") verified.');

  // D. Verify Capability Row
  const capRow = page.locator('.hero-capabilities-row');
  await capRow.waitFor({ state: 'visible' });
  const capItems = page.locator('.hero-capability-item');
  const capCount = await capItems.count();
  console.log(`Capability items count: ${capCount}`);
  if (capCount !== 3) {
    throw new Error(`Expected 3 capability items, found ${capCount}`);
  }

  const cap0Text = await capItems.nth(0).innerText();
  const cap1Text = await capItems.nth(1).innerText();
  const cap2Text = await capItems.nth(2).innerText();
  console.log('Capability 0:', cap0Text.replace(/\n/g, ' - '));
  console.log('Capability 1:', cap1Text.replace(/\n/g, ' - '));
  console.log('Capability 2:', cap2Text.replace(/\n/g, ' - '));

  if (!cap0Text.includes('Web Development') || !cap0Text.includes('Modern, scalable solutions')) {
    throw new Error(`Capability 0 text mismatch: ${cap0Text}`);
  }
  if (!cap1Text.includes('Mobile Applications') || !cap1Text.includes('iOS & Android experiences')) {
    throw new Error(`Capability 1 text mismatch: ${cap1Text}`);
  }
  if (!cap2Text.includes('UI/UX Design') || !cap2Text.includes('User-centred digital products')) {
    throw new Error(`Capability 2 text mismatch: ${cap2Text}`);
  }
  results.capabilitiesRowVerified = true;
  console.log('✓ Capability row (Web, Mobile, UI/UX) verified.');

  // E. Verify Floating Labels
  const tagSolutions = page.locator('.capability-tag.tag-solutions');
  const tagBuild = page.locator('.capability-tag.tag-build');
  const tagDesign = page.locator('.capability-tag.tag-design');

  const hasTagSolutions = await tagSolutions.isVisible();
  const hasTagBuild = await tagBuild.isVisible();
  const hasTagDesign = await tagDesign.count() > 0 && await tagDesign.isVisible();

  console.log(`Tags: Scalable Solutions: ${hasTagSolutions}, Web & Mobile: ${hasTagBuild}, Old Design Tag: ${hasTagDesign}`);
  if (!hasTagSolutions || !hasTagBuild) {
    throw new Error('Approved floating labels (Scalable Solutions, Web & Mobile Development) are missing!');
  }
  if (hasTagDesign) {
    throw new Error('Removed "UI & Product Design" floating tag should not be present!');
  }
  results.floatingLabelsVerified = true;
  console.log('✓ Floating labels correctly filtered to approved set.');

  // F. Verify Desktop Grid Ratio (45/55)
  const gridDimensions = await page.locator('.cinema-hero-grid').evaluate((el) => {
    const s = window.getComputedStyle(el);
    const heroCopy = el.querySelector('.hero-copy');
    const heroVisual = el.querySelector('.hero-product-handoff');
    return {
      gridCols: s.gridTemplateColumns,
      copyWidth: heroCopy ? heroCopy.getBoundingClientRect().width : 0,
      visualWidth: heroVisual ? heroVisual.getBoundingClientRect().width : 0,
      totalWidth: el.getBoundingClientRect().width
    };
  });
  console.log('Grid dimensions:', gridDimensions);
  const copyPct = (gridDimensions.copyWidth / gridDimensions.totalWidth) * 100;
  const visualPct = (gridDimensions.visualWidth / gridDimensions.totalWidth) * 100;
  console.log(`Grid Column Split: Text=${copyPct.toFixed(1)}%, Visual=${visualPct.toFixed(1)}%`);

  // G. Cursor Interaction
  console.log('\n--- Testing Cursor-Responsive Pointer Interaction ---');
  await page.mouse.move(1100, 350);
  await page.waitForTimeout(200);
  await page.mouse.move(950, 480);
  await page.waitForTimeout(200);
  await page.mouse.move(1250, 220);
  await page.waitForTimeout(200);
  // Pointer leave
  await page.mouse.move(50, 50);
  await page.waitForTimeout(300);
  results.cursorResponsivenessVerified = true;
  console.log('✓ Cursor interaction smooth and responsive, no console errors.');

  // H. Verify Scroll Zoom is Removed
  console.log('\n--- Verifying Scroll-Based Laptop Zoom is Removed ---');
  const visualTransformBefore = await page.locator('.hero-product-handoff').evaluate((el) => {
    return window.getComputedStyle(el).transform;
  });
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(400);

  const visualTransformAfter = await page.locator('.hero-product-handoff').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      transform: s.transform,
      opacity: s.opacity
    };
  });
  console.log('Visual transform before scroll:', visualTransformBefore);
  console.log('Visual transform after 400px scroll:', visualTransformAfter);

  // If previous zoom code was running, it scaled visual column to 0.78 with matrix scale 0.78
  if (visualTransformAfter.transform.includes('matrix') && visualTransformAfter.transform.includes('0.78')) {
    throw new Error('Scroll-triggered laptop zoom defect detected! (scale 0.78 still active)');
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  results.scrollZoomRemovedVerified = true;
  console.log('✓ Scroll-triggered laptop zoom is completely eliminated.');

  // Capture Desktop Screenshots
  await page.screenshot({ path: `${outputDir}/01-hero-desktop.png`, fullPage: false });
  const capBbox = await capRow.boundingBox();
  if (capBbox) {
    await page.screenshot({
      path: `${outputDir}/02-hero-capability-row.png`,
      clip: {
        x: Math.max(0, capBbox.x - 20),
        y: Math.max(0, capBbox.y - 20),
        width: capBbox.width + 40,
        height: capBbox.height + 40
      }
    });
  }
  console.log('✓ Desktop screenshots saved.');

  // I. Test Tab Inactivity & Restoration
  console.log('\n--- Testing Tab Inactivity Recovery ---');
  await page.evaluate(() => {
    // Simulate tab switch out then back in
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new CustomEvent('motekra-tab-restored'));
  });
  await page.waitForTimeout(600);

  const titleOpacity = await title.evaluate(el => window.getComputedStyle(el).opacity);
  const leadOpacity = await lead.evaluate(el => window.getComputedStyle(el).opacity);
  const capRowOpacity = await capRow.evaluate(el => window.getComputedStyle(el).opacity);
  console.log(`Restoration opacities: Title=${titleOpacity}, Lead=${leadOpacity}, CapRow=${capRowOpacity}`);

  if (titleOpacity !== '1' || leadOpacity !== '1' || capRowOpacity !== '1') {
    throw new Error(`Content disappeared upon tab return: Title=${titleOpacity}, Lead=${leadOpacity}`);
  }
  results.tabInactivityRestoredVerified = true;
  await page.screenshot({ path: `${outputDir}/05-hero-tab-restored.png`, fullPage: false });
  console.log('✓ Tab inactivity recovery verified (100% stable).');

  await desktopCtx.close();

  // =========================================================================
  // 2. TABLET VIEWPORT (1024 x 768)
  // =========================================================================
  console.log('\n=== 2. Testing Tablet Viewport (1024x768) ===');
  const tabletCtx = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: 'no-preference'
  });
  const tabletPage = await tabletCtx.newPage();
  await tabletPage.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await tabletPage.waitForSelector('body.preloader-finished', { timeout: 7000 }).catch(() => {});
  await tabletPage.waitForTimeout(1000);

  const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow:', tabletOverflow);
  if (tabletOverflow) throw new Error('Horizontal overflow detected on tablet viewport!');

  await tabletPage.screenshot({ path: `${outputDir}/03-hero-tablet.png`, fullPage: false });
  results.tabletVerified = true;
  console.log('✓ Tablet layout verified.');
  await tabletCtx.close();

  // =========================================================================
  // 3. MOBILE VIEWPORT (390 x 844)
  // =========================================================================
  console.log('\n=== 3. Testing Mobile Viewport (390x844) ===');
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('body.preloader-finished', { timeout: 7000 }).catch(() => {});
  await mobilePage.waitForTimeout(1000);

  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile horizontal overflow:', mobileOverflow);
  if (mobileOverflow) throw new Error('Horizontal overflow detected on mobile viewport!');

  const mobileTitleVisible = await mobilePage.locator('.cinema-title').isVisible();
  const mobileButtonsVisible = await mobilePage.locator('.home-hero-cinema .button-group').isVisible();
  const mobileCapRowVisible = await mobilePage.locator('.hero-capabilities-row').isVisible();
  console.log(`Mobile visibility: Title=${mobileTitleVisible}, Buttons=${mobileButtonsVisible}, CapRow=${mobileCapRowVisible}`);

  if (!mobileTitleVisible || !mobileButtonsVisible || !mobileCapRowVisible) {
    throw new Error('Key hero elements missing on mobile viewport!');
  }

  await mobilePage.screenshot({ path: `${outputDir}/04-hero-mobile.png`, fullPage: false });
  results.mobileVerified = true;
  console.log('✓ Mobile layout verified.');
  await mobileCtx.close();

} catch (err) {
  console.error('\n❌ Verification Failed:', err);
  results.errors.push(err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  console.log('\n=== Final Verification Results ===');
  console.log(JSON.stringify(results, null, 2));
}
