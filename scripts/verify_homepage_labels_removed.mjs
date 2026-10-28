import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-40';
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
  console.log('=== 1. Testing Homepage Labels Removal on Desktop (1440x900) ===');
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });

  const page = await contextDesktop.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  // Wait for preloader curtain reveal to finish
  await page.waitForTimeout(3500);

  // A. Check HERO HEADLINE
  const heroTitle = await page.locator('.cinema-title').innerText();
  console.log(`Hero Title: "${heroTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!heroTitle.includes('Digital Products') || !heroTitle.includes('Next.')) {
    throw new Error(`Hero title missing: "${heroTitle}"`);
  }
  console.log('✓ Hero Headline "Digital Products for What’s Next." is present and visible.');

  // B. Check FEATURED WORK SECTION
  const workSection = page.locator('#featured-work');
  await workSection.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(600);

  const workEyebrowCount = await page.locator('.davka-work-eyebrow').count();
  if (workEyebrowCount > 0) {
    throw new Error('Found .davka-work-eyebrow, expected it to be removed!');
  }
  const workHeaderHtml = await page.locator('.davka-work-header').innerHTML();
  if (workHeaderHtml.includes('Featured work')) {
    throw new Error('Found "Featured work" label in .davka-work-header, expected it to be removed!');
  }
  console.log('✓ "Featured work" eyebrow successfully removed.');

  const workTitle = await page.locator('#work-title').innerText();
  console.log(`Work Title: "${workTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!workTitle.includes('Real Projects.') || !workTitle.includes('Real Impact.')) {
    throw new Error(`Expected "Real Projects. Real Impact.", got "${workTitle}"`);
  }
  console.log('✓ Headline "Real Projects. Real Impact." is preserved.');

  await page.screenshot({ path: `${outputDir}/phase-40-desktop-work.png` });

  // C. Check SERVICES SECTION
  const servicesSection = page.locator('#home-services');
  await servicesSection.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(600);

  const servicesSectionHtml = await servicesSection.innerHTML();
  if (servicesSectionHtml.toLowerCase().includes('our services / from thought to product') ||
      servicesSectionHtml.includes('from thought to product')) {
    throw new Error('Found "Our services / from thought to product" in #home-services, expected it to be removed!');
  }
  console.log('✓ "Our Services / From Thought to Product" eyebrow successfully removed.');

  const servicesTitle = await page.locator('#services-title').innerText();
  console.log(`Services Title: "${servicesTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!servicesTitle.includes('What We') || !servicesTitle.includes('Bring to Life.')) {
    throw new Error(`Expected "What We Bring to Life.", got "${servicesTitle}"`);
  }
  console.log('✓ Headline "What We Bring to Life." is preserved.');

  await page.screenshot({ path: `${outputDir}/phase-40-desktop-services.png` });

  // D. Check PROCESS SECTION
  const processSection = page.locator('#process');
  await processSection.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(600);

  const processEyebrowCount = await page.locator('.process-eyebrow').count();
  if (processEyebrowCount > 0) {
    throw new Error('Found .process-eyebrow, expected it to be removed!');
  }
  const processHeaderHtml = await page.locator('.process-section-header').innerHTML();
  if (processHeaderHtml.includes('process-dot') || processHeaderHtml.includes('<span>Process</span>')) {
    throw new Error('Found "Process" eyebrow label in .process-section-header, expected it to be removed!');
  }
  console.log('✓ "Process" eyebrow successfully removed.');

  const processTitle = await page.locator('#process-heading').innerText();
  console.log(`Process Title: "${processTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!processTitle.includes('From Idea') || !processTitle.includes('to Impact.')) {
    throw new Error(`Expected "From Idea to Impact.", got "${processTitle}"`);
  }
  console.log('✓ Headline "From Idea to Impact." is preserved.');

  await page.screenshot({ path: `${outputDir}/phase-40-desktop-process.png` });

  // E. Check FOUNDER / STUDIO SECTION
  const founderSection = page.locator('#home-founder');
  await founderSection.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(1600);

  const founderLeftCol = page.locator('#home-founder .founder-grid > div:first-child');
  const founderLeftEyebrowCount = await founderLeftCol.locator('.eyebrow').count();
  if (founderLeftEyebrowCount > 0) {
    throw new Error('Found .eyebrow in left column of #home-founder, expected it to be removed!');
  }
  const founderLeftHtml = await founderLeftCol.innerHTML();
  if (founderLeftHtml.includes('About MOTEKRA / Creative Technologist') || founderLeftHtml.includes('Creative Technologist')) {
    throw new Error('Found "About MOTEKRA / Creative Technologist" eyebrow above founder heading, expected it to be removed!');
  }
  console.log('✓ "About MOTEKRA / Creative Technologist" eyebrow successfully removed from left column.');

  const ctaBtnText = await founderLeftCol.locator('a.button').innerText();
  if (!ctaBtnText.includes('More About MOTEKRA')) {
    throw new Error('Expected "More About MOTEKRA" CTA button to be preserved!');
  }
  console.log('✓ CTA button "More About MOTEKRA" preserved.');

  const founderTitle = await page.locator('#founder-title').innerText();
  console.log(`Founder/Studio Title: "${founderTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!founderTitle.includes('A Studio') || !founderTitle.includes('What’s Next.')) {
    throw new Error(`Expected "A Studio for What's Next.", got "${founderTitle}"`);
  }
  console.log('✓ Headline "A Studio for What’s Next." is preserved.');

  // Verify Founder byline details remain preserved in right column
  const founderBylineName = await page.locator('#home-founder .founder-byline .eyebrow').innerText();
  const founderBylineRole = await page.locator('#home-founder .founder-byline h3').innerText();
  const founderBylineBrand = await page.locator('#home-founder .founder-byline > p:not(.eyebrow)').innerText();
  const founderProfileLink = await page.locator('#home-founder .founder-byline a.text-link').getAttribute('href');

  console.log(`Founder Byline Name: "${founderBylineName}"`);
  console.log(`Founder Byline Role: "${founderBylineRole.replace(/\s+/g, ' ').trim()}"`);
  console.log(`Founder Byline Link: "${founderProfileLink}"`);

  if (!founderBylineName.toLowerCase().includes('akinwumi ayomiposi')) throw new Error('Founder byline name missing!');
  if (!founderBylineRole.includes('Software Developer') || !founderBylineRole.includes('Creative Technologist')) {
    throw new Error('Founder byline role missing!');
  }
  if (!founderBylineBrand.includes('MOTEKRA')) throw new Error('Founder byline MOTEKRA tag missing!');
  if (founderProfileLink !== '/team/akinwumi-ayomiposi') throw new Error('Founder profile link missing!');
  console.log('✓ Founder byline card in editorial column perfectly preserved.');

  await page.screenshot({ path: `${outputDir}/phase-40-desktop-founder.png` });

  // F. Check TESTIMONIALS SECTION
  const testimonialsSection = page.locator('#home-testimonials');
  await testimonialsSection.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(600);

  const testimonialsBadgeCount = await page.locator('.testimonials-badge').count();
  if (testimonialsBadgeCount > 0) {
    throw new Error('Found .testimonials-badge, expected it to be removed!');
  }
  console.log('✓ "Testimonials" badge successfully removed.');

  const testimonialsTitle = await page.locator('#testimonials-title').innerText();
  console.log(`Testimonials Title: "${testimonialsTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!testimonialsTitle.includes('Feedback that fuels us')) {
    throw new Error(`Expected "Feedback that fuels us", got "${testimonialsTitle}"`);
  }
  console.log('✓ Headline "Feedback that fuels us" is preserved.');

  await page.screenshot({ path: `${outputDir}/phase-40-desktop-testimonials.png` });

  // G. Check CONTACT SECTION
  const contactSection = page.locator('#home-contact');
  await contactSection.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(600);

  const contactCopyHtml = await page.locator('#home-contact .contact-copy').innerHTML();
  if (contactCopyHtml.includes('Let’s create the next perspective') || contactCopyHtml.includes('create the next perspective')) {
    throw new Error('Found "Let’s create the next perspective" eyebrow, expected it to be removed!');
  }
  console.log('✓ "Let’s create the next perspective" eyebrow successfully removed.');

  const contactTitle = await page.locator('#contact-title').innerText();
  console.log(`Contact Title: "${contactTitle.replace(/\s+/g, ' ').trim()}"`);
  if (!contactTitle.includes('Have Something') || !contactTitle.includes('in Mind?')) {
    throw new Error(`Expected "Have Something in Mind?", got "${contactTitle}"`);
  }
  console.log('✓ Headline "Have Something in Mind?" is preserved.');

  await page.screenshot({ path: `${outputDir}/phase-40-desktop-contact.png` });

  if (errors.length > 0) {
    throw new Error(`Console errors on desktop: ${JSON.stringify(errors)}`);
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
  await pageTablet.waitForTimeout(3000);

  await pageTablet.screenshot({ path: `${outputDir}/phase-40-tablet-full.png`, fullPage: false });
  console.log('✓ Tablet viewport screenshot captured.');
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
  await pageMobile.waitForTimeout(3000);

  await pageMobile.screenshot({ path: `${outputDir}/phase-40-mobile-full.png`, fullPage: false });
  console.log('✓ Mobile viewport screenshot captured.');
  await contextMobile.close();

  console.log('\n============================================================');
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('============================================================\n');

} finally {
  await browser.close();
}
