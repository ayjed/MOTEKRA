import { chromium } from '@playwright/test';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = 'docs/evidence/phase-04';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const publicPage = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  await publicPage.goto('http://127.0.0.1:3001/work');
  await publicPage.screenshot({ path: `${dir}/public-work-1440.png` });
  await publicPage.locator('.work-editorial-grid').scrollIntoViewIfNeeded();
  await publicPage.screenshot({ path: `${dir}/public-collection-1440.png` });
  const links = await publicPage.locator('main a[href]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  const statuses = {};
  for (const href of [...new Set(links)].filter((href) => href.startsWith('/'))) statuses[href] = (await publicPage.request.get(`http://127.0.0.1:3001${href}`)).status();
  await writeFile(`${dir}/public-links.json`, JSON.stringify(statuses, null, 2));
  if (Object.values(statuses).some((status) => status !== 200)) throw new Error('Public Work link failed');
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:3000/work');
  const audit = await page.evaluate(() => ({ title: document.title, mainCount: document.querySelectorAll('main').length, h1Count: document.querySelectorAll('h1').length, headings: [...document.querySelectorAll('h1,h2,h3')].map((node) => ({ level:node.tagName,text:node.textContent })), canvasCount:document.querySelectorAll('canvas').length, imageRequests:performance.getEntriesByType('resource').filter((r) => r.name.includes('/work/evidence/')).map((r) => ({name:r.name,bytes:r.transferSize})), cards:[...document.querySelectorAll('.work-card')].map((node) => ({ id:node.getAttribute('data-work-id'),kind:node.getAttribute('data-kind'),width:Math.round(node.getBoundingClientRect().width) })) }));
  await writeFile(`${dir}/html-audit.json`, JSON.stringify(audit,null,2));
  await page.locator('.work-editorial-grid').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/editorial-grid-1440.png` });
  await page.goto('http://127.0.0.1:3000/work/connectapi');
  await page.locator('.case-hero-evidence').screenshot({ path: `${dir}/connectapi-evidence-1440.png` });
  await page.locator('#case-verification').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/case-verification-1440.png` });
} finally { await browser.close(); }

const files = await readdir(dir);
const images = files.filter((name) => name.endsWith('.png'));
const reports = files.filter((name) => name.endsWith('.report.html'));
await writeFile(`${dir}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOTEKRA / Phase 04 Work review</title><style>body{max-width:1440px;margin:auto;padding:32px;background:#edf7ff;color:#08152b;font:16px Arial,sans-serif}a{color:#0562cb}video{width:100%;max-height:85vh;background:#08152b}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}figure{margin:0;padding:14px;background:white;border:1px solid #b6d7ef;border-radius:16px}img{width:100%;height:340px;object-fit:contain}figcaption{padding:14px;overflow-wrap:anywhere}</style><h1>Work / Phase 04 review</h1><p>Design 02 · Server-rendered gallery and evidence-led draft cases. No completed client work or founder contribution has been inferred. Candidate screenshots appear only in local review mode; normal public mode withholds names, cases and image bytes.</p><p><a href="README.md">Validation / limits</a> · <a href="public-gate.json">Public-mode protection</a> · <a href="playwright-results.json">Browser checks</a> · <a href="html-audit.json">HTML/card audit</a> · <a href="work-review-server.html">Review HTML</a> · <a href="work-public-server.html">Public HTML</a></p>${reports.map((name)=>`<p><a href="${name}">${name}</a></p>`).join('')}<h2>Desktop walkthrough</h2><video controls preload="metadata" poster="work-1440.png"><source src="work-walkthrough.webm" type="video/webm"></video><h2>Desktop, responsive, source cases and no-JS</h2><section>${images.map((name)=>`<figure><a href="${name}"><img src="${name}" alt="Work review capture ${name}" loading="lazy"></a><figcaption>${name}</figcaption></figure>`).join('')}</section></html>`);
const verify = await chromium.launch({ channel:'chrome',headless:true });
try {
  const page = await verify.newPage(); await page.goto(pathToFileURL(resolve(`${dir}/index.html`)).href);
  await page.locator('video').evaluate(async (node) => { node.muted=true;await node.play(); });
  await page.waitForFunction(() => document.querySelector('video').currentTime > 1);
  const video = await page.locator('video').evaluate((node) => ({duration:node.duration,width:node.videoWidth,height:node.videoHeight,played:node.currentTime,error:node.error?.message??null}));
  if(video.error || video.duration < 8 || video.width !== 1440) throw new Error('Walkthrough playback failed');
  await writeFile(`${dir}/video-playback.json`,JSON.stringify(video,null,2));
} finally { await verify.close(); }
const manifest=[];
for(const name of (await readdir(dir)).filter((name)=>/\.(png|json|html|webm|txt)$/.test(name)&&name!=='artifact-manifest.json'&&name!=='index.html')) { const bytes=await readFile(`${dir}/${name}`);manifest.push({file:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}); }
await writeFile(`${dir}/artifact-manifest.json`,JSON.stringify(manifest,null,2));
console.log(JSON.stringify({screenshots:images.length,video:'work-walkthrough.webm',gallery:`${dir}/index.html`}));
