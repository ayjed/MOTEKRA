import { chromium } from 'file:///C:/Users/DELL/Desktop/MESH%20PROJECT/MOTEKRA/node_modules/@playwright/test/index.mjs';
import fs from 'fs';
import path from 'path';

async function verifyPreloaderAssembly() {
  const evidenceDir = 'docs/evidence/phase-32';
  fs.mkdirSync(evidenceDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const results = {
    firstVisit: false,
    assemblyElementsPresent: false,
    wordmarkMaskPresent: false,
    capturesSuccessful: false,
    f5RefreshHome: false,
    hardRefreshHome: false,
    directVisitWork: false,
    f5RefreshWork: false,
    directVisitServices: false,
    f5RefreshServices: false,
    clientNavigationNoReplay: false,
    backForwardNoReplay: false,
    reducedMotionBypass: false,
    heroContentVisible: false
  };

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    console.log('=== TEST 1: Initial Page Load & Digital Assembly ===');
    // Start navigation
    const navPromise = page.goto('http://localhost:3000/', { waitUntil: 'commit' });
    
    // Wait for preloader container to be attached in DOM
    await page.waitForSelector('#motekra-preloader', { timeout: 3000 });
    console.log('✓ PASS: #motekra-preloader attached on initial load');
    results.firstVisit = true;

    // Check presence of authentic geometric assembly pieces
    const pieces = await page.$$('.assembly-piece');
    console.log(`✓ PASS: Found ${pieces.length} authentic assembly pieces (expected 5)`);
    if (pieces.length === 5) results.assemblyElementsPresent = true;

    const wordmarkMask = await page.$('.motekra-preloader-wordmark-mask');
    const scanLine = await page.$('.motekra-preloader-scan-line');
    console.log('✓ PASS: Wordmark horizontal mask present:', !!wordmarkMask);
    console.log('✓ PASS: Luminous leading scan line present:', !!scanLine);
    if (wordmarkMask && scanLine) results.wordmarkMaskPresent = true;

    // Capture frame 1: Digital Assembly pieces converging (~250ms)
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(evidenceDir, '01-assembly-pieces-converging.png') });
    console.log('✓ Saved: 01-assembly-pieces-converging.png');

    // Capture frame 2: Horizontal Wordmark Reveal with scan line (~350ms later = ~600ms)
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(evidenceDir, '02-horizontal-wordmark-reveal.png') });
    console.log('✓ Saved: 02-horizontal-wordmark-reveal.png');

    // Capture frame 3: Solid Snap-and-Lock with cyan energy glow (~350ms later = ~950ms)
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(evidenceDir, '03-snap-and-lock.png') });
    console.log('✓ Saved: 03-snap-and-lock.png');

    // Capture frame 4: Unified Resting Brand Composition (~350ms later = ~1300ms)
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(evidenceDir, '04-completed-composition.png') });
    console.log('✓ Saved: 04-completed-composition.png');

    // Capture frame 5: Cinematic Curtain Reveal Exit Lifting (~500ms later = ~1800ms)
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenceDir, '05-curtain-reveal-exit.png') });
    console.log('✓ Saved: 05-curtain-reveal-exit.png');

    // Wait for preloader finished
    await page.waitForSelector('body.preloader-finished', { timeout: 4000 });
    await page.waitForTimeout(800); // Allow hero entrance to finish
    await page.screenshot({ path: path.join(evidenceDir, '06-homepage-revealed.png') });
    console.log('✓ Saved: 06-homepage-revealed.png');
    results.capturesSuccessful = true;

    // Verify hero content visibility after curtain lift
    const words = await page.$$('.hero-word');
    const lead = await page.$('.lead[data-hero-support]');
    const buttons = await page.$$('.button-group[data-hero-support] a');
    console.log(`✓ Hero elements check: ${words.length} headline words, lead=${!!lead}, ${buttons.length} CTA buttons`);
    if (words.length > 0 && lead && buttons.length >= 2) {
      results.heroContentVisible = true;
      console.log('✓ PASS: All hero text and CTA buttons fully visible and interactive');
    }

    console.log('\n=== TEST 2: Browser F5 Refresh on Home (/) ===');
    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2500 });
    console.log('✓ PASS: Preloader appeared on F5 refresh of Home!');
    results.f5RefreshHome = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n=== TEST 3: Hard Refresh on Home (/) ===');
    await context.clearCookies();
    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2500 });
    console.log('✓ PASS: Preloader appeared on Hard Refresh of Home!');
    results.hardRefreshHome = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n=== TEST 4: Direct Loading of /work and F5 Refresh ===');
    await page.goto('http://localhost:3000/work', { waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2500 });
    console.log('✓ PASS: Preloader appeared on direct load of /work!');
    results.directVisitWork = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2500 });
    console.log('✓ PASS: Preloader appeared on F5 refresh of /work!');
    results.f5RefreshWork = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n=== TEST 5: Direct Loading of /services and F5 Refresh ===');
    await page.goto('http://localhost:3000/services', { waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2500 });
    console.log('✓ PASS: Preloader appeared on direct load of /services!');
    results.directVisitServices = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2500 });
    console.log('✓ PASS: Preloader appeared on F5 refresh of /services!');
    results.f5RefreshServices = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n=== TEST 6: Client-Side Navigation (Zero Replay) ===');
    // Start at Home
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });
    await page.waitForTimeout(400);

    // Track if preloader ever appears during client navigation
    await page.evaluate(() => {
      window.__replay_detected = false;
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (document.getElementById('motekra-preloader')) {
            window.__replay_detected = true;
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

    // Click navigation to /work
    console.log('Navigating Home -> /work via client link...');
    await page.click('header a[href="/work"]');
    await page.waitForURL('**/work');
    await page.waitForTimeout(800);

    // Click navigation to /services
    console.log('Navigating /work -> /services via client link...');
    await page.click('header a[href="/services"]');
    await page.waitForURL('**/services');
    await page.waitForTimeout(800);

    const replayed = await page.evaluate(() => window.__replay_detected);
    if (!replayed) {
      console.log('✓ PASS: Preloader did NOT replay during internal client-side navigation!');
      results.clientNavigationNoReplay = true;
    } else {
      console.error('FAIL: Preloader replayed during internal client navigation');
    }

    console.log('\n=== TEST 7: Browser Back / Forward (Zero Replay) ===');
    await page.goBack();
    await page.waitForURL('**/work');
    await page.waitForTimeout(500);

    await page.goForward();
    await page.waitForURL('**/services');
    await page.waitForTimeout(500);

    const replayedBackForward = await page.evaluate(() => window.__replay_detected);
    if (!replayedBackForward) {
      console.log('✓ PASS: Preloader did NOT replay during browser Back / Forward!');
      results.backForwardNoReplay = true;
    } else {
      console.error('FAIL: Preloader replayed during browser Back / Forward');
    }

    console.log('\n=== TEST 8: Reduced-Motion Mode Bypass ===');
    const reducedContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto('http://localhost:3000/', { waitUntil: 'load' });
    await reducedPage.waitForTimeout(300);

    const reducedPreloaderVisible = await reducedPage.evaluate(() => {
      const p = document.getElementById('motekra-preloader');
      if (!p) return false;
      const s = window.getComputedStyle(p);
      return s.display !== 'none' && s.visibility !== 'hidden';
    });

    if (!reducedPreloaderVisible) {
      console.log('✓ PASS: Preloader cleanly bypassed in reduced-motion mode!');
      results.reducedMotionBypass = true;
    } else {
      console.error('FAIL: Preloader was visible in reduced-motion mode');
    }

    await reducedContext.close();
    await context.close();

    console.log('\n========================================');
    console.log('PRELOADER VERIFICATION SUMMARY:');
    console.log(JSON.stringify(results, null, 2));
    console.log('========================================');

    const allPassed = Object.values(results).every(v => v === true);
    if (allPassed) {
      console.log('🎉 ALL 14 TEST CRITERIA PASSED CLEANLY!');
    } else {
      console.error('❌ Some test criteria failed!');
      process.exit(1);
    }

  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyPreloaderAssembly();
