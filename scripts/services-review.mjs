import { chromium } from '@playwright/test';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir='docs/evidence/phase-05';
const slugs=['ui-ux-design','web-development','mobile-app-development','product-strategy','brand-visual-design'];
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:3000/services');
  const audit=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1').getAttribute('aria-label'),h1Count:document.querySelectorAll('h1').length,mainCount:document.querySelectorAll('main').length,headings:[...document.querySelectorAll('h1,h2,h3')].map((node)=>({level:node.tagName,text:node.textContent})),canvasCount:document.querySelectorAll('canvas').length,prototypeCount:document.querySelectorAll('[data-service-demo]').length,noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth}));
  await writeFile(`${dir}/html-audit.json`,JSON.stringify(audit,null,2));
  const statuses={};
  for(const route of ['/services',...slugs.map((slug)=>`/services/${slug}`)]) {
    const response=await page.request.get(`http://127.0.0.1:3000${route}`);
    await writeFile(`${dir}/${route==='/services'?'services':route.split('/').pop()}-server.html`,await response.text());
    await page.goto(`http://127.0.0.1:3000${route}`);
    const links=await page.locator('main a[href]').evaluateAll((nodes)=>nodes.map((node)=>node.getAttribute('href')));
    for(const href of [...new Set(links)].filter((value)=>value.startsWith('/'))) if(!(href in statuses)) statuses[href]=(await page.request.get(`http://127.0.0.1:3000${href}`)).status();
  }
  if(Object.values(statuses).some((status)=>status!==200)) throw new Error('Internal service link failed');
  await writeFile(`${dir}/internal-links.json`,JSON.stringify(statuses,null,2));
  await page.setViewportSize({width:320,height:844});
  const ctas=[];
  for(const slug of slugs) {
    await page.goto(`http://127.0.0.1:3000/services/${slug}`);
    const bounds=await page.locator('.service-detail-cta .button').evaluate((node)=>{const rect=node.getBoundingClientRect();return {text:node.textContent,width:rect.width,left:rect.left,right:rect.right,viewport:innerWidth,insideViewport:rect.left>=0&&rect.right<=innerWidth};});
    if(!bounds.insideViewport)throw new Error('Service CTA exceeds the 320px viewport');
    ctas.push({slug,...bounds});
    if(slug==='mobile-app-development') {await page.locator('.service-detail-cta').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/cta-mobile-320.png`});}
  }
  await writeFile(`${dir}/cta-320-audit.json`,JSON.stringify(ctas,null,2));
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:3000/services');
  for(const slug of slugs) {
    const root=page.locator(`#service-${slug} .service-playground`);
    await root.locator('summary').click();
    await root.evaluate((node)=>window.scrollTo(0,node.getBoundingClientRect().top+scrollY-100));
    await page.screenshot({path:`${dir}/mobile-interface-${slug}.png`});
  }
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:960});await page.goto('http://127.0.0.1:3000/services');
    for(const [selector,name] of [['.process-section','process'],['.services-scope-section','scope']]) {
      await page.locator(selector).evaluate((node)=>window.scrollTo(0,node.getBoundingClientRect().top+scrollY-35));
      await page.screenshot({path:`${dir}/services-${name}-${width}.png`});
    }
  }
} finally {await browser.close();}

const files=await readdir(dir);
const images=files.filter((name)=>name.endsWith('.png'));
const reports=files.filter((name)=>name.endsWith('.report.html'));
await writeFile(`${dir}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOTEKRA / Phase 05 Services review</title><style>body{max-width:1440px;margin:auto;padding:32px;background:#edf7ff;color:#08152b;font:16px Arial,sans-serif}a{color:#0562cb}video{width:100%;max-height:85vh;background:#08152b}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}figure{margin:0;padding:14px;background:white;border:1px solid #b7d7ec;border-radius:16px}img{width:100%;height:340px;object-fit:contain}figcaption{padding:12px;overflow-wrap:anywhere}</style><h1>Services / Phase 05 review</h1><p>Design 02 · Five differentiated interface prototypes and five server-rendered service details. Every offering and deliverable remains provisional. No unverified client case, result or new logo is presented.</p><p>WebGL is off by default. One optional mobile-flow scene can be enabled on capable devices; CSS/native controls remain usable without it.</p><p><a href="README.md">Validation and limits</a> · <a href="playwright-results.json">Browser checks</a> · <a href="metadata-audit.json">Metadata</a> · <a href="html-audit.json">HTML audit</a> · <a href="internal-links.json">Internal links</a> · <a href="services-server.html">Production HTML</a></p>${reports.map((name)=>`<p><a href="${name}">${name}</a></p>`).join('')}<h2>Recorded walkthrough</h2><video controls preload="metadata" poster="services-1440.png"><source src="services-walkthrough.webm" type="video/webm"></video><h2>Responsive modules, details and fallbacks</h2><section>${images.map((name)=>`<figure><a href="${name}"><img src="${name}" alt="Service review capture ${name}" loading="lazy"></a><figcaption>${name}</figcaption></figure>`).join('')}</section></html>`);
const verify=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await verify.newPage();await page.goto(pathToFileURL(resolve(`${dir}/index.html`)).href);
  await page.locator('video').evaluate(async(node)=>{node.muted=true;await node.play();});
  await page.waitForFunction(()=>document.querySelector('video').currentTime>1);
  const playback=await page.locator('video').evaluate((node)=>({duration:node.duration,width:node.videoWidth,height:node.videoHeight,played:node.currentTime,error:node.error?.message??null}));
  if(playback.error||playback.duration<10||playback.width!==1440)throw new Error('Services walkthrough playback failed');
  await writeFile(`${dir}/video-playback.json`,JSON.stringify(playback,null,2));
} finally {await verify.close();}
const manifest=[];
for(const name of (await readdir(dir)).filter((name)=>/\.(png|json|html|txt|webm)$/.test(name)&&!['index.html','artifact-manifest.json'].includes(name))) {const bytes=await readFile(`${dir}/${name}`);manifest.push({file:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
await writeFile(`${dir}/artifact-manifest.json`,JSON.stringify(manifest,null,2));
console.log(JSON.stringify({screenshots:images.length,video:'services-walkthrough.webm',gallery:`${dir}/index.html`}));
