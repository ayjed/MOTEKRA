const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch({ 
    headless: true, 
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  
  console.log("Navigating to http://localhost:3000/...");
  await page.goto("http://localhost:3000/");
  
  const checkStyles = async (step) => {
    return await page.evaluate((step) => {
      const get = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return { 
          opacity: cs.opacity, 
          transform: cs.transform, 
          visibility: cs.visibility,
          top: Math.round(rect.top),
          height: Math.round(rect.height),
          width: Math.round(rect.width)
        };
      };
      return {
        step,
        scrollY: window.scrollY,
        hero: get(".home-hero-cinema"),
        title: get(".cinema-title"),
        word0: get(".hero-word"),
        lead: get(".lead[data-hero-support]"),
        buttons: get(".button-group[data-hero-support]"),
        handoff: get(".hero-product-handoff"),
        laptop: get(".laptop"),
        phone: get(".phone"),
        poster: get(".scene-poster"),
        webgl: get(".webgl-layer")
      };
    }, step);
  };

  // Immediate frame (0ms)
  console.log("Frame 0ms:", JSON.stringify(await checkStyles("0ms"), null, 2));
  
  await page.waitForTimeout(100);
  console.log("Frame 100ms:", JSON.stringify(await checkStyles("100ms"), null, 2));

  await page.waitForTimeout(600);
  console.log("Frame 700ms:", JSON.stringify(await checkStyles("700ms"), null, 2));

  await page.waitForTimeout(1500);
  console.log("Frame 2200ms:", JSON.stringify(await checkStyles("2200ms"), null, 2));

  for (const scrollY of [150, 300, 500, 700, 900]) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(200);
    console.log(`Scroll ${scrollY}px:`, JSON.stringify(await checkStyles(`scroll-${scrollY}`), null, 2));
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  console.log("Scroll back to 0px:", JSON.stringify(await checkStyles("back-to-top"), null, 2));

  await browser.close();
})();
