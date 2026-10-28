import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const videoDir = 'docs/evidence/phase-31/videos';
await mkdir(videoDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to http://127.0.0.1:3000/work with video recording...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Smooth scroll down to portfolio grid
  await page.evaluate(() => {
    window.scrollBy({ top: 300, behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);

  // Hover over Card 0 (Spotlight Contest)
  const cards = page.locator('.work-portfolio-grid [data-work-card]');
  await cards.nth(0).locator('.work-card-media-wrap').hover();
  await page.waitForTimeout(1200);

  // Hover over Card 1 (LAD Global Travels)
  await cards.nth(1).locator('.work-card-media-wrap').hover();
  await page.waitForTimeout(1200);

  // Scroll down further
  await page.evaluate(() => {
    window.scrollBy({ top: 500, behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);

  // Hover over Card 2 (TOG Africa)
  await cards.nth(2).locator('.work-card-media-wrap').hover();
  await page.waitForTimeout(1200);

  // Hover over Card 3 (ConnectAPI)
  await cards.nth(3).locator('.work-card-media-wrap').hover();
  await page.waitForTimeout(1200);

  // Click on Spotlight Contest to navigate to case study
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
  await page.waitForTimeout(800);
  await cards.nth(0).locator('a.work-card-link').click();
  await page.waitForURL('**/work/spotlight-contest');
  await page.waitForTimeout(1800);

  // Scroll on case study
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(1200);

  // Navigate back to /work
  await page.goBack();
  await page.waitForURL('**/work');
  await page.waitForTimeout(2000);

  console.log('Interaction completed successfully. Closing context to save video...');
  await context.close();
} finally {
  await browser.close();
}
