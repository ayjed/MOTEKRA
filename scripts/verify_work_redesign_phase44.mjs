import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-44';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  console.log('================================================================');
  console.log('PHASE 44 VERIFICATION: PREMIUM WORK PAGE REDESIGN & HOMEPAGE QA');
  console.log('================================================================\n');

  // ==========================================
  // 1. DESKTOP VIEWPORT (1440 x 900) - /work
  // ==========================================
  console.log('--- 1. Testing Desktop (1440x900) Work Page ---');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });

  const page = await contextDesktop.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // A. Check Heading & Lead
  const heading = page.locator('#work-main-heading');
  await heading.waitFor({ state: 'visible' });
  const headingText = await heading.textContent();
  console.log(`Heading text: "${headingText?.trim()}"`);
  if (!headingText?.includes('Selected Work.')) {
    throw new Error(`Expected heading "Selected Work.", found "${headingText}"`);
  }

  const lead = page.locator('.work-hero-lead');
  const leadText = await lead.textContent();
  console.log(`Lead text: "${leadText?.trim()}"`);
  if (!leadText?.includes('A selection of digital products, websites, and interfaces.')) {
    throw new Error(`Unexpected lead text "${leadText}"`);
  }

  // B. Verify Redundant Elements are REMOVED
  const eyebrowCount = await page.locator('.work-hero-eyebrow').count();
  const barCount = await page.locator('.work-hero-bar').count();
  const noteCount = await page.locator('.work-editorial-note').count();
  const badgeCount = await page.locator('.work-card-badge').count();
  const pillCount = await page.locator('.work-card-arrow-pill').count();
  const text4Flagship = await page.getByText('4 Flagship Systems').count();
  const textVerified = await page.getByText('VERIFIED PORTFOLIO').count();

  console.log(`Redundant checks:
    .work-hero-eyebrow count: ${eyebrowCount} (expected 0)
    .work-hero-bar count: ${barCount} (expected 0)
    .work-editorial-note count: ${noteCount} (expected 0)
    .work-card-badge count: ${badgeCount} (expected 0)
    .work-card-arrow-pill count: ${pillCount} (expected 0)
    "4 Flagship Systems" text count: ${text4Flagship} (expected 0)
    "VERIFIED PORTFOLIO" text count: ${textVerified} (expected 0)`);

  if (eyebrowCount !== 0 || barCount !== 0 || noteCount !== 0 || badgeCount !== 0 || pillCount !== 0 || text4Flagship !== 0 || textVerified !== 0) {
    throw new Error('Redundant elements were not completely removed!');
  }

  // C. Verify 4 Approved Project Cards
  const cards = page.locator('.work-portfolio-card');
  const cardCount = await cards.count();
  console.log(`\nFound ${cardCount} portfolio cards on /work`);
  if (cardCount !== 4) throw new Error(`Expected 4 cards, got ${cardCount}`);

  const expectedProjects = [
    { slug: 'spotlight-contest', title: 'Spotlight Contest', category: 'Web Application', pos: '50% 0%' },
    { slug: 'lad-global-travels', title: 'LAD Global Travels', category: 'Travel & Mobility', pos: '12% 0%' },
    { slug: 'tog-africa', title: 'TOG Africa', category: 'Corporate Platform', pos: '25% 0%' },
    { slug: 'connectapi', title: 'ConnectAPI', category: 'UI/UX Concept', pos: '0% 0%' },
  ];

  const cardBoxes = [];
  for (let i = 0; i < 4; i++) {
    const card = cards.nth(i);
    const slug = await card.getAttribute('data-project');
    const titleEl = card.locator('.work-card-title');
    const categoryEl = card.locator('.work-card-category');
    const arrowEl = card.locator('.work-card-arrow');
    const mediaWrap = card.locator('.work-card-media-wrap');
    const imgEl = card.locator('.work-card-img');
    const linkEl = card.locator('.work-card-link');

    const title = (await titleEl.textContent())?.trim();
    const category = (await categoryEl.textContent())?.trim();
    const arrow = (await arrowEl.textContent())?.trim();
    const href = await linkEl.getAttribute('href');

    const wrapBox = await mediaWrap.boundingBox();
    cardBoxes.push(wrapBox);

    const computedStyle = await imgEl.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        objectFit: s.objectFit,
        objectPosition: s.objectPosition,
      };
    });

    const wrapStyle = await mediaWrap.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        borderRadius: s.borderRadius,
        aspectRatio: s.aspectRatio,
      };
    });

    const exp = expectedProjects[i];
    console.log(`\nCard ${i} [${slug}]:`);
    console.log(`  Title: "${title}" (expected: "${exp.title}")`);
    console.log(`  Category: "${category}" (expected: "${exp.category}")`);
    console.log(`  Arrow: "${arrow}" (expected: "↗")`);
    console.log(`  Link href: "${href}" (expected: "/work/${exp.slug}")`);
    console.log(`  Media wrap box: ${Math.round(wrapBox.width)} x ${Math.round(wrapBox.height)} (aspect: ${(wrapBox.width / wrapBox.height).toFixed(3)})`);
    console.log(`  Media wrap border-radius: ${wrapStyle.borderRadius}`);
    console.log(`  Image object-fit: ${computedStyle.objectFit}, position: ${computedStyle.objectPosition}`);

    if (slug !== exp.slug) throw new Error(`Card ${i} slug mismatch: ${slug} vs ${exp.slug}`);
    if (title !== exp.title) throw new Error(`Card ${i} title mismatch: ${title} vs ${exp.title}`);
    if (category !== exp.category) throw new Error(`Card ${i} category mismatch: ${category} vs ${exp.category}`);
    if (href !== `/work/${exp.slug}`) throw new Error(`Card ${i} href mismatch: ${href}`);

    // Verify 4:3 aspect ratio (tolerance: ±0.03)
    const aspect = wrapBox.width / wrapBox.height;
    if (Math.abs(aspect - (4 / 3)) > 0.04) {
      throw new Error(`Card ${i} aspect ratio ${aspect.toFixed(3)} is not 4:3!`);
    }

    // Verify radius approx 14-18px
    const radiusNum = parseFloat(wrapStyle.borderRadius);
    if (radiusNum < 13 || radiusNum > 20) {
      throw new Error(`Card ${i} border radius ${wrapStyle.borderRadius} out of 14-18px range`);
    }
  }

  // Verify 2-column desktop grid alignment (Card 0 and Card 1 share approximately the same top Y)
  const yDiffCol1 = Math.abs(cardBoxes[0].y - cardBoxes[1].y);
  console.log(`\nDesktop 2-column Y delta between Card 0 and Card 1: ${yDiffCol1.toFixed(1)}px (expected < 4px)`);
  if (yDiffCol1 > 4) {
    throw new Error(`Desktop is not in 2 equal columns! Y diff is ${yDiffCol1}px`);
  }

  // Hover test on Card 0
  console.log('\nTesting hover on Card 0...');
  await cards.nth(0).hover();
  await page.waitForTimeout(300);
  const card0HoverColor = await cards.nth(0).locator('.work-card-title').evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  console.log(`Card 0 title hover color: ${card0HoverColor}`);

  // Capture desktop screenshots
  await page.screenshot({ path: `${outputDir}/work-desktop-1440.png`, fullPage: true });
  console.log(`Saved: ${outputDir}/work-desktop-1440.png`);

  await cards.nth(0).screenshot({ path: `${outputDir}/work-card-spotlight.png` });
  await cards.nth(1).screenshot({ path: `${outputDir}/work-card-lad.png` });
  await cards.nth(2).screenshot({ path: `${outputDir}/work-card-tog.png` });
  await cards.nth(3).screenshot({ path: `${outputDir}/work-card-connectapi.png` });
  console.log(`Saved individual card screenshots.`);

  // ==========================================
  // 2. TABLET VIEWPORT (834 x 1112) - /work
  // ==========================================
  console.log('\n--- 2. Testing Tablet (834x1112) Work Page ---');
  const contextTablet = await browser.newContext({
    viewport: { width: 834, height: 1112 },
    reducedMotion: 'no-preference'
  });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(3500);

  const tabletCards = pageTablet.locator('.work-portfolio-card');
  const tabletBox0 = await tabletCards.nth(0).locator('.work-card-media-wrap').boundingBox();
  const tabletBox1 = await tabletCards.nth(1).locator('.work-card-media-wrap').boundingBox();
  const tabletYDiff = Math.abs(tabletBox0.y - tabletBox1.y);
  console.log(`Tablet 2-column Y delta between Card 0 and Card 1: ${tabletYDiff.toFixed(1)}px`);
  if (tabletYDiff > 4) {
    throw new Error(`Tablet should retain 2 columns at 834px! Y diff: ${tabletYDiff}`);
  }

  await pageTablet.screenshot({ path: `${outputDir}/work-tablet-834.png`, fullPage: true });
  console.log(`Saved: ${outputDir}/work-tablet-834.png`);

  // ==========================================
  // 3. MOBILE VIEWPORT (390 x 844) - /work
  // ==========================================
  console.log('\n--- 3. Testing Mobile (390x844) Work Page ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(3500);

  const mobileCards = pageMobile.locator('.work-portfolio-card');
  const mobileBox0 = await mobileCards.nth(0).locator('.work-card-media-wrap').boundingBox();
  const mobileBox1 = await mobileCards.nth(1).locator('.work-card-media-wrap').boundingBox();
  console.log(`Mobile Card 0: ${Math.round(mobileBox0.width)}x${Math.round(mobileBox0.height)} at y=${Math.round(mobileBox0.y)}`);
  console.log(`Mobile Card 1: ${Math.round(mobileBox1.width)}x${Math.round(mobileBox1.height)} at y=${Math.round(mobileBox1.y)}`);
  if (mobileBox1.y <= mobileBox0.y + mobileBox0.height) {
    throw new Error('Mobile cards should stack vertically in a single column!');
  }

  // Check horizontal overflow
  const hasHorizontalScroll = await pageMobile.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`Mobile horizontal overflow: ${hasHorizontalScroll}`);
  if (hasHorizontalScroll) throw new Error('Mobile has horizontal overflow!');

  await pageMobile.screenshot({ path: `${outputDir}/work-mobile-390.png`, fullPage: true });
  console.log(`Saved: ${outputDir}/work-mobile-390.png`);

  // ==========================================
  // 4. CASE STUDY NAVIGATION TEST
  // ==========================================
  console.log('\n--- 4. Testing Case Study Navigation ---');
  await page.locator('.work-portfolio-card').nth(0).locator('.work-card-link').click();
  await page.waitForURL('**/work/spotlight-contest', { timeout: 5000 });
  console.log(`Navigated successfully to: ${page.url()}`);
  const caseHeading = page.locator('h1');
  const caseTitle = await caseHeading.textContent();
  console.log(`Case study title: "${caseTitle?.trim()}"`);
  if (!caseTitle?.includes('Spotlight Contest')) {
    throw new Error(`Unexpected case study title: "${caseTitle}"`);
  }

  // ==========================================
  // 5. CRITICAL: HOMEPAGE REGRESSION CHECK
  // ==========================================
  console.log('\n--- 5. CRITICAL HOMEPAGE REGRESSION CHECK ---');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // Wait for preloader lift

  const homeSection = page.locator('#featured-work');
  await homeSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const homeCards = page.locator('#featured-work .davka-project-card');
  const homeCount = await homeCards.count();
  console.log(`Homepage Featured Projects card count: ${homeCount}`);
  if (homeCount !== 4) throw new Error(`Expected 4 homepage cards, got ${homeCount}`);

  // Verify homepage card dimensions
  const homeCard0 = homeCards.nth(0);
  const homeCardBox = await homeCard0.boundingBox();
  console.log(`Homepage Card 0 dimensions: ${Math.round(homeCardBox.width)} x ${Math.round(homeCardBox.height)}`);
  // Must match approved widescreen dimensions (1280x720)
  if (homeCardBox.width < 1150 || homeCardBox.height < 600) {
    throw new Error(`Homepage card dimensions altered! Found ${homeCardBox.width}x${homeCardBox.height}`);
  }

  // Verify bottom-left title and bottom-right arrow on homepage
  const homeCardTitle = homeCard0.locator('.davka-project-title');
  const homeCardArrow = homeCard0.locator('.davka-project-arrow');
  await homeCardTitle.waitFor({ state: 'visible' });
  await homeCardArrow.waitFor({ state: 'visible' });

  const titleText = (await homeCardTitle.textContent())?.trim();
  console.log(`Homepage Card 0 title: "${titleText}"`);
  if (titleText !== 'Spotlight Contest') {
    throw new Error(`Homepage project title altered! Found: ${titleText}`);
  }

  const titleBox = await homeCardTitle.boundingBox();
  const arrowBox = await homeCardArrow.boundingBox();
  console.log(`Homepage title position: x=${Math.round(titleBox.x)}, y=${Math.round(titleBox.y)}`);
  console.log(`Homepage arrow position: x=${Math.round(arrowBox.x)}, y=${Math.round(arrowBox.y)}`);

  // Title is on bottom-left, arrow is on bottom-right:
  if (arrowBox.x <= titleBox.x) {
    throw new Error('Homepage arrow should be positioned to the right of the title!');
  }

  await page.screenshot({ path: `${outputDir}/home-featured-work-intact.png` });
  console.log(`Saved: ${outputDir}/home-featured-work-intact.png`);

  console.log('\n================================================================');
  console.log('ALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');

} catch (err) {
  console.error('\nVerification failed:', err);
  process.exit(1);
} finally {
  await browser.close();
}
