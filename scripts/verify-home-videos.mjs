import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve('docs/evidence/phase-03/index.html')).href);
  const results = [];
  for (const video of await page.locator('video').all()) {
    await video.evaluate(async (node) => { node.muted = true; await node.play(); });
    await page.waitForFunction((index) => document.querySelectorAll('video')[index].currentTime > 1, results.length);
    const result = await video.evaluate((node) => ({ source:node.querySelector('source').getAttribute('src'), duration:node.duration,width:node.videoWidth,height:node.videoHeight,played:node.currentTime,error:node.error?.message??null }));
    if (result.error || result.duration < 5 || !result.width || !result.height) throw new Error('Video playback failed');
    results.push(result); await video.evaluate((node) => node.pause());
  }
  await writeFile('docs/evidence/phase-03/video-playback.json', JSON.stringify(results,null,2));
  console.log(JSON.stringify(results));
} finally { await browser.close(); }
