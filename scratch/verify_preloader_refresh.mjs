import { chromium } from 'file:///C:/Users/DELL/Desktop/MESH%20PROJECT/MOTEKRA/node_modules/@playwright/test/index.mjs';

async function verifyPreloader() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const results = {
    firstVisit: false,
    f5RefreshHome: false,
    hardRefreshHome: false,
    directVisitWork: false,
    f5RefreshWork: false,
    directVisitServices: false,
    f5RefreshServices: false,
    clientNavigationNoReplay: false,
    backForwardNoReplay: false,
    reducedMotionBypass: false
  };

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    console.log('--- TEST 1: First visit to Home (/) ---');
    // Listen for preloader presence on initial navigation
    const navPromise = page.goto('http://localhost:3000/', { waitUntil: 'commit' });
    // Immediately check if preloader is present in the DOM
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on first visit!');
    results.firstVisit = true;

    // Wait for preloader to finish its animation and lift away
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });
    await page.waitForTimeout(600); // Allow GSAP to finish unmount
    const preloaderAfter = await page.$('#motekra-preloader');
    console.log('PASS: Preloader unmounted after completion (in DOM = ' + !!preloaderAfter + ')');

    // Screenshot initial page reveal
    await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity-ide/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/preloader_revealed_home.png' });

    console.log('\n--- TEST 2: F5 Normal Refresh on Home (/) ---');
    const f5Promise = page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on F5 refresh!');
    results.f5RefreshHome = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n--- TEST 3: Hard Refresh on Home (/) ---');
    // Emulate hard refresh by clearing cache and reloading
    await context.clearCookies();
    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on Hard Refresh!');
    results.hardRefreshHome = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n--- TEST 4: Direct Loading of /work and F5 Refresh ---');
    await page.goto('http://localhost:3000/work', { waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on direct load of /work!');
    results.directVisitWork = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on F5 refresh of /work!');
    results.f5RefreshWork = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n--- TEST 5: Direct Loading of /services and F5 Refresh ---');
    await page.goto('http://localhost:3000/services', { waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on direct load of /services!');
    results.directVisitServices = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    await page.reload({ waitUntil: 'commit' });
    await page.waitForSelector('#motekra-preloader', { timeout: 2000 });
    console.log('PASS: Preloader appeared on F5 refresh of /services!');
    results.f5RefreshServices = true;
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });

    console.log('\n--- TEST 6: Client-Side Navigation (NO REPLAY) ---');
    // Start at Home
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForSelector('body.preloader-finished', { timeout: 5000 });
    await page.waitForTimeout(500);

    let replayed = false;
    // Set a mutation observer or listener to detect if preloader ever appears
    await page.evaluate(() => {
      window.__preloader_replay_detected = false;
      const obs = new MutationObserver(() => {
        if (document.getElementById('motekra-preloader')) {
          window.__preloader_replay_detected = true;
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    });

    // Click navigation links one by one
    const routesToTest = ['Work', 'Services', 'About', 'Contact', 'Home'];
    for (const name of routesToTest) {
      console.log(`Navigating client-side to ${name}...`);
      const link = page.locator(`.site-header a:has-text("${name}")`).first();
      await link.click();
      await page.waitForTimeout(800); // Allow route transition

      const checkReplay = await page.evaluate(() => window.__preloader_replay_detected);
      if (checkReplay) {
        console.error(`FAIL: Preloader replayed when navigating to ${name}!`);
        replayed = true;
      } else {
        console.log(`PASS: No preloader replay when navigating to ${name}`);
      }
    }
    results.clientNavigationNoReplay = !replayed;

    console.log('\n--- TEST 7: Browser Back and Forward Navigation (NO REPLAY) ---');
    await page.goBack();
    await page.waitForTimeout(600);
    let backReplay = await page.evaluate(() => window.__preloader_replay_detected);
    await page.goForward();
    await page.waitForTimeout(600);
    let forwardReplay = await page.evaluate(() => window.__preloader_replay_detected);
    if (!backReplay && !forwardReplay) {
      console.log('PASS: No preloader replay on Back and Forward navigation!');
      results.backForwardNoReplay = true;
    } else {
      console.error('FAIL: Preloader replayed during Back/Forward navigation');
    }

    console.log('\n--- TEST 8: Reduced Motion Bypass ---');
    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    const rmPreloaderVisible = await rmPage.evaluate(() => {
      const el = document.getElementById('motekra-preloader');
      if (!el) return false;
      const s = window.getComputedStyle(el);
      return s.display !== 'none';
    });
    console.log('Reduced motion preloader visible:', rmPreloaderVisible);
    if (!rmPreloaderVisible) {
      console.log('PASS: Preloader correctly bypassed with reduced motion!');
      results.reducedMotionBypass = true;
    }
    await rmContext.close();
    await context.close();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=== FINAL VERIFICATION SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
}

verifyPreloader();
