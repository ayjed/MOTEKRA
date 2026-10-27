const { chromium } = require('@playwright/test');
const path = require('path');

async function testProcessMove() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\603a94eb-f5c0-4339-9b5b-b7c487f97988';

  // 1. Check Home page
  console.log('Visiting Home page: http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const homeProcess = await page.$('#home-process');
  console.log('Home process section found?', Boolean(homeProcess));
  if (homeProcess) {
    throw new Error('FAILED: #home-process is still present on HomePage!');
  }
  console.log('PASSED: #home-process is completely removed from HomePage.');

  // Take screenshot of home page where services transitions to founder
  const homeServices = await page.$('#home-services');
  await homeServices.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(brainDir, 'home_services_to_founder.png') });
  console.log('Saved home_services_to_founder.png');

  // 2. Check Work page
  console.log('Visiting Work page: http://localhost:3000/work...');
  await page.goto('http://localhost:3000/work', { waitUntil: 'networkidle' });

  const workProcess = await page.$('#work-process');
  console.log('Work process section found?', Boolean(workProcess));
  if (!workProcess) {
    throw new Error('FAILED: #work-process not found on /work page!');
  }
  console.log('PASSED: #work-process found on /work page.');

  // Scroll to work process
  await workProcess.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await workProcess.screenshot({ path: path.join(brainDir, 'work_process_section.png') });
  console.log('Saved work_process_section.png');

  // Check interactive process steps
  const processSteps = await workProcess.$$('[data-process-step]');
  console.log(`Work process steps count: ${processSteps.length}`);
  if (processSteps.length !== 5) {
    throw new Error(`Expected 5 process steps, found ${processSteps.length}`);
  }

  await browser.close();
  console.log('ALL CHECKS PASSED SUCCESSFULLY!');
}

testProcessMove().catch((err) => {
  console.error(err);
  process.exit(1);
});
