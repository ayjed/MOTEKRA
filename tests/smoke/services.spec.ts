import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { services } from "../../src/content/services";

const dir = process.env.EVIDENCE_DIR ?? "docs/evidence/phase-05";
test.beforeAll(async () => { await mkdir(dir,{recursive:true}); });
async function settleTitle(page: Page) {
  await expect(page.locator('.services-cinema')).toHaveAttribute('data-motion-active','true');
  await expect.poll(() => page.locator('[data-services-line]').evaluateAll((nodes) => nodes.every((node) => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42)<1))).toBe(true);
}

test("six production HTML routes contain genuine provisional copy, links and metadata", async ({request}) => {
  const landing = await request.get('/services'); expect(landing.status()).toBe(200);
  const html=await landing.text();await writeFile(`${dir}/services-server.html`,html);
  expect(html).toContain('End-to-end Digital Solutions.');
  expect((html.match(/data-service-chapter=/g)??[])).toHaveLength(5);
  expect(html).toContain('final service scope unconfirmed');
  for(const step of ['Discover','Define','Design','Develop','Launch']) expect(html).toContain(step);
  expect(html).not.toContain('<canvas');
  const titles=[];
  for (const service of services) {
    const response=await request.get(`/services/${service.slug}`);expect(response.status()).toBe(200);
    const detail=await response.text();await writeFile(`${dir}/${service.slug}-server.html`,detail);
    for(const text of [service.title,'Provisional offering','Potential deliverables.','Make the decisions visible.','No approved client case study','A clearer starting point.','noindex']) expect(detail).toContain(text.replaceAll('&','&amp;'));
    expect(detail).not.toContain('"@type":"Service"');
    expect(detail).not.toContain('href="/work/spotlight-contest"');
    titles.push(detail.match(/<title>(.*?)<\/title>/)?.[1]);
  }
  expect(new Set(titles).size).toBe(5);
  expect((await request.get('/services/not-a-service')).status()).toBe(404);
  await writeFile(`${dir}/metadata-audit.json`,JSON.stringify(titles,null,2));
});

test("five native prototypes produce distinct keyboard-operated interface transformations", async ({page}) => {
  await page.goto('/services');await settleTitle(page);
  await expect(page.locator('canvas')).toHaveCount(0);
  const selectors = {design:'.designed-layer',web:'.web-window-primary',mobile:'.phone-detail',strategy:'.checkpoint-0',brand:'.brand-type-specimen'};
  const results=[];
  for (const service of services) {
    const chapter=page.locator(`#service-${service.slug}`);
    await chapter.evaluate((node)=>window.scrollTo(0,node.getBoundingClientRect().top+scrollY-80));
    const stage=chapter.locator(selectors[service.visual]);
    const read=()=>stage.evaluate((node)=>({transform:getComputedStyle(node).transform,clip:getComputedStyle(node).clipPath,width:node.getBoundingClientRect().width}));
    const before=await read();
    const summary=chapter.getByRole('group').locator('summary').first();
    await summary.focus();await page.keyboard.press('Enter');
    await expect(chapter.locator('.prototype-switch')).toHaveAttribute('open','');
    await expect(chapter.locator('.prototype-switch > p')).toBeVisible();
    await expect.poll(async()=>JSON.stringify(await read())).not.toBe(JSON.stringify(before));
    await expect(summary).toBeFocused();
    // Wait for the native CSS state to settle before a still capture.
    await stage.evaluate((node)=>Promise.all(node.getAnimations().map((animation)=>animation.finished.catch(()=>{}))));
    await page.screenshot({path:`${dir}/prototype-${service.visual}-1440.png`});
    results.push({service:service.slug,before,after:await read()});
  }
  await expect(page.locator('.service-explore-link')).toHaveCount(5);
  await writeFile(`${dir}/prototype-states.json`,JSON.stringify(results,null,2));
});

