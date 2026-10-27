import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
await page.goto("http://127.0.0.1:3000/motion-lab");
await page.waitForFunction(() => document.querySelector('.scene-boundary')?.getAttribute('data-scene-state') === 'ready');
const audit = await page.locator('h1').evaluate((h) => {
  const info = (e) => { const s = getComputedStyle(e); const b=e.getBoundingClientRect(); return { tag:e.tagName, class:e.className, text:e.textContent, style:e.getAttribute('style'),color:s.color,opacity:s.opacity,visibility:s.visibility,transform:s.transform,clip:s.clipPath,rect:{x:b.x,y:b.y,w:b.width,h:b.height},overflow:s.overflow, font:s.fontSize}; };
  return { html:h.outerHTML, title:info(h), children:Array.from(h.querySelectorAll('span')).map(info), parent:info(h.parentElement) };
});
await writeFile('docs/evidence/phase-02/title-style-audit.json', JSON.stringify(audit, null, 2));
await page.screenshot({ path: 'docs/evidence/phase-02/lab-hero-1440.png' });
await page.screenshot({ path: 'docs/evidence/phase-02/lab-desktop-1440.png', fullPage: true });
console.log('Saved viewport hero capture and computed heading audit');
await browser.close();
