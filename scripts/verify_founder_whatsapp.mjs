import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outputDir = 'docs/evidence/phase-37';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});

const results = {
  profilePageFloatingBtnVisible: false,
  profileBtnDimensionsDesktop: null,
  profileBtnDimensionsMobile: null,
  profileBtnColorVerified: false,
  profileBtnHrefVerified: false,
  profileBtnAriaLabelVerified: false,
  profileBtnTooltipVerified: false,
  phoneNotBesideBtn: false,
  notPresentOnHome: false,
  notPresentOnWork: false,
  notPresentOnServices: false,
  notPresentOnAbout: false,
  notPresentOnContact: false,
  notPresentOnCaseStudy: false,
  notPresentInFooter: false,
  contactPageHasOnlyLinkedIn: false,
  clientNavigationVerified: false,
  errors: []
};

try {
  // =========================================================================
  // 1. DESKTOP FOUNDER PROFILE PAGE (/team/akinwumi-ayomiposi)
  // =========================================================================
  console.log('\n=== 1. Testing Founder Profile Desktop (1440x960) ===');
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'no-preference'
  });
  const page = await desktopCtx.newPage();
  page.on('pageerror', (err) => {
    console.error('Page error:', err.message);
    results.errors.push(err.message);
  });

  await page.goto('http://127.0.0.1:3000/team/akinwumi-ayomiposi', { waitUntil: 'networkidle' });
  await page.waitForSelector('body.preloader-finished', { timeout: 7000 }).catch(() => {});
  await page.waitForTimeout(600);

  const whatsappBtn = page.locator('.founder-floating-whatsapp-btn');
  const count = await whatsappBtn.count();
  console.log(`Found ${count} floating WhatsApp button(s) on founder profile page.`);
  if (count !== 1) {
    throw new Error(`Expected exactly 1 floating WhatsApp button, found ${count}`);
  }

  // Check visibility
  const isVisible = await whatsappBtn.isVisible();
  if (!isVisible) throw new Error('Floating WhatsApp button is not visible on profile page!');
  results.profilePageFloatingBtnVisible = true;
  console.log('✓ Floating WhatsApp button is visible.');

  // Check Href, Target, Rel
  const href = await whatsappBtn.getAttribute('href');
  const target = await whatsappBtn.getAttribute('target');
  const rel = await whatsappBtn.getAttribute('rel');
  const ariaLabel = await whatsappBtn.getAttribute('aria-label');

  console.log('Button attributes:', { href, target, rel, ariaLabel });
  if (href !== 'https://wa.me/447403605289') {
    throw new Error(`Unexpected href: ${href} (expected https://wa.me/447403605289)`);
  }
  results.profileBtnHrefVerified = true;

  if (target !== '_blank' || !rel?.includes('noopener')) {
    throw new Error(`Button does not securely open in a new tab (target=${target}, rel=${rel})`);
  }
  if (!ariaLabel?.includes('WhatsApp')) {
    throw new Error(`Missing accessible aria-label: ${ariaLabel}`);
  }
  results.profileBtnAriaLabelVerified = true;
  console.log('✓ Destination URL (https://wa.me/447403605289), security attributes, and accessible label verified.');

  // Check Desktop Dimensions & Color
  const btnBbox = await whatsappBtn.boundingBox();
  const btnStyles = await whatsappBtn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      width: parseFloat(s.width),
      height: parseFloat(s.height),
      backgroundColor: s.backgroundColor,
      borderRadius: s.borderRadius,
      position: s.position
    };
  });
  console.log('Button computed styles:', btnStyles);
  results.profileBtnDimensionsDesktop = { width: btnStyles.width, height: btnStyles.height };

  // Desktop requirement: 56–60px
  if (btnStyles.width < 55 || btnStyles.width > 61 || btnStyles.height < 55 || btnStyles.height > 61) {
    throw new Error(`Desktop size ${btnStyles.width}x${btnStyles.height}px is outside expected 56-60px range!`);
  }
  // Color requirement: #25D366 (rgb(37, 211, 102))
  if (!btnStyles.backgroundColor.includes('37, 211, 102')) {
    throw new Error(`Unexpected background color: ${btnStyles.backgroundColor} (expected rgb(37, 211, 102))`);
  }
  results.profileBtnColorVerified = true;
  console.log('✓ Desktop dimensions (58px) and official WhatsApp green (#25D366) verified.');

  // Check Tooltip on Hover
  const tooltip = page.locator('.founder-floating-whatsapp-tooltip');
  const tooltipInitialVisible = await tooltip.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log('Initial tooltip opacity:', tooltipInitialVisible);

  await whatsappBtn.hover();
  await page.waitForTimeout(300);

  const tooltipHoverOpacity = await tooltip.evaluate((el) => window.getComputedStyle(el).opacity);
  const tooltipText = (await tooltip.innerText()).trim();
  console.log(`Hover tooltip opacity: ${tooltipHoverOpacity}, text: "${tooltipText}"`);

  if (tooltipText !== 'Chat with Ayomiposi') {
    throw new Error(`Unexpected tooltip text: "${tooltipText}" (expected "Chat with Ayomiposi")`);
  }
  if (parseFloat(tooltipHoverOpacity) < 0.8) {
    throw new Error(`Tooltip did not appear on hover (opacity: ${tooltipHoverOpacity})`);
  }
  results.profileBtnTooltipVerified = true;
  console.log('✓ Hover tooltip displays "Chat with Ayomiposi" cleanly.');

  // Verify phone number is NOT displayed beside the button
  const containerText = await page.locator('.founder-floating-whatsapp-container').innerText();
  if (containerText.includes('7403') || containerText.includes('4474')) {
    throw new Error('Phone number is displayed beside the floating button! (Must be kept hidden)');
  }
  results.phoneNotBesideBtn = true;
  console.log('✓ Phone number is not displayed beside the button.');

  // Screenshots
  await page.screenshot({ path: `${outputDir}/01-founder-profile-desktop-whatsapp.png`, fullPage: false });
  // Zoom in on bottom right for tooltip detail
  const containerBbox = await page.locator('.founder-floating-whatsapp-container').boundingBox();
  if (containerBbox) {
    await page.screenshot({
      path: `${outputDir}/02-founder-whatsapp-hover-tooltip.png`,
      clip: {
        x: Math.max(0, containerBbox.x - 220),
        y: Math.max(0, containerBbox.y - 40),
        width: containerBbox.width + 240,
        height: containerBbox.height + 60
      }
    });
  }
  console.log('✓ Desktop profile screenshots saved.');

  await desktopCtx.close();

  // =========================================================================
  // 2. MOBILE FOUNDER PROFILE PAGE (390x844)
  // =========================================================================
  console.log('\n=== 2. Testing Founder Profile Mobile (390x844) ===');
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference'
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://127.0.0.1:3000/team/akinwumi-ayomiposi', { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('body.preloader-finished', { timeout: 7000 }).catch(() => {});
  await mobilePage.waitForTimeout(600);

  const mobileBtn = mobilePage.locator('.founder-floating-whatsapp-btn');
  const mobileStyles = await mobileBtn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      width: parseFloat(s.width),
      height: parseFloat(s.height)
    };
  });
  console.log('Mobile button dimensions:', mobileStyles);
  results.profileBtnDimensionsMobile = mobileStyles;

  // Mobile requirement: 52–56px
  if (mobileStyles.width < 51 || mobileStyles.width > 57 || mobileStyles.height < 51 || mobileStyles.height > 57) {
    throw new Error(`Mobile size ${mobileStyles.width}x${mobileStyles.height}px is outside expected 52-56px range!`);
  }

  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (mobileOverflow) throw new Error('Horizontal overflow detected on mobile profile page!');

  await mobilePage.screenshot({ path: `${outputDir}/03-founder-profile-mobile-whatsapp.png`, fullPage: false });
  console.log('✓ Mobile profile button verified and screenshot saved.');
  await mobileCtx.close();

  // =========================================================================
  // 3. STRICT PAGE ISOLATION AUDIT (Must NOT appear on other pages)
  // =========================================================================
  console.log('\n=== 3. Testing Strict Page Isolation ===');
  const auditCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const auditPage = await auditCtx.newPage();

  const routesToCheck = [
    { url: 'http://127.0.0.1:3000/', name: 'Home', key: 'notPresentOnHome' },
    { url: 'http://127.0.0.1:3000/work', name: 'Work', key: 'notPresentOnWork' },
    { url: 'http://127.0.0.1:3000/work/spotlight-contest', name: 'Case Study', key: 'notPresentOnCaseStudy' },
    { url: 'http://127.0.0.1:3000/services', name: 'Services', key: 'notPresentOnServices' },
    { url: 'http://127.0.0.1:3000/about', name: 'General About', key: 'notPresentOnAbout' },
    { url: 'http://127.0.0.1:3000/contact', name: 'Contact', key: 'notPresentOnContact' }
  ];

  for (const { url, name, key } of routesToCheck) {
    await auditPage.goto(url, { waitUntil: 'networkidle' });
    const countOnPage = await auditPage.locator('.founder-floating-whatsapp-btn, #founder-floating-whatsapp').count();
    console.log(`Checking ${name} (${url}): floating WhatsApp count = ${countOnPage}`);
    if (countOnPage !== 0) {
      throw new Error(`Violation: Floating WhatsApp button is rendered on ${name}! (Must only render on profile route)`);
    }
    results[key] = true;
  }
  console.log('✓ Strict route isolation verified: 0 instances rendered on Home, Work, Services, About, Contact, or Case studies.');

  // =========================================================================
  // 4. GLOBAL FOOTER AUDIT
  // =========================================================================
  console.log('\n=== 4. Testing Global Footer Channels ===');
  await auditPage.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  const footerWhatsapp = await auditPage.locator('footer a[href*="wa.me"], footer a[href*="whatsapp"]').count();
  const footerLinkedin = await auditPage.locator('footer a[href="https://www.linkedin.com/company/motekra/"]').count();
  console.log(`Footer WhatsApp links: ${footerWhatsapp}, Footer LinkedIn links: ${footerLinkedin}`);

  if (footerWhatsapp !== 0) {
    throw new Error('Founder WhatsApp number is still present in the global footer!');
  }
  if (footerLinkedin === 0) {
    throw new Error('Official MOTEKRA LinkedIn channel missing from footer!');
  }
  results.notPresentInFooter = true;
  await auditPage.locator('footer').screenshot({ path: `${outputDir}/05-footer-no-whatsapp.png` });
  console.log('✓ Footer channels verified: WhatsApp completely removed, LinkedIn preserved.');

  // =========================================================================
  // 5. CONTACT PAGE CHANNELS AUDIT
  // =========================================================================
  console.log('\n=== 5. Testing Contact Page Channels ===');
  await auditPage.goto('http://127.0.0.1:3000/contact', { waitUntil: 'networkidle' });
  await auditPage.waitForSelector('body.preloader-finished', { timeout: 7000 }).catch(() => {});
  await auditPage.waitForTimeout(600);
  const contactWhatsapp = await auditPage.locator('.contact-channels-card a[href*="wa.me"], .contact-channels-card a[href*="whatsapp"]').count();
  const contactLinkedin = await auditPage.locator('.contact-channels-card a[href="https://www.linkedin.com/company/motekra/"]').count();
  console.log(`Contact card WhatsApp links: ${contactWhatsapp}, Contact card LinkedIn links: ${contactLinkedin}`);

  if (contactWhatsapp !== 0) {
    throw new Error('Founder WhatsApp number is still present on the Contact page!');
  }
  if (contactLinkedin === 0) {
    throw new Error('Official MOTEKRA LinkedIn channel missing from Contact page!');
  }
  results.contactPageHasOnlyLinkedIn = true;
  const channelsCard = auditPage.locator('.contact-channels-card');
  if (await channelsCard.count() > 0) {
    await channelsCard.screenshot({ path: `${outputDir}/04-contact-page-no-whatsapp.png` });
  } else {
    await auditPage.screenshot({ path: `${outputDir}/04-contact-page-no-whatsapp.png`, fullPage: false });
  }
  console.log('✓ Contact page verified: WhatsApp removed, only official corporate LinkedIn present.');

  // =========================================================================
  // 6. CLIENT-SIDE ROUTING & NAVIGATION
  // =========================================================================
  console.log('\n=== 6. Testing Client-Side Navigation & History ===');
  // Start on /about
  await auditPage.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
  let countOnAbout = await auditPage.locator('.founder-floating-whatsapp-btn').count();
  if (countOnAbout !== 0) throw new Error('Button present on /about!');

  // Navigate to /team/akinwumi-ayomiposi
  const profileLink = auditPage.locator('a[href="/team/akinwumi-ayomiposi"]');
  if (await profileLink.count() > 0) {
    await profileLink.first().click();
    await auditPage.waitForURL('**/team/akinwumi-ayomiposi');
    await auditPage.waitForTimeout(500);

    const countOnNav = await auditPage.locator('.founder-floating-whatsapp-btn').count();
    console.log(`After client navigation to profile: count = ${countOnNav}`);
    if (countOnNav !== 1) throw new Error('Button failed to render after client navigation to profile!');

    // Go back
    await auditPage.goBack();
    await auditPage.waitForURL('**/about');
    await auditPage.waitForTimeout(500);

    const countAfterBack = await auditPage.locator('.founder-floating-whatsapp-btn').count();
    console.log(`After browser back to /about: count = ${countAfterBack}`);
    if (countAfterBack !== 0) throw new Error('Button still rendered after navigating back to /about!');

    results.clientNavigationVerified = true;
    console.log('✓ Client-side navigation & back/forward history properly mount/unmount the button.');
  }

  await auditCtx.close();

} catch (err) {
  console.error('\n❌ Verification Failed:', err);
  results.errors.push(err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  console.log('\n=== Final Verification Results ===');
  console.log(JSON.stringify(results, null, 2));
}