test("optional R3F mobile flow supports state changes, visibility pause and context-loss fallback", async ({page}) => {
  await page.goto('/services/mobile-app-development');
  const scene=page.locator('.scene-boundary');
  await scene.scrollIntoViewIfNeeded();
  await expect(page.locator('canvas')).toHaveCount(0);
  await scene.evaluate((node)=>{
    const root=node as HTMLElement;root.dataset.posterOverlap='false';
    const observer=new MutationObserver(()=>{
      const poster=root.querySelector('.scene-poster'),layer=root.querySelector('.webgl-layer');
      if(poster&&layer&&Number(getComputedStyle(poster).opacity)>0&&Number(getComputedStyle(layer).opacity)>0) root.dataset.posterOverlap='true';
      if(root.dataset.sceneState==='ready') observer.disconnect();
    });
    observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['style','data-scene-state']});
  });
  await page.getByRole('button',{name:'Enable 3D depth',exact:true}).click();
  await expect(scene).toHaveAttribute('data-scene-state','ready',{timeout:30_000});
  await expect(scene).toHaveAttribute('data-scene-kind','mobile-flow');
  await expect(scene.locator('.webgl-layer')).toHaveCSS('opacity','1');
  await expect(scene.locator('.scene-poster')).toHaveCSS('opacity','0');
  await expect(scene).toHaveAttribute('data-poster-overlap','false');
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.locator('.prototype-switch > summary').click();
  await expect(scene).toHaveAttribute('data-scene-variant','prototype');
  await scene.scrollIntoViewIfNeeded();
  await page.screenshot({path:`${dir}/mobile-r3f-1440.png`});
  await page.getByRole('navigation',{name:'Service detail sections'}).getByRole('link',{name:'Questions',exact:true}).click();
  await expect(scene).toHaveAttribute('data-scene-state','paused');
  await scene.scrollIntoViewIfNeeded();await expect(scene).toHaveAttribute('data-scene-state','ready');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(scene).toHaveAttribute('data-scene-state','paused');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(scene).toHaveAttribute('data-scene-state','ready');
  await page.locator('canvas').evaluate((node)=>node.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await expect(scene).toHaveAttribute('data-scene-state','error');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(scene.locator('.scene-poster')).toHaveCSS('opacity','1');
  await page.screenshot({path:`${dir}/mobile-context-fallback-1440.png`});
});

