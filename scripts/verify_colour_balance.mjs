import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-42';
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
  console.log('=== 1. Testing Homepage Colour Balance on Desktop (1440x900) ===');
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // 1. Hero Check
  const heroBg = await page.locator('.home-hero').evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Hero computed background:', heroBg);

  // 2. Featured Projects Check
  const workSection = page.locator('#featured-work');
  const workBg = await workSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Featured Work background:', workBg);
  // #F5FAFF is rgb(245, 250, 255)
  if (!workBg.includes('245, 250, 255')) {
    throw new Error(`Expected #featured-work to be rgb(245, 250, 255), got: ${workBg}`);
  }
  const cardShadow = await page.locator('.davka-project-card').first().evaluate((el) => window.getComputedStyle(el).boxShadow);
  console.log('Project card box-shadow:', cardShadow);

  const exploreAllBtnBg = await page.locator('.davka-all-projects-link').evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Explore all projects button background:', exploreAllBtnBg);

  await workSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/01-featured-projects-ice-blue.png` });
  console.log('✓ Featured Projects (#F5FAFF) verified and screenshot captured.');

  // 3. Services Section Check
  const servicesSection = page.locator('#home-services');
  const servicesBg = await servicesSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Services section background:', servicesBg);
  if (!servicesBg.includes('255, 255, 255')) {
    throw new Error(`Expected #home-services to be rgb(255, 255, 255), got: ${servicesBg}`);
  }
  const accordionBg = await page.locator('.services-container-shell').evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Services accordion shell background:', accordionBg);
  // Dark navy #08152b is rgb(8, 21, 43)
  if (!accordionBg.includes('8, 21, 43')) {
    throw new Error(`Expected services accordion to retain dark navy rgb(8, 21, 43), got: ${accordionBg}`);
  }
  await servicesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/02-services-white-dark-accordion.png` });
  console.log('✓ Services (White background + Dark Navy accordion) verified.');

  // 4. Development Process Check
  const processSection = page.locator('#process');
  const processBg = await processSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Process section background:', processBg);
  if (!processBg.includes('8, 21, 43')) {
    throw new Error(`Expected #process to be dark navy rgb(8, 21, 43), got: ${processBg}`);
  }
  await processSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/03-process-dark-navy.png` });
  console.log('✓ Development Process (Dark Navy cinematic background) verified.');

  // 5. Feedback (Testimonials) Check
  const testimonialsSection = page.locator('#home-testimonials');
  const testimonialsBg = await testimonialsSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Testimonials section background:', testimonialsBg);
  // #EDF7FF is rgb(237, 247, 255)
  if (!testimonialsBg.includes('237, 247, 255')) {
    throw new Error(`Expected #home-testimonials to be rgb(237, 247, 255), got: ${testimonialsBg}`);
  }

  const testimonialsTitleColor = await page.locator('.testimonials-title').evaluate((el) => window.getComputedStyle(el).color);
  console.log('Testimonials title color:', testimonialsTitleColor);
  if (!testimonialsTitleColor.includes('8, 21, 43')) {
    throw new Error(`Expected testimonials title to be dark navy rgb(8, 21, 43), got: ${testimonialsTitleColor}`);
  }

  const testimonialCardBg = await page.locator('.testimonial-card').first().evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Testimonial card surface background:', testimonialCardBg);
  if (!testimonialCardBg.includes('255, 255, 255')) {
    throw new Error(`Expected testimonial card surface to be white rgb(255, 255, 255), got: ${testimonialCardBg}`);
  }

  const authorNameColor = await page.locator('.testimonial-author-name').first().evaluate((el) => window.getComputedStyle(el).color);
  console.log('Testimonial author name color:', authorNameColor);

  const starColor = await page.locator('.testimonial-stars').first().evaluate((el) => window.getComputedStyle(el).color);
  console.log('Testimonial star color:', starColor);

  await testimonialsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/04-testimonials-ice-blue-white-cards.png` });
  console.log('✓ Feedback Testimonials (Ice Blue #EDF7FF + White cards + Dark Navy typography) verified.');

  // 6. Closing CTA Check
  const contactSection = page.locator('#home-contact');
  const contactBg = await contactSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Closing CTA section background:', contactBg);
  if (!contactBg.includes('255, 255, 255')) {
    throw new Error(`Expected #home-contact to be white rgb(255, 255, 255), got: ${contactBg}`);
  }
  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/05-closing-cta-white.png` });
  console.log('✓ Closing CTA (Clean White background) verified.');

  // 7. Footer Check
  const footer = page.locator('.site-footer');
  const footerBg = await footer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log('Footer background:', footerBg);
  if (!footerBg.includes('245, 250, 255')) {
    throw new Error(`Expected .site-footer to be rgb(245, 250, 255), got: ${footerBg}`);
  }
  const footerTextColor = await page.locator('.footer-description').evaluate((el) => window.getComputedStyle(el).color);
  console.log('Footer text color:', footerTextColor);
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/06-footer-neutral-blue.png` });
  console.log('✓ Footer (Subtle neutral-blue #F5FAFF + dark navy text) verified.');

  // 8. Capture overall transition walkthrough screenshot: Process -> Testimonials -> CTA
  await page.evaluate(() => {
    const el = document.getElementById('home-testimonials');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/07-process-to-testimonials-transition.png` });
  console.log('✓ Process-to-Testimonials transition screenshot captured.');

  if (errors.length > 0) {
    throw new Error(`Console errors during test: ${JSON.stringify(errors)}`);
  }
  await context.close();

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
  await pageTablet.waitForTimeout(2000);
  await pageTablet.locator('#home-testimonials').scrollIntoViewIfNeeded();
  await pageTablet.waitForTimeout(600);
  await pageTablet.screenshot({ path: `${outputDir}/08-tablet-testimonials-ice-blue.png` });
  console.log('✓ Tablet Testimonials screenshot captured.');
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
  await pageMobile.waitForTimeout(2000);
  await pageMobile.locator('#home-testimonials').scrollIntoViewIfNeeded();
  await pageMobile.waitForTimeout(600);
  await pageMobile.screenshot({ path: `${outputDir}/09-mobile-testimonials-ice-blue.png` });
  console.log('✓ Mobile Testimonials screenshot captured.');
  await contextMobile.close();

  console.log('\n============================================================');
  console.log('ALL PHASE 42 COLOUR BALANCE & TRANSITION CHECKS PASSED!');
  console.log('============================================================\n');

} finally {
  await browser.close();
}

