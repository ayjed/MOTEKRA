import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-31';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'no-preference'
  });

  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  console.log('--- 1. Testing Work Page Layout & Typography ---');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Check main title and lead
  const title = await page.locator('#work-main-heading').innerText();
  console.log(`Page title: "${title.trim()}"`);
  if (!title.includes('Selected Work.')) {
    throw new Error(`Expected title "Selected Work.", got "${title}"`);
  }

  const lead = await page.locator('.work-hero-lead').innerText();
  console.log(`Page lead: "${lead.trim()}"`);
  if (!lead.includes('A selection of digital products, websites, and interfaces.')) {
    throw new Error(`Expected lead "A selection of digital products, websites, and interfaces.", got "${lead}"`);
  }

  // --- 2. Portfolio Grid Layout Verification ---
  console.log('--- 2. Verifying 2-Column Editorial Grid on Desktop ---');
  const cards = page.locator('.work-portfolio-grid [data-work-card]');
  const count = await cards.count();
  console.log(`Found ${count} portfolio cards (expected 4)`);
  if (count !== 4) throw new Error(`Expected 4 portfolio cards, found ${count}`);

  const cardBboxes = [];
  for (let i = 0; i < count; i++) {
    const bbox = await cards.nth(i).boundingBox();
    const cardTitle = await cards.nth(i).locator('.work-card-title').innerText();
    const category = await cards.nth(i).locator('.work-card-category').innerText();
    const linkHref = await cards.nth(i).locator('a.work-card-link').getAttribute('href');
    const mediaBbox = await cards.nth(i).locator('.work-card-media-wrap').boundingBox();

    cardBboxes.push({ index: i, title: cardTitle, category, href: linkHref, bbox, mediaBbox });
    console.log(`Card ${i}: "${cardTitle}" (${category}) -> ${linkHref}`, {
      width: Math.round(mediaBbox.width),
      height: Math.round(mediaBbox.height),
      aspectRatio: (mediaBbox.width / mediaBbox.height).toFixed(3)
    });
  }

  // Verify 2 columns on desktop (card 0 and card 1 have near-identical Y, different X)
  const yDiffCol1 = Math.abs(cardBboxes[0].bbox.y - cardBboxes[1].bbox.y);
  console.log(`Vertical difference between Card 0 and Card 1: ${yDiffCol1}px (expected ~0 for 2-column grid)`);
  if (yDiffCol1 > 10) {
    throw new Error(`Expected cards 0 and 1 to be in the same row (2-column grid), but vertical diff is ${yDiffCol1}px`);
  }
  if (cardBboxes[1].bbox.x <= cardBboxes[0].bbox.x) {
    throw new Error(`Expected Card 1 to be to the right of Card 0`);
  }

  // Verify 4:3 aspect ratio (4/3 = 1.333, allow minor rounding 1.32 - 1.35)
  for (const c of cardBboxes) {
    const ratio = c.mediaBbox.width / c.mediaBbox.height;
    if (ratio < 1.30 || ratio > 1.36) {
      throw new Error(`Card ${c.index} aspect ratio is ${ratio.toFixed(3)}, expected 4:3 (~1.333)`);
    }
  }

  // Take initial full-page screenshot
  await page.screenshot({ path: `${outputDir}/01-work-desktop-grid.png`, fullPage: false });

  // --- 3. Hover Interaction Verification ---
  console.log('--- 3. Testing Card Hover Microinteractions ---');
  const firstCard = cards.first();
  await firstCard.locator('.work-card-media-wrap').hover();
  await page.waitForTimeout(400);

  const hoverState = await page.evaluate(() => {
    const card = document.querySelector('.work-portfolio-grid [data-work-card]');
    const badge = card?.querySelector('.work-card-badge');
    const title = card?.querySelector('.work-card-title');
    const img = card?.querySelector('.work-card-img');

    const badgeStyle = badge ? window.getComputedStyle(badge) : null;
    const titleStyle = title ? window.getComputedStyle(title) : null;
    const imgStyle = img ? window.getComputedStyle(img) : null;

    return {
      badgeOpacity: badgeStyle?.opacity,
      badgeBg: badgeStyle?.backgroundColor,
      titleColor: titleStyle?.color,
      imgTransform: imgStyle?.transform
    };
  });
  console.log('Hover state on first card:', hoverState);
  await page.screenshot({ path: `${outputDir}/02-work-card-hover.png` });

  // --- 4. Navigation & Case Study Routing ---
  console.log('--- 4. Testing Navigation to Case Study & Back ---');
  await firstCard.locator('a.work-card-link').click();
  await page.waitForURL('**/work/spotlight-contest');
  await page.waitForTimeout(1000);

  const caseTitle = await page.locator('h1').innerText();
  console.log(`Navigated to case study. Heading: "${caseTitle.trim()}"`);
  if (!caseTitle.includes('Spotlight Contest')) {
    throw new Error(`Expected case study title to include "Spotlight Contest", got "${caseTitle}"`);
  }
  await page.screenshot({ path: `${outputDir}/03-case-study-spotlight.png` });

  // Test back navigation
  await page.goBack();
  await page.waitForURL('**/work');
  await page.waitForTimeout(1000);
  const backTitle = await page.locator('#work-main-heading').innerText();
  console.log(`Navigated back to work page. Heading: "${backTitle.trim()}"`);
  if (!backTitle.includes('Selected Work.')) {
    throw new Error(`Expected to return to "Selected Work.", got "${backTitle}"`);
  }

  // --- 5. Homepage Isolation Check ---
  console.log('--- 5. Verifying Homepage Featured Work Remains Untouched ---');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const homeWorkSection = page.locator('#featured-work');
  await homeWorkSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const homeCards = page.locator('#featured-work .davka-project-card');
  const homeCardCount = await homeCards.count();
  console.log(`Homepage Featured Work card count: ${homeCardCount} (expected 4)`);
  if (homeCardCount !== 4) throw new Error(`Expected 4 cards on homepage, found ${homeCardCount}`);

  // Check 1:1 square ratio on homepage
  const homeCardBbox = await homeCards.first().boundingBox();
  console.log('Homepage first card dimensions:', {
    width: Math.round(homeCardBbox.width),
    height: Math.round(homeCardBbox.height),
    ratio: (homeCardBbox.width / homeCardBbox.height).toFixed(3)
  });
  const homeRatio = homeCardBbox.width / homeCardBbox.height;
  if (Math.abs(homeRatio - 1.0) > 0.05) {
    throw new Error(`Homepage card ratio is ${homeRatio.toFixed(3)}, expected 1:1 square`);
  }
  await page.screenshot({ path: `${outputDir}/04-homepage-featured-work.png` });

  // --- 6. Mobile Viewport Verification ---
  console.log('--- 6. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  // Verify single column on mobile
  const mobileCards = mobilePage.locator('.work-portfolio-grid [data-work-card]');
  const mCard0Bbox = await mobileCards.nth(0).boundingBox();
  const mCard1Bbox = await mobileCards.nth(1).boundingBox();
  console.log('Mobile Card 0 Y:', mCard0Bbox.y, 'Mobile Card 1 Y:', mCard1Bbox.y);
  if (mCard1Bbox.y <= mCard0Bbox.y + mCard0Bbox.height - 10) {
    throw new Error('Mobile cards are not stacked vertically in a single column');
  }

  // Check zero horizontal overflow
  const hasOverflow = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log('Mobile horizontal overflow:', hasOverflow);
  if (hasOverflow) throw new Error('Mobile viewport has horizontal overflow');

  await mobilePage.screenshot({ path: `${outputDir}/05-work-mobile.png`, fullPage: false });
  await mobileContext.close();

  console.log('--- All Davka Work Page verifications PASSED successfully! ---');
  if (errors.length > 0) {
    console.warn('Page errors detected:', errors);
  }
} finally {
  await browser.close();
}
