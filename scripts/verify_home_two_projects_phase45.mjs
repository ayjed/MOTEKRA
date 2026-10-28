import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-45';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  console.log('================================================================');
  console.log('PHASE 45 VERIFICATION: HOMEPAGE TWO PROJECTS & WORK PAGE PROTECTION');
  console.log('================================================================\n');

  // ==========================================
  // 1. DESKTOP HOMEPAGE (1440 x 900)
  // ==========================================
  console.log('--- 1. Testing Homepage Featured Projects (Desktop 1440x900) ---');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });
  const page = await contextDesktop.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500); // Preloader lift

  // Scroll to featured work section
  const section = page.locator('#featured-work');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const homeCards = page.locator('#featured-work .davka-project-card');
  const cardCount = await homeCards.count();
  console.log(`Homepage Featured Projects count: ${cardCount} (expected: 2)`);
  if (cardCount !== 2) {
    throw new Error(`Expected exactly 2 cards on homepage, found ${cardCount}`);
  }

  // Verify Card 0 is TOG Africa
  const card0Title = (await homeCards.nth(0).locator('.davka-project-title').textContent())?.trim();
  const card0Href = await homeCards.nth(0).locator('.davka-project-link').getAttribute('href');
  console.log(`Card 0: "${card0Title}" with href="${card0Href}"`);
  if (card0Title !== 'TOG Africa' || card0Href !== '/work/tog-africa') {
    throw new Error(`Card 0 must be TOG Africa! Found "${card0Title}", href="${card0Href}"`);
  }

  // Verify Card 1 is ConnectAPI
  const card1Title = (await homeCards.nth(1).locator('.davka-project-title').textContent())?.trim();
  const card1Href = await homeCards.nth(1).locator('.davka-project-link').getAttribute('href');
  console.log(`Card 1: "${card1Title}" with href="${card1Href}"`);
  if (card1Title !== 'ConnectAPI' || card1Href !== '/work/connectapi') {
    throw new Error(`Card 1 must be ConnectAPI! Found "${card1Title}", href="${card1Href}"`);
  }

  // Verify Spotlight Contest and LAD Global Travels are ABSENT from homepage
  const spotlightCount = await page.locator('#featured-work').getByText('Spotlight Contest').count();
  const ladCount = await page.locator('#featured-work').getByText('LAD Global Travels').count();
  console.log(`Spotlight Contest in #featured-work: ${spotlightCount} (expected: 0)`);
  console.log(`LAD Global Travels in #featured-work: ${ladCount} (expected: 0)`);
  if (spotlightCount !== 0 || ladCount !== 0) {
    throw new Error('Removed projects are still present in #featured-work!');
  }

  // Check Card Dimensions (1280x720)
  const card0Box = await homeCards.nth(0).boundingBox();
  console.log(`Card 0 dimensions: ${Math.round(card0Box.width)} x ${Math.round(card0Box.height)}`);
  if (card0Box.width < 1150 || card0Box.height < 600) {
    throw new Error(`Homepage card dimensions altered! Found ${card0Box.width}x${card0Box.height}`);
  }

  // Check Bottom-Left Title & Bottom-Right Arrow positions on Card 0
  const title0Box = await homeCards.nth(0).locator('.davka-project-title').boundingBox();
  const arrow0Box = await homeCards.nth(0).locator('.davka-project-arrow').boundingBox();
  console.log(`Card 0 Title pos: x=${Math.round(title0Box.x)}, y=${Math.round(title0Box.y)}`);
  console.log(`Card 0 Arrow pos: x=${Math.round(arrow0Box.x)}, y=${Math.round(arrow0Box.y)}`);
  if (arrow0Box.x <= title0Box.x) {
    throw new Error('Card 0 arrow should be positioned to the right of the title!');
  }

  // Capture Card 0 screenshot
  await page.screenshot({ path: `${outputDir}/home-card0-tog-africa.png` });
  console.log(`Saved: ${outputDir}/home-card0-tog-africa.png`);

  // Test Scroll Transition: Scroll down to bring Card 1 (ConnectAPI) into active view
  console.log('\nTesting scroll transition to ConnectAPI...');
  await homeCards.nth(1).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const card0Opacity = await homeCards.nth(0).evaluate((el) => {
    return window.getComputedStyle(el).opacity;
  });
  console.log(`Card 0 opacity after scrolling to Card 1: ${card0Opacity}`);

  // Capture Card 1 screenshot
  await page.screenshot({ path: `${outputDir}/home-card1-connectapi.png` });
  console.log(`Saved: ${outputDir}/home-card1-connectapi.png`);

  // Check natural transition to Services section (#home-services)
  const servicesSection = page.locator('#home-services');
  await servicesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const servicesHeading = page.locator('#services-title');
  await servicesHeading.waitFor({ state: 'visible' });
  console.log('Services section appeared naturally after Card 1.');
  await page.screenshot({ path: `${outputDir}/home-services-transition.png` });
  console.log(`Saved: ${outputDir}/home-services-transition.png`);

  // ==========================================
  // 2. CRITICAL: WORK PAGE INTEGRITY CHECK
  // ==========================================
  console.log('\n--- 2. CRITICAL WORK PAGE INTEGRITY CHECK (/work) ---');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const workCards = page.locator('.work-portfolio-card');
  const workCardCount = await workCards.count();
  console.log(`Work page portfolio cards count: ${workCardCount} (MUST BE 4)`);
  if (workCardCount !== 4) {
    throw new Error(`Work page must show all 4 projects! Found ${workCardCount}`);
  }

  const expectedWorkProjects = [
    { slug: 'spotlight-contest', title: 'Spotlight Contest' },
    { slug: 'lad-global-travels', title: 'LAD Global Travels' },
    { slug: 'tog-africa', title: 'TOG Africa' },
    { slug: 'connectapi', title: 'ConnectAPI' }
  ];

  for (let i = 0; i < 4; i++) {
    const card = workCards.nth(i);
    const slug = await card.getAttribute('data-project');
    const title = (await card.locator('.work-card-title').textContent())?.trim();
    const href = await card.locator('.work-card-link').getAttribute('href');
    console.log(`  Work Card ${i}: [${slug}] "${title}" -> ${href}`);
    if (slug !== expectedWorkProjects[i].slug || title !== expectedWorkProjects[i].title) {
      throw new Error(`Work page project ${i} mismatch!`);
    }
  }

  await page.screenshot({ path: `${outputDir}/work-page-all-four-intact.png`, fullPage: true });
  console.log(`Saved: ${outputDir}/work-page-all-four-intact.png`);

  // ==========================================
  // 3. CASE STUDY ROUTES ACCESSIBILITY
  // ==========================================
  console.log('\n--- 3. Verifying All Case Study Routes (HTTP 200) ---');
  for (const exp of expectedWorkProjects) {
    const res = await page.goto(`http://127.0.0.1:3000/work/${exp.slug}`, { waitUntil: 'networkidle' });
    const status = res.status();
    const h1Text = (await page.locator('h1').textContent())?.trim();
    console.log(`  Route /work/${exp.slug}: status=${status}, h1="${h1Text}"`);
    if (status !== 200 || !h1Text?.includes(exp.title)) {
      throw new Error(`Failed to load case study /work/${exp.slug}`);
    }
  }

  // ==========================================
  // 4. TABLET VIEWPORT (834 x 1112) - Homepage
  // ==========================================
  console.log('\n--- 4. Testing Tablet Homepage (834x1112) ---');
  const contextTablet = await browser.newContext({
    viewport: { width: 834, height: 1112 },
    reducedMotion: 'no-preference'
  });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(3500);

  const tabletCards = pageTablet.locator('#featured-work .davka-project-card');
  const tabletCount = await tabletCards.count();
  console.log(`Tablet Homepage featured cards count: ${tabletCount}`);
  if (tabletCount !== 2) throw new Error(`Expected 2 tablet cards, found ${tabletCount}`);

  await pageTablet.locator('#featured-work').scrollIntoViewIfNeeded();
  await pageTablet.waitForTimeout(1000);
  await pageTablet.screenshot({ path: `${outputDir}/home-tablet-834.png` });
  console.log(`Saved: ${outputDir}/home-tablet-834.png`);

  // ==========================================
  // 5. MOBILE VIEWPORT (390 x 844) - Homepage
  // ==========================================
  console.log('\n--- 5. Testing Mobile Homepage (390x844) ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(3500);

  const mobileCards = pageMobile.locator('#featured-work .davka-project-card');
  const mobileCount = await mobileCards.count();
  console.log(`Mobile Homepage featured cards count: ${mobileCount}`);
  if (mobileCount !== 2) throw new Error(`Expected 2 mobile cards, found ${mobileCount}`);

  // Check horizontal overflow
  const hasHorizontalScroll = await pageMobile.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`Mobile horizontal overflow: ${hasHorizontalScroll}`);
  if (hasHorizontalScroll) throw new Error('Mobile homepage has horizontal overflow!');

  await pageMobile.locator('#featured-work').scrollIntoViewIfNeeded();
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: `${outputDir}/home-mobile-390.png` });
  console.log(`Saved: ${outputDir}/home-mobile-390.png`);

  console.log('\n================================================================');
  console.log('ALL PHASE 45 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');

} catch (err) {
  console.error('\nVerification failed:', err);
  process.exit(1);
} finally {
  await browser.close();
}

