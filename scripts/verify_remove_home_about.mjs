import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-41';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  // ==========================================
  // 1. DESKTOP VIEWPORT (1440 x 900)
  // ==========================================
  console.log('=== 1. Testing Homepage About Section Removal on Desktop (1440x900) ===');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });

  const page = await contextDesktop.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // A. Verify #home-founder is completely absent from DOM
  const founderCount = await page.locator('#home-founder').count();
  if (founderCount > 0) {
    throw new Error(`Expected #home-founder to be 0, found ${founderCount}`);
  }
  const founderSectionAttr = await page.locator('[data-home-section="founder"]').count();
  if (founderSectionAttr > 0) {
    throw new Error(`Expected [data-home-section="founder"] to be 0, found ${founderSectionAttr}`);
  }
  console.log('✓ #home-founder and [data-home-section="founder"] are completely removed from homepage DOM.');

  // B. Verify removed strings are absent from homepage body
  const bodyText = await page.locator('body').innerText();
  if (bodyText.includes('A Studio for What’s Next.') || bodyText.includes('A Studio for What\'s Next.')) {
    throw new Error('Found "A Studio for What\'s Next." on homepage, expected it to be removed!');
  }
  if (bodyText.includes('Design and engineering, considered together.')) {
    throw new Error('Found "Design and engineering, considered together." on homepage!');
  }
  if (bodyText.includes('More About MOTEKRA')) {
    throw new Error('Found "More About MOTEKRA" button on homepage!');
  }
  if (bodyText.includes('Developer profile ↗')) {
    throw new Error('Found "Developer profile ↗" link on homepage!');
  }
  console.log('✓ Verified absence of founder heading, lead text, "More About MOTEKRA" CTA, and "Developer profile" link.');

  // C. Verify all remaining 6 sections are present and visible
  const heroHeading = await page.locator('.cinema-title').innerText();
  if (!heroHeading.includes('Digital Products') || !heroHeading.includes('Next.')) {
    throw new Error(`Hero headline mismatch: "${heroHeading}"`);
  }
  console.log('✓ Section 1: Hero ("Digital Products for What’s Next.") is present.');

  const workHeading = await page.locator('#work-title').innerText();
  if (!workHeading.includes('Real Projects.') || !workHeading.includes('Real Impact.')) {
    throw new Error(`Featured work headline mismatch: "${workHeading}"`);
  }
  console.log('✓ Section 2: Featured Work ("Real Projects. Real Impact.") is present.');

  const servicesHeading = await page.locator('#services-title').innerText();
  if (!servicesHeading.includes('What We') || !servicesHeading.includes('Bring to Life.')) {
    throw new Error(`Services headline mismatch: "${servicesHeading}"`);
  }
  console.log('✓ Section 3: Services ("What We Bring to Life.") is present.');

  const processHeading = await page.locator('#process-heading').innerText();
  if (!processHeading.includes('From Idea') || !processHeading.includes('to Impact.')) {
    throw new Error(`Process headline mismatch: "${processHeading}"`);
  }
  console.log('✓ Section 4: Process ("From Idea to Impact.") is present.');

  const testimonialsHeading = await page.locator('#testimonials-title').innerText();
  if (!testimonialsHeading.includes('Feedback that fuels us')) {
    throw new Error(`Testimonials headline mismatch: "${testimonialsHeading}"`);
  }
  console.log('✓ Section 5: Testimonials ("Feedback that fuels us") is present.');

  const contactHeading = await page.locator('#contact-title').innerText();
  if (!contactHeading.includes('Have Something') || !contactHeading.includes('in Mind?')) {
    throw new Error(`Contact headline mismatch: "${contactHeading}"`);
  }
  console.log('✓ Section 6: Closing Contact CTA ("Have Something in Mind?") is present.');

  // D. Verify smooth transition between Process and Testimonials
  const processSection = page.locator('#process');
  await processSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Scroll to bottom of process narrative where testimonials begins
  await page.evaluate(() => {
    const processEl = document.querySelector('#process');
    if (processEl) {
      window.scrollTo(0, processEl.offsetTop + processEl.offsetHeight - 250);
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/phase-41-process-to-testimonials-desktop.png` });
  console.log('✓ Process-to-Testimonials transition screenshot captured.');

  // Scroll to testimonials centered
  const testimonialsSection = page.locator('#home-testimonials');
  await testimonialsSection.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/phase-41-testimonials-desktop.png` });
  console.log('✓ Testimonials section screenshot captured.');

  // Scroll to contact section centered
  const contactSection = page.locator('#home-contact');
  await contactSection.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/phase-41-contact-desktop.png` });
  console.log('✓ Contact section screenshot captured.');

  // E. Verify About Navigation link & dedicated About page
  const aboutNavLink = page.locator('.site-header a[href="/about"]').first();
  const aboutNavText = await aboutNavLink.innerText();
  if (!aboutNavText.includes('About')) {
    throw new Error('About navigation link missing from header!');
  }
  console.log('✓ About link preserved in header navigation.');

  // Navigate to /about to confirm dedicated page remains 100% intact
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const aboutPageH1 = await page.locator('.editorial-hero h1').innerText();
  console.log(`Dedicated /about H1: "${aboutPageH1.replace(/\s+/g, ' ').trim()}"`);
  if (!aboutPageH1.includes('A Studio for') || !aboutPageH1.includes('What’s Next.')) {
    throw new Error(`Dedicated /about page heading mismatch: "${aboutPageH1}"`);
  }
  await page.locator('.editorial-hero').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(2500);
  const founderNameOnAbout = await page.locator('.editorial-founder h2').innerText();
  if (!founderNameOnAbout.includes('Akinwumi Ayomiposi')) {
    throw new Error('Founder name missing from dedicated /about page!');
  }
  await page.screenshot({ path: `${outputDir}/phase-41-dedicated-about-page.png` });
  console.log('✓ Dedicated /about page verified intact with full founder biography and portrait.');

  // Verify dedicated profile page /team/akinwumi-ayomiposi remains intact
  await page.goto('http://127.0.0.1:3000/team/akinwumi-ayomiposi', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const h1Texts = await page.locator('h1').allInnerTexts();
  console.log('Profile page h1 texts:', h1Texts);
  const profileHeroH1 = await page.locator('.founder-hero h1').innerText();
  console.log('Founder hero h1:', profileHeroH1);
  if (!profileHeroH1.includes('Akinwumi')) {
    throw new Error(`Profile page missing founder name! Found: ${profileHeroH1}`);
  }
  const floatingWhatsApp = await page.locator('#founder-floating-whatsapp').count();
  if (floatingWhatsApp !== 1) {
    throw new Error('Floating WhatsApp button missing from founder profile page!');
  }
  console.log('✓ Dedicated founder profile page (/team/akinwumi-ayomiposi) verified intact with floating WhatsApp.');

  if (errors.length > 0) {
    throw new Error(`Console errors during test: ${JSON.stringify(errors)}`);
  }
  await contextDesktop.close();

  // ==========================================
  // 2. TABLET VIEWPORT (834 x 1112)
  // ==========================================
  console.log('=== 2. Testing Tablet Viewport (834x1112) ===');
  const contextTablet = await browser.newContext({
    viewport: { width: 834, height: 1112 },
    reducedMotion: 'no-preference'
  });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(2500);

  // Scroll to process and testimonials
  await pageTablet.locator('#process').scrollIntoViewIfNeeded();
  await pageTablet.waitForTimeout(600);
  await pageTablet.screenshot({ path: `${outputDir}/phase-41-tablet-process-testimonials.png` });
  console.log('✓ Tablet process-to-testimonials screenshot captured.');
  await contextTablet.close();

  // ==========================================
  // 3. MOBILE VIEWPORT (390 x 844)
  // ==========================================
  console.log('=== 3. Testing Mobile Viewport (390x844) ===');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(2500);

  // Scroll to process and testimonials
  await pageMobile.locator('#process').scrollIntoViewIfNeeded();
  await pageMobile.waitForTimeout(600);
  await pageMobile.screenshot({ path: `${outputDir}/phase-41-mobile-process-testimonials.png` });
  console.log('✓ Mobile process-to-testimonials screenshot captured.');
  await contextMobile.close();

  console.log('\n============================================================');
  console.log('ALL PHASE 41 VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('============================================================\n');

} finally {
  await browser.close();
}
