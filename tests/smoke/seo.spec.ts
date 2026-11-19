import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const dir = process.env.EVIDENCE_DIR ?? 'docs/evidence/phase-08';

test.beforeAll(async () => {
  await mkdir(dir, { recursive: true });
});

test('Insights stays empty and outside navigation until reviewed posts exist', async ({ page, request }) => {
  await page.goto('/insights');
  await expect(page.locator('h1')).toContainText('Ideas worth');
  await expect(page.getByRole('heading', { name: 'Nothing published yet.' })).toBeVisible();
  await expect(page.locator('header a[href="/insights"]')).toHaveCount(0);
  await expect(page.locator('footer a[href="/insights"]')).toHaveCount(0);
  expect((await request.get('/insights/synthetic-template-fixture')).status()).toBe(404);
  const html = await (await request.get('/insights')).text();
  expect(html).toContain('Nothing published yet.');
  expect(html).toContain('noindex');
  expect(html).not.toContain('"@type":"Article"');
});

test('Insights and isolated article template are responsive, keyboard-readable and accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/insights');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `${dir}/insights-${width}.png`, fullPage: true });
    if (width !== 320) {
      const result = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      await writeFile(`${dir}/axe-insights-${width}.json`, JSON.stringify(result, null, 2));
      expect(result.violations).toEqual([]);
    }
    await page.goto(pathToFileURL(resolve(`${dir}/article-template-fixture.html`)).href);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('note')).toContainText('SYNTHETIC TEST FIXTURE');
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Code presentation' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#code-sample$/);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${dir}/article-template-fixture-${width}.png`, fullPage: true });
    if (width !== 320) {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      await writeFile(`${dir}/axe-article-fixture-${width}.json`, JSON.stringify(result, null, 2));
      expect(result.violations).toEqual([]);
    }
  }
});

test('no JavaScript and no WebGL preserve copy, breadcrumbs and internal links', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of ['/insights', '/services/web-development', '/team/akinwumi-ayomiposi']) {
    await page.goto(`http://127.0.0.1:3000${path}`);
    await expect(page.getByRole('navigation', { name: 'Breadcrumb', exact: true })).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
  }
  await page.goto(pathToFileURL(resolve(`${dir}/article-template-fixture.html`)).href);
  await expect(page.locator('.insight-prose')).toContainText('synthetic test content');
  await expect(page.locator('pre')).toContainText('Synthetic fixture only');
  await context.close();
});

test('social images and metadata remain static and contain no private delivery details', async ({ request }) => {
  for (const path of ['/', '/work', '/services', '/about', '/contact', '/insights']) {
    const html = await (await request.get(path)).text();
    expect(html).toContain('twitter:card');
    expect(html).toContain('og:title');
    expect(html).not.toContain('CONTACT_EMAIL');
    expect(html).not.toContain('RESEND_API_KEY');
  }
  const manifest = JSON.parse(await readFile(`${dir}/social-assets.json`, 'utf8'));
  expect(manifest.cards).toHaveLength(12);
  for (const image of manifest.cards) {
    const response = await request.get('/' + image.path.replace('public/', ''));
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  }
});

test('all 11 approved baseline URLs render complete initial HTML with canonical and approved title', async ({ request }) => {
  const approvedBaseline = [
    { path: '/', title: 'Digital Products for What’s Next - MOTEKRA', canonical: 'https://www.motekra.com/' },
    { path: '/work', title: 'Our Work & Design Concepts - MOTEKRA', canonical: 'https://www.motekra.com/work' },
    { path: '/about', title: 'About the Studio - MOTEKRA', canonical: 'https://www.motekra.com/about' },
    { path: '/contact', title: 'Contact Us - MOTEKRA', canonical: 'https://www.motekra.com/contact' },
    { path: '/services', title: 'Services - Digital Product Design & Engineering - MOTEKRA', canonical: 'https://www.motekra.com/services' },
    { path: '/services/ui-ux-design', title: 'UI/UX Design - Digital Product Services - MOTEKRA', canonical: 'https://www.motekra.com/services/ui-ux-design' },
    { path: '/services/web-development', title: 'Web Development - Digital Product Services - MOTEKRA', canonical: 'https://www.motekra.com/services/web-development' },
    { path: '/services/mobile-app-development', title: 'Mobile App Development - Digital Product Services - MOTEKRA', canonical: 'https://www.motekra.com/services/mobile-app-development' },
    { path: '/services/product-strategy', title: 'Product Strategy - Digital Product Services - MOTEKRA', canonical: 'https://www.motekra.com/services/product-strategy' },
    { path: '/services/brand-visual-design', title: 'Brand & Visual Design - Digital Product Services - MOTEKRA', canonical: 'https://www.motekra.com/services/brand-visual-design' },
    { path: '/team/akinwumi-ayomiposi', title: 'Ayomiposi Akinwumi - Software Developer & Creative Technologist - MOTEKRA', canonical: 'https://www.motekra.com/team/akinwumi-ayomiposi' },
  ];

  for (const pageInfo of approvedBaseline) {
    const res = await request.get(pageInfo.path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain(`<title>${pageInfo.title.replaceAll('&', '&amp;')}</title>`);
    if (pageInfo.path !== '/') {
      expect(html).toContain(`<link rel="canonical" href="${pageInfo.canonical}"/>`);
    }
    const h1Matches = html.match(/<h1[\s>]/g) ?? [];
    expect(h1Matches.length).toBe(1);
  }
});
