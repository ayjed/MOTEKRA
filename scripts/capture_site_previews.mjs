import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'public/previews';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();

  // 1. Homepage
  console.log('Capturing Homepage sections...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // Hero
  await page.screenshot({ path: `${outputDir}/01-home-hero.png` });

  // Work
  await page.locator('#featured-work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outputDir}/02-home-work.png` });

  // Services
  await page.locator('#home-services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outputDir}/03-home-services.png` });

  // Process
  await page.locator('#process').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outputDir}/04-home-process.png` });

  // Testimonials
  await page.locator('#home-testimonials').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outputDir}/05-home-testimonials.png` });

  // Contact closing
  await page.locator('#home-contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outputDir}/06-home-closing-cta.png` });

  // 2. Client-side navigation to Work page via header
  console.log('Navigating to Work page...');
  await page.locator('.nav-link[href="/work"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outputDir}/07-work-page.png` });

  // 3. Client-side navigation to Services page via header
  console.log('Navigating to Services page...');
  await page.locator('.nav-link[href="/services"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outputDir}/08-services-page.png` });

  // 4. Client-side navigation to About page via header
  console.log('Navigating to About page...');
  await page.locator('.nav-link[href="/about"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outputDir}/09-about-page.png` });

  // 5. Client-side navigation to Contact page via header
  console.log('Navigating to Contact page...');
  await page.locator('.nav-link[href="/contact"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outputDir}/10-contact-page.png` });

  console.log('All preview snapshots captured successfully in public/previews!');
} finally {
  await browser.close();
}

