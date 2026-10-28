import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-30';
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

  console.log('--- 1. Testing Services Page Development Process ---');
  await page.goto('http://127.0.0.1:3000/services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const stageNames = ['Discover', 'Define', 'Design', 'Develop', 'Launch'];
  const timelineItems = page.locator('#process [data-process-step]');
  const count = await timelineItems.count();
  console.log(`Found ${count} timeline items (expected 5)`);
  if (count !== 5) throw new Error(`Expected 5 timeline items, found ${count}`);

  // Helper to get active stage index from DOM
  const getActiveStage = async () => {
    return await page.evaluate(() => {
      const narrative = document.querySelector('#process .process-narrative');
      const stageAttr = narrative?.getAttribute('data-stage');
      const activeItem = document.querySelector('#process .process-timeline-item.is-active');
      const allItems = Array.from(document.querySelectorAll('#process .process-timeline-item'));
      const activeItemIndex = activeItem ? allItems.indexOf(activeItem) : -1;

      const activePanes = Array.from(document.querySelectorAll('#process .process-pane.is-active')).map(p => {
        const match = p.className.match(/pane-(\d)/);
        return match ? parseInt(match[1], 10) : -1;
      });

      const line = document.querySelector('#process .process-energy-fill');
      const transform = line ? window.getComputedStyle(line).transform : 'none';

      return {
        stageAttr: stageAttr !== null ? parseInt(stageAttr, 10) : null,
        activeItemIndex,
        activePanes,
        lineTransform: transform,
        scrollY: window.scrollY
      };
    });
  };

  // Scroll to process section entry (scrollY = 1050)
  await page.evaluate(() => window.scrollTo(0, 1050));
  await page.waitForTimeout(400);

  // Initial State: Stage 0 (Discover)
  let state = await getActiveStage();
  console.log('Initial stage state at process entry:', state);
  if (state.activeItemIndex !== 0 || !state.activePanes.includes(0)) {
    throw new Error(`Initial state mismatch: expected stage 0, got item=${state.activeItemIndex}, panes=${state.activePanes}`);
  }
  await page.screenshot({ path: `${outputDir}/01-stage-0-discover.png` });

  // Scroll smoothly down through stages and verify lockstep synchronization
  console.log('--- 2. Scrolling Down Through All 5 Stages ---');
  const stageScreenshots = [
    '01-stage-0-discover.png',
    '02-stage-1-define.png',
    '03-stage-2-design.png',
    '04-stage-3-develop.png',
    '05-stage-4-launch.png'
  ];

  const observedStagesDown = new Set();
  const startY = 1100;
  const endY = 2150;
  const numSteps = 50;

  for (let s = 0; s <= numSteps; s++) {
    const targetY = startY + (s / numSteps) * (endY - startY);
    await page.evaluate((y) => window.scrollTo(0, y), targetY);
    await page.waitForTimeout(80);

    const cur = await getActiveStage();
    observedStagesDown.add(cur.activeItemIndex);

    // Verify timeline item and visual pane match perfectly
    if (cur.activeItemIndex !== -1) {
      if (!cur.activePanes.includes(cur.activeItemIndex)) {
        throw new Error(`Desynchronization detected at scroll Y=${targetY}! Active item: ${cur.activeItemIndex}, Active panes: ${cur.activePanes}`);
      }
      if (cur.stageAttr !== cur.activeItemIndex) {
        throw new Error(`data-stage attribute mismatch: stageAttr=${cur.stageAttr}, activeItem=${cur.activeItemIndex}`);
      }
    }
  }

  const stagesDownList = Array.from(observedStagesDown).sort();
  console.log('Observed stages during scroll down:', stagesDownList);
  for (let i = 0; i < 5; i++) {
    if (!observedStagesDown.has(i)) {
      throw new Error(`Stage ${i} was not sampled during scroll down!`);
    }
  }

  // --- 3. Click-to-Scroll & Precision Stage Verification ---
  console.log('--- 3. Testing Direct Click-to-Stage Navigation ---');
  for (let i = 0; i < 5; i++) {
    const item = timelineItems.nth(i);
    await item.click();
    await page.waitForTimeout(600); // Allow smooth scroll to settle

    const cur = await getActiveStage();
    console.log(`Clicked Stage ${i} (${stageNames[i]}): activeItem=${cur.activeItemIndex}, panes=${cur.activePanes}, scrollY=${cur.scrollY}`);

    if (cur.activeItemIndex !== i || !cur.activePanes.includes(i)) {
      throw new Error(`Clicking stage ${i} failed to activate matching stage! Got item=${cur.activeItemIndex}, panes=${cur.activePanes}`);
    }

    await page.screenshot({ path: `${outputDir}/${stageScreenshots[i]}` });
  }

  // --- 4. Reverse Scrolling Up ---
  console.log('--- 4. Testing Reverse Scrolling Up ---');
  const observedStagesUp = new Set();
  for (let s = numSteps; s >= 0; s--) {
    const targetY = startY + (s / numSteps) * (endY - startY);
    await page.evaluate((y) => window.scrollTo(0, y), targetY);
    await page.waitForTimeout(80);

    const cur = await getActiveStage();
    observedStagesUp.add(cur.activeItemIndex);

    if (cur.activeItemIndex !== -1) {
      if (!cur.activePanes.includes(cur.activeItemIndex)) {
        throw new Error(`Reverse desynchronization at Y=${targetY}: item=${cur.activeItemIndex}, panes=${cur.activePanes}`);
      }
    }
  }
  const stagesUpList = Array.from(observedStagesUp).sort();
  console.log('Observed stages during scroll up:', stagesUpList);
  for (let i = 0; i < 5; i++) {
    if (!observedStagesUp.has(i)) {
      throw new Error(`Stage ${i} was not sampled during scroll up!`);
    }
  }

  // Return to top of process section
  await page.evaluate(() => window.scrollTo(0, 1050));
  await page.waitForTimeout(400);
  const finalState = await getActiveStage();
  console.log('Final state after scrolling back to section entry:', finalState);
  if (finalState.activeItemIndex !== 0) {
    throw new Error(`Expected stage 0 after returning to entry, got ${finalState.activeItemIndex}`);
  }

  // --- 5. Footer Stage Indicator Navigation ---
  console.log('--- 5. Testing Footer Stage Indicator Buttons ---');
  const footerButtons = page.locator('#process .footer-stage-indicator');
  const footerCount = await footerButtons.count();
  console.log(`Found ${footerCount} footer buttons`);
  if (footerCount === 5) {
    await footerButtons.nth(3).click(); // Click DEVELOP
    await page.waitForTimeout(600);
    const devState = await getActiveStage();
    console.log('Clicked footer Develop button:', devState);
    if (devState.activeItemIndex !== 3) {
      throw new Error(`Footer button navigation failed: expected stage 3, got ${devState.activeItemIndex}`);
    }

    await footerButtons.nth(4).click(); // Click LAUNCH
    await page.waitForTimeout(600);
    const launchState = await getActiveStage();
    console.log('Clicked footer Launch button:', launchState);
    if (launchState.activeItemIndex !== 4) {
      throw new Error(`Footer button navigation failed: expected stage 4, got ${launchState.activeItemIndex}`);
    }
  }

  // --- 6. Services Accordion Isolation Check ---
  console.log('--- 6. Verifying Services Accordion on /services ---');
  const servicesSection = page.locator('.services-interactive-section');
  await servicesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Check all collapsed initially
  const expandedServices = await page.locator('.services-interactive-section .service-accordion-item.is-expanded').count();
  console.log(`Initial expanded services count: ${expandedServices} (expected 0)`);
  if (expandedServices !== 0) {
    throw new Error(`Expected all services collapsed initially, found ${expandedServices} open`);
  }

  // Click first service
  const firstServiceTrigger = page.locator('.services-interactive-section .service-accordion-header').first();
  await firstServiceTrigger.click();
  await page.waitForTimeout(400);

  const openCountAfterClick = await page.locator('.services-interactive-section .service-accordion-item.is-expanded').count();
  console.log(`Expanded services after clicking first: ${openCountAfterClick} (expected 1)`);
  if (openCountAfterClick !== 1) {
    throw new Error(`Expected 1 service open, found ${openCountAfterClick}`);
  }

  // Close it again
  await firstServiceTrigger.click();
  await page.waitForTimeout(400);
  const openCountAfterClose = await page.locator('.services-interactive-section .service-accordion-item.is-expanded').count();
  console.log(`Expanded services after closing: ${openCountAfterClose} (expected 0)`);
  if (openCountAfterClose !== 0) {
    throw new Error(`Expected all services closed after toggle, found ${openCountAfterClose}`);
  }

  // --- 7. Mobile Viewport Verification ---
  console.log('--- 7. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:3000/services', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  const mobileProcess = mobilePage.locator('#process');
  await mobileProcess.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(800);

  await mobilePage.screenshot({ path: `${outputDir}/06-mobile-process.png` });
  await mobileContext.close();

  console.log('--- All verifications PASSED successfully! ---');
  if (errors.length > 0) {
    console.warn('Page errors detected:', errors);
  }
} finally {
  await browser.close();
}
