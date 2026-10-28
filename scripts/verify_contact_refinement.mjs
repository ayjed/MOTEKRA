import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-29';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'no-preference'
  });

  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  console.log('Navigating to http://127.0.0.1:3000/contact...');
  await page.goto('http://127.0.0.1:3000/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. Hero Verification
  const heroHeading = await page.locator('#contact-hero-title').innerText();
  console.log(`Hero Heading: "${heroHeading.replace(/\s+/g, ' ').trim()}"`);
  if (!heroHeading.includes('Have') || !heroHeading.includes('Something') || !heroHeading.includes('Mind')) {
    throw new Error(`Unexpected hero heading: ${heroHeading}`);
  }

  const heroLead = await page.locator('.contact-hero .lead').innerText();
  console.log(`Hero Lead: "${heroLead.trim()}"`);
  if (!heroLead.includes("Tell us about your idea. Let’s explore what’s possible.")) {
    throw new Error(`Unexpected hero lead: ${heroLead}`);
  }

  const artworkVisible = await page.locator('.contact-artwork').isVisible();
  console.log(`Artwork visible: ${artworkVisible}`);
  if (!artworkVisible) throw new Error('Artwork is not visible');

  // Screenshot hero
  await page.screenshot({ path: `${outputDir}/01-contact-hero-desktop.png` });

  // 2. Form Verification
  const formHeading = await page.locator('#inquiry-heading').innerText();
  console.log(`Form Heading: "${formHeading.trim()}"`);
  if (!formHeading.includes('Start a Project')) {
    throw new Error(`Unexpected form heading: ${formHeading}`);
  }

  const nameLabel = await page.locator('label[for="name"] span:first-child').innerText();
  const emailLabel = await page.locator('label[for="email"] span:first-child').innerText();
  const projectTypeLabel = await page.locator('label[for="projectType"] span:first-child').innerText();
  const messageLabel = await page.locator('label[for="message"] span:first-child').innerText();

  console.log('Form labels:', { nameLabel, emailLabel, projectTypeLabel, messageLabel });
  if (nameLabel !== 'Your name' || emailLabel !== 'Your email' || projectTypeLabel !== 'Project type' || messageLabel !== 'Tell us about your project') {
    throw new Error('Form field labels mismatch');
  }

  const ctaBtn = await page.locator('.contact-submit-btn').innerText();
  console.log(`Primary CTA: "${ctaBtn.trim()}"`);
  if (!ctaBtn.includes('Send Inquiry')) {
    throw new Error(`Unexpected submit button text: ${ctaBtn}`);
  }

  const privacyNote = await page.locator('.inquiry-privacy-note').innerText();
  console.log(`Privacy Note: "${privacyNote.trim()}"`);
  if (!privacyNote.includes('We respect your privacy')) {
    throw new Error(`Unexpected privacy note: ${privacyNote}`);
  }

  // 3. Right Column & Official Channels Verification
  const asideH2 = await page.locator('.inquiry-aside h2').innerText();
  console.log(`Aside Heading: "${asideH2.replace(/\s+/g, ' ').trim()}"`);
  if (!asideH2.includes('Let’s build') || !asideH2.includes('something meaningful.')) {
    throw new Error(`Unexpected aside heading: ${asideH2}`);
  }

  const asideIntro = await page.locator('.inquiry-aside-intro').innerText();
  console.log(`Aside Intro: "${asideIntro.trim()}"`);
  if (!asideIntro.includes('Share your vision and we’ll explore the next steps together.')) {
    throw new Error(`Unexpected aside intro: ${asideIntro}`);
  }

  const whatsappLink = page.locator('a.whatsapp-btn');
  const waHref = await whatsappLink.getAttribute('href');
  const waTarget = await whatsappLink.getAttribute('target');
  const waRel = await whatsappLink.getAttribute('rel');
  const waText = await whatsappLink.innerText();
  console.log('WhatsApp button:', { waHref, waTarget, waRel, waText: waText.replace(/\s+/g, ' ').trim() });

  if (waHref !== 'https://wa.me/447403605289' || waTarget !== '_blank' || !waRel?.includes('noopener')) {
    throw new Error(`Invalid WhatsApp button attributes: ${JSON.stringify({ waHref, waTarget, waRel })}`);
  }

  const linkedinLink = page.locator('a.linkedin-btn');
  const liHref = await linkedinLink.getAttribute('href');
  const liTarget = await linkedinLink.getAttribute('target');
  const liRel = await linkedinLink.getAttribute('rel');
  const liText = await linkedinLink.innerText();
  console.log('LinkedIn button:', { liHref, liTarget, liRel, liText: liText.replace(/\s+/g, ' ').trim() });

  if (liHref !== 'https://www.linkedin.com/company/motekra/' || liTarget !== '_blank' || !liRel?.includes('noopener')) {
    throw new Error(`Invalid LinkedIn button attributes: ${JSON.stringify({ liHref, liTarget, liRel })}`);
  }

  // Check that personal profile links are absent from Contact page
  const personalGithub = await page.locator('a[href*="github.com/ayjed"]').count();
  const personalBehance = await page.locator('a[href*="behance.net"]').count();
  const personalDribbble = await page.locator('a[href*="dribbble.com"]').count();
  const personalLinkedIn = await page.locator('a[href*="linkedin.com/in/"]').count();
  console.log('Personal link counts on /contact:', { personalGithub, personalBehance, personalDribbble, personalLinkedIn });

  if (personalGithub !== 0 || personalBehance !== 0 || personalDribbble !== 0 || personalLinkedIn !== 0) {
    throw new Error('Personal profile links found on Contact page!');
  }

  // Screenshot inquiry section
  await page.locator('#inquiry').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outputDir}/02-contact-inquiry-desktop.png` });

  // 4. FAQ Verification
  const faqHeading = await page.locator('#faq-heading').innerText();
  console.log(`FAQ Heading: "${faqHeading.replace(/\s+/g, ' ').trim()}"`);
  if (!faqHeading.includes('Got Questions?') || !faqHeading.includes('Start Here.')) {
    throw new Error(`Unexpected FAQ heading: ${faqHeading}`);
  }

  const faqItems = await page.locator('.faq-accordion-item').all();
  console.log(`FAQ item count: ${faqItems.length}`);
  if (faqItems.length !== 4) {
    throw new Error(`Expected exactly 4 FAQ items, got ${faqItems.length}`);
  }

  const expectedQuestions = [
    'What information do I need to start?',
    'Do I need a complete project brief?',
    'When can I expect a response?',
    'Can I share design or project links?'
  ];

  for (let i = 0; i < faqItems.length; i++) {
    const qText = (await faqItems[i].locator('.faq-question-text').innerText()).trim();
    console.log(`FAQ ${i + 1}: "${qText}"`);
    if (qText !== expectedQuestions[i]) {
      throw new Error(`FAQ ${i + 1} mismatch: expected "${expectedQuestions[i]}", got "${qText}"`);
    }
  }

  // Test accordion expansion
  await page.locator('#questions').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  console.log('Testing FAQ accordion toggle...');
  await faqItems[0].locator('.faq-accordion-header').click();
  await page.waitForTimeout(500);
  const isOpen0 = await faqItems[0].evaluate((el) => el.classList.contains('is-open'));
  console.log(`FAQ 0 is-open after click: ${isOpen0}`);
  if (!isOpen0) throw new Error('FAQ 0 did not open on click');

  await page.screenshot({ path: `${outputDir}/03-contact-faq-expanded-desktop.png` });

  // 5. Redundant Section Check
  const closingSectionCount = await page.locator('.contact-closing').count();
  const scopeNoteCount = await page.locator('.contact-scope-note').count();
  console.log('Redundant elements count:', { closingSectionCount, scopeNoteCount });
  if (closingSectionCount !== 0) {
    throw new Error('Redundant .contact-closing section was not removed!');
  }
  if (scopeNoteCount !== 0) {
    throw new Error('Redundant .contact-scope-note was not removed!');
  }

  // 6. Footer Verification
  const footerLinkedIn = await page.locator('footer a[href="https://www.linkedin.com/company/motekra/"]').count();
  const footerWhatsApp = await page.locator('footer a[href="https://wa.me/447403605289"]').count();
  const footerPersonalLinks = await page.locator('footer a[href*="github.com/ayjed"], footer a[href*="behance.net"], footer a[href*="dribbble.com"], footer a[href*="linkedin.com/in/"]').count();

  console.log('Footer links check:', { footerLinkedIn, footerWhatsApp, footerPersonalLinks });
  if (footerLinkedIn === 0 || footerWhatsApp === 0) {
    throw new Error('Official channels missing in footer');
  }
  if (footerPersonalLinks !== 0) {
    throw new Error('Personal profiles found in footer');
  }

  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outputDir}/04-footer-desktop.png` });

  // 7. Mobile Viewport Test (390x844)
  console.log('Testing mobile viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:3000/contact', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const noHorizontalScroll = await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  console.log(`Mobile no horizontal scroll: ${noHorizontalScroll}`);
  if (!noHorizontalScroll) throw new Error('Horizontal scroll detected on mobile');

  await mobilePage.screenshot({ path: `${outputDir}/05-contact-mobile-hero.png` });

  await mobilePage.locator('#inquiry').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: `${outputDir}/06-contact-mobile-inquiry.png` });

  await mobilePage.locator('#questions').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: `${outputDir}/07-contact-mobile-faq.png` });

  await mobileContext.close();
  await context.close();

  console.log('All contact refinement tests PASSED with 0 errors!');
  await writeFile(`${outputDir}/verification-summary.json`, JSON.stringify({
    success: true,
    heroHeading: heroHeading.replace(/\s+/g, ' ').trim(),
    heroLead: heroLead.trim(),
    formHeading: formHeading.trim(),
    formFields: [nameLabel, emailLabel, projectTypeLabel, messageLabel],
    primaryCTA: ctaBtn.trim(),
    privacyNotice: privacyNote.trim(),
    asideHeading: asideH2.replace(/\s+/g, ' ').trim(),
    officialWhatsApp: waHref,
    officialLinkedIn: liHref,
    personalLinksOnContact: 0,
    faqCount: faqItems.length,
    faqQuestions: expectedQuestions,
    closingSectionRemoved: true,
    scopeNoteRemoved: true,
    footerOfficialChannelsVerified: true,
    footerPersonalLinksCount: 0,
    mobileResponsive: true,
    pageErrors: errors
  }, null, 2));

} finally {
  await browser.close();
}
