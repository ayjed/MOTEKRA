import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDir = 'scratch/video_frames';
await mkdir(outputDir, { recursive: true });

const videoPath = resolve('ggggggggggg.mp4').replace(/\\/g, '/');

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; overflow:hidden;">
        <video id="vid" src="file:///${videoPath}" style="width:100vw; height:100vh; object-fit:contain;" muted></video>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.waitForTimeout(1000);

  // Get duration
  const duration = await page.evaluate(() => {
    const v = document.getElementById('vid');
    return new Promise((resolve) => {
      if (v.readyState >= 1) resolve(v.duration);
      else v.onloadedmetadata = () => resolve(v.duration);
    });
  });
  console.log('Video duration:', duration, 'seconds');

  // Let's capture frames around:
  // 1. Hero entrance (1.8s to 3.2s)
  // 2. Services entrance (2.8s to 4.2s)
  // 3. Featured Work entrance (4.5s to 6.5s)
  // 4. Process entrance (13.5s to 15.5s)
  // 5. Reviews entrance (17.5s to 19.5s)

  async function captureRange(startSec, endSec, stepSec, prefix) {
    for (let t = startSec; t <= endSec; t += stepSec) {
      await page.evaluate((time) => {
        const v = document.getElementById('vid');
        return new Promise((resolve) => {
          v.currentTime = time;
          v.onseeked = () => resolve();
        });
      }, t);
      await page.waitForTimeout(50);
      const filename = `${outputDir}/${prefix}_${t.toFixed(2).replace('.', '_')}s.png`;
      await page.screenshot({ path: filename });
    }
  }

  console.log('Capturing hero & services entrance (1.8s - 3.8s)...');
  await captureRange(1.8, 3.8, 0.2, 'hero_services');

  console.log('Capturing featured work entrance (4.5s - 6.2s)...');
  await captureRange(4.5, 6.2, 0.2, 'work');

  console.log('Capturing process entrance (13.5s - 15.5s)...');
  await captureRange(13.5, 15.5, 0.2, 'process');

  console.log('Frames captured successfully in', outputDir);

} finally {
  await browser.close();
}