test("live motion preferences remove WebGL and restore the semantic prototype", async ({page}) => {
  await page.goto('/services/mobile-app-development');
  const scene=page.locator('.scene-boundary');await scene.scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Enable 3D depth',exact:true}).click();
  await expect(scene).toHaveAttribute('data-scene-state','ready',{timeout:30_000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('[data-motion-active]')).toHaveCount(0);
  await expect(scene).toHaveAttribute('data-scene-state','poster');
  await expect(page.getByRole('button',{name:'Enable 3D depth',exact:true})).toBeDisabled();
  await page.locator('.prototype-switch > summary').click();
  await expect(page.locator('.prototype-switch')).toHaveAttribute('open','');
  await page.screenshot({path:`${dir}/mobile-live-reduced-1440.png`});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(scene).toHaveAttribute('data-scene-state','ready',{timeout:30_000});
  await page.setViewportSize({width:390,height:844});
  await expect(scene).toHaveAttribute('data-scene-quality','poster');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test("landing and all details fit mobile, tablet and desktop with no automatic WebGL", async ({page}) => {
  test.setTimeout(240_000);
  const errors:string[]=[];page.on('pageerror',(error)=>errors.push(error.message));
  for(const width of [1440,1024,768,390,320]) {
    await page.setViewportSize({width,height:960});await page.goto('/services');await settleTitle(page);
    expect(await page.locator('[data-services-line]').first().evaluate((node)=>node.getBoundingClientRect().height<=parseFloat(getComputedStyle(node).lineHeight)*1.2)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.screenshot({path:`${dir}/services-${width}.png`});
    if(width===390 || width===1440) for(const service of services) {
      await page.locator(`#service-${service.slug}`).evaluate((node)=>window.scrollTo(0,node.getBoundingClientRect().top+scrollY-80));
      await page.screenshot({path:`${dir}/chapter-${service.visual}-${width}.png`});
    }
  }
  for(const width of [1440,390]) for(const service of services) {
    await page.setViewportSize({width,height:960});await page.goto(`/services/${service.slug}`);
    await expect(page.getByRole('heading',{level:1,name:service.title,exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`${dir}/detail-${service.visual}-${width}.png`});
  }
  expect(errors).toEqual([]);
});

test("no JavaScript, reduced motion and low capability preserve copy, prototypes and FAQ", async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('http://127.0.0.1:3000/services');
  await expect(page.getByRole('heading',{level:1,name:'End-to-end Digital Solutions.'})).toBeVisible();
  for(const service of services) {
    const summary=page.locator(`#service-${service.slug} summary`);await summary.click();
    await expect(page.locator(`#service-${service.slug} .prototype-switch`)).toHaveAttribute('open','');
  }
  await page.screenshot({path:`${dir}/services-no-js-390.png`});
  await page.goto('http://127.0.0.1:3000/services/ui-ux-design');
  await page.locator('.service-faq summary').first().click();
  await expect(page.locator('.service-faq details').first()).toHaveAttribute('open','');
  await expect(page.locator('.service-faq details > p').first()).toBeVisible();
  await page.screenshot({path:`${dir}/faq-no-js-390.png`});await context.close();
  const low=await browser.newContext({viewport:{width:1440,height:960}});
  await low.addInitScript(()=>Object.defineProperty(navigator,'deviceMemory',{value:1,configurable:true}));
  const lowPage=await low.newPage();await lowPage.goto('http://127.0.0.1:3000/services/mobile-app-development');
  await expect(lowPage.getByRole('button',{name:'Enable 3D depth',exact:true})).toBeDisabled();
  await expect(lowPage.locator('canvas')).toHaveCount(0);
  await low.close();
});

test("all six service pages pass desktop and mobile automated accessibility checks", async ({browser}) => {
  test.setTimeout(300_000);
  for(const width of [1440,390]) {
    const context=await browser.newContext({viewport:{width,height:960},reducedMotion:'reduce'});const page=await context.newPage();
    for(const slug of ['',...services.map((service)=>service.slug)]) {
      await page.goto(`http://127.0.0.1:3000/services${slug?`/${slug}`:''}`);
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
      await writeFile(`${dir}/axe-${slug||'landing'}-${width}.json`,JSON.stringify(result,null,2));
      expect(result.violations.map(({id,nodes})=>({id,targets:nodes.map((node)=>node.target)}))).toEqual([]);
    }
    await context.close();
  }
});

test("shared Home device scene and navigation remain compatible", async ({page}) => {
  await page.goto('/');await expect(page.locator('.scene-boundary')).toHaveAttribute('data-scene-kind','devices');
  await expect(page.locator('.scene-boundary')).toHaveAttribute('data-scene-state','ready',{timeout:30_000});
  await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Services',exact:true}).click();
  await expect(page).toHaveURL(/\/services$/);await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('main')).toBeFocused();
  await page.goBack();await expect(page.locator('.scene-boundary')).toHaveAttribute('data-scene-state','ready',{timeout:30_000});
});

test("record the five service interfaces and optional mobile depth", async ({browser}) => {
  const context=await browser.newContext({viewport:{width:1440,height:960},recordVideo:{dir:`${dir}/recording`,size:{width:1440,height:960}}});
  const page=await context.newPage();await page.goto('http://127.0.0.1:3000/services');await settleTitle(page);await page.waitForTimeout(900);
  for(const service of services) {
    await page.locator(`#service-${service.slug}`).evaluate((node)=>window.scrollTo(0,node.getBoundingClientRect().top+scrollY-80));
    await page.waitForTimeout(800);
    if(service.visual==='mobile') {await page.getByRole('button',{name:'Enable 3D depth',exact:true}).click();await expect(page.locator('.scene-boundary')).toHaveAttribute('data-scene-state','ready',{timeout:30_000});await page.waitForTimeout(600);}
    await page.locator(`#service-${service.slug} .prototype-switch > summary`).click();
    await page.waitForTimeout(1300);
  }
  await page.locator('.service-explore-link').last().click();await page.waitForTimeout(900);
  await page.locator('#potential-deliverables').scrollIntoViewIfNeeded();await page.waitForTimeout(1300);
  const video=page.video();await context.close();await video!.saveAs(`${dir}/services-walkthrough.webm`);await video!.delete();
});

