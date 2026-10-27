import { chromium } from '@playwright/test';
import { mkdir, writeFile, copyFile, unlink } from 'node:fs/promises';

const dir = 'docs/evidence/phase-03';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, recordVideo: { dir: `${dir}/recording`, size: { width: 390, height: 844 } } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/');
  await page.locator('[data-home-cinema][data-motion-active]').waitFor();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${dir}/hero-390.png` });
  const audit = await page.evaluate(() => ({
    sections: Array.from(document.querySelectorAll('[data-home-section]'), (node) => node.getAttribute('data-home-section')),
    headings: Array.from(document.querySelectorAll('h1,h2,h3'), (node) => ({ level: node.tagName, text: node.textContent })),
    mainCount: document.querySelectorAll('main').length,
    anchors: Array.from(document.querySelectorAll('a[href]'), (node) => node.getAttribute('href')),
    noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
    fonts: Object.fromEntries(['body', 'h1', '.button'].map((selector) => [selector, document.querySelector(selector) ? getComputedStyle(document.querySelector(selector)).fontFamily : null])),
  }));
  await writeFile(`${dir}/html-audit.json`, JSON.stringify(audit, null, 2));
  for (const id of ['featured-work', 'home-services', 'home-process', 'home-founder', 'creative-lab', 'home-contact']) {
    await page.locator(`#${id}`).evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 80));
    await page.waitForTimeout(1400);
    if (id === 'home-services') await page.locator('.interactive-service summary').first().click();
    await page.screenshot({ path: `${dir}/mobile-${id}.png` });
  }
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/mobile-footer.png` });
  const video = page.video();
  await context.close();
  const raw = await video.path();
  await copyFile(raw, `${dir}/home-mobile-walkthrough.webm`);
  await unlink(raw);
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await desktop.goto('http://127.0.0.1:3000/');
  for (const id of ['home-founder', 'creative-lab', 'home-contact']) {
    await desktop.locator(`#${id}`).evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 100));
    await desktop.waitForTimeout(1400);
    await desktop.screenshot({ path: `${dir}/desktop-${id}.png` });
  }
  const statuses = {};
  for (const href of [...new Set(audit.anchors)].filter((href) => href?.startsWith('/') && !href.startsWith('//'))) statuses[href] = (await desktop.request.get(`http://127.0.0.1:3000${href}`)).status();
  if (Object.values(statuses).some((status) => status !== 200)) throw new Error('Internal link audit failed');
  await writeFile(`${dir}/internal-links.json`, JSON.stringify(statuses, null, 2));
  console.log('Mobile recording, section captures, heading and internal link audits saved.');
} finally { await browser.close(); }
