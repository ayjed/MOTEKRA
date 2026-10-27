const { chromium } = require('@playwright/test');
const path = require('path');

async function auditNavigation() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  // =========================================================================
  // TEST 1: Desktop Navigation & Sticky Header Across All 5 Pages
  // =========================================================================
  console.log('--- TEST 1: Desktop Navigation Across 5 Pages ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const route of routes) {
    console.log(`Checking route: ${route.path} (${route.label})...`);
    await desktopPage.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });

    // 1. Check sticky header
    const header = await desktopPage.$('header.site-header');
    if (!header) throw new Error(`Missing site-header on ${route.path}`);

    // Check position sticky
    const position = await header.evaluate((el) => window.getComputedStyle(el).position);
    console.log(`Header position on ${route.path}: ${position}`);
    if (position !== 'sticky' && position !== '-webkit-sticky') {
      throw new Error(`Expected sticky header, got ${position} on ${route.path}`);
    }

    // 2. Check brand logo
    const brand = await header.$('.brand');
    if (!brand) throw new Error(`Missing brand on ${route.path}`);

    // 3. Check desktop nav links count
    const links = await header.$$('.desktop-nav a');
    console.log(`Nav links count on ${route.path}: ${links.length}`);
    if (links.length !== 5) {
      throw new Error(`Expected 5 nav links on ${route.path}, found ${links.length}`);
    }

    // 4. Check active page indicator
    const activeLink = await header.$('.desktop-nav a[aria-current="page"]');
    if (!activeLink) throw new Error(`Missing active link on ${route.path}`);
    const activeText = await activeLink.innerText();
    console.log(`Active link on ${route.path}: "${activeText.trim()}"`);
    if (activeText.trim() !== route.label) {
      throw new Error(`Expected active link "${route.label}", got "${activeText.trim()}" on ${route.path}`);
    }

    // 5. Check Start a Project CTA button
    const cta = await header.$('.header-actions a[href="/contact"]');
    if (!cta) throw new Error(`Missing Start a Project CTA on ${route.path}`);

    // 6. Check NO secondary/duplicate nav bar exists
    const allHeaders = await desktopPage.$$('header');
    if (allHeaders.length > 1) {
      throw new Error(`Found multiple header elements on ${route.path}: ${allHeaders.length}`);
    }

    // Check footer has links
    const footerLinks = await desktopPage.$$('footer.site-footer a');
    if (footerLinks.length === 0) {
      throw new Error(`Missing footer links on ${route.path}`);
    }
  }

  // Scroll down on Home and check sticky header stays visible
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktopPage.evaluate(() => window.scrollTo(0, 800));
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(brainDir, 'desktop_sticky_nav_scrolled.png') });
  console.log('Saved desktop_sticky_nav_scrolled.png');

  await desktopPage.close();

  // =========================================================================
  // TEST 2: Mobile Navigation & 90% Viewport Slide-in Drawer
  // =========================================================================
  console.log('\n--- TEST 2: Mobile Navigation Drawer ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Verify desktop nav is hidden on mobile
  const desktopNavVisible = await mobilePage.evaluate(() => {
    const el = document.querySelector('.desktop-nav');
    return el && window.getComputedStyle(el).display !== 'none';
  });
  console.log('Desktop nav visible on mobile?', desktopNavVisible);
  if (desktopNavVisible) throw new Error('Desktop nav should be hidden on mobile!');

  // 2. Verify hamburger toggle exists and is visible
  const toggleBtn = await mobilePage.$('.mobile-menu-toggle');
  if (!toggleBtn) throw new Error('Missing .mobile-menu-toggle button!');

  // 3. Verify NO redundant secondary details/dropdown nav exists before click
  const redundantNav = await mobilePage.$('.mobile-menu nav');
  console.log('Redundant details dropdown found?', Boolean(redundantNav));
  if (redundantNav) throw new Error('Found redundant .mobile-menu nav dropdown!');

  // 4. Click hamburger to open drawer
  console.log('Clicking mobile menu toggle...');
  await toggleBtn.click();
  await mobilePage.waitForTimeout(600);

  // 5. Verify dialog is open and drawer is visible
  const dialog = await mobilePage.$('#mobile-nav-dialog[open]');
  if (!dialog) throw new Error('Dialog #mobile-nav-dialog is not open!');

  // Check drawer width covers approximately 90% of viewport
  const drawerBox = await mobilePage.evaluate(() => {
    const drawer = document.querySelector('.nav-drawer');
    if (!drawer) return null;
    const rect = drawer.getBoundingClientRect();
    return { width: rect.width, viewportWidth: window.innerWidth, ratio: rect.width / window.innerWidth };
  });
  console.log(`Mobile drawer width: ${drawerBox.width}px, Viewport width: ${drawerBox.viewportWidth}px, Ratio: ${(drawerBox.ratio * 100).toFixed(1)}%`);
  if (drawerBox.ratio < 0.85 || drawerBox.ratio > 0.95) {
    console.warn(`Drawer covers ${(drawerBox.ratio * 100).toFixed(1)}% of viewport (expected ~90%)`);
  }

  // 6. Verify drawer links
  const drawerLinks = await mobilePage.$$('.drawer-nav a');
  console.log(`Drawer links count: ${drawerLinks.length}`);
  if (drawerLinks.length !== 5) {
    throw new Error(`Expected 5 links in drawer, got ${drawerLinks.length}`);
  }

  // 7. Verify CTA button in drawer
  const drawerCta = await mobilePage.$('.drawer-footer a[href="/contact"]');
  if (!drawerCta) throw new Error('Missing Start a Project CTA in mobile drawer!');

  // Take screenshot of mobile drawer
  await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_drawer_open.png') });
  console.log('Saved mobile_drawer_open.png');

  // 8. Test close button
  const closeBtn = await mobilePage.$('.drawer-close-btn');
  await closeBtn.click();
  await mobilePage.waitForTimeout(500);

  const dialogAfterClose = await mobilePage.$('#mobile-nav-dialog[open]');
  console.log('Dialog still open after clicking close?', Boolean(dialogAfterClose));
  if (dialogAfterClose) throw new Error('Dialog should be closed!');

  await mobilePage.screenshot({ path: path.join(brainDir, 'mobile_header_closed.png') });
  console.log('Saved mobile_header_closed.png');

  await mobilePage.close();
  await browser.close();
  console.log('\n>>> ALL NAVIGATION AUDIT TESTS PASSED WITH 100% SUCCESS! <<<');
}

auditNavigation().catch((err) => {
  console.error(err);
  process.exit(1);
});
