import asyncio
import os
import sys
import json
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs("docs/evidence/phase-52/optimized", exist_ok=True)
os.makedirs("docs/evidence/phase-52/screenshots", exist_ok=True)

VIEWPORTS = [
    {"name": "1920_large_desktop", "width": 1920, "height": 1080, "is_mobile": False},
    {"name": "1440_desktop", "width": 1440, "height": 900, "is_mobile": False},
    {"name": "1280_laptop", "width": 1280, "height": 800, "is_mobile": False},
    {"name": "1024_tablet_landscape", "width": 1024, "height": 768, "is_mobile": False},
    {"name": "768_tablet_portrait", "width": 768, "height": 1024, "is_mobile": False},
    {"name": "430_large_phone", "width": 430, "height": 932, "is_mobile": True},
    {"name": "390_standard_phone", "width": 390, "height": 844, "is_mobile": True},
    {"name": "375_small_phone", "width": 375, "height": 667, "is_mobile": True},
    {"name": "320_narrow_phone", "width": 320, "height": 568, "is_mobile": True},
]

ROUTES = [
    {"name": "Home", "path": "/"},
    {"name": "Work", "path": "/work"},
    {"name": "Services", "path": "/services"},
    {"name": "About", "path": "/about"},
    {"name": "Contact", "path": "/contact"},
    {"name": "Service_UI_UX", "path": "/services/ui-ux-design"},
    {"name": "Service_Web_Dev", "path": "/services/web-development"},
    {"name": "Service_Mobile_Dev", "path": "/services/mobile-app-development"},
    {"name": "Service_Product_Strategy", "path": "/services/product-strategy"},
    {"name": "Service_Brand_Design", "path": "/services/brand-visual-design"},
    {"name": "Case_Spotlight", "path": "/work/spotlight-contest"},
    {"name": "Case_LAD_Travels", "path": "/work/lad-global-travels"},
    {"name": "Case_TOG_Africa", "path": "/work/tog-africa"},
    {"name": "Case_ConnectAPI", "path": "/work/connectapi"},
    {"name": "Team_Founder", "path": "/team/akinwumi-ayomiposi"},
]

BASE_URL = "http://localhost:3000"

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        
        verification_results = {
            "viewport_results": {},
            "overflow_issues": [],
            "performance_optimized": {},
            "touch_target_results": {},
            "mobile_nav_checks": {}
        }

        print("=== 1. MEASURING OPTIMIZED PERFORMANCE ON DESKTOP & MOBILE ===")
        for vp_type in [("desktop", 1440, 900, False), ("mobile", 390, 844, True)]:
            vp_label, w, h, is_mob = vp_type
            context = await browser.new_context(viewport={"width": w, "height": h}, is_mobile=is_mob)
            page = await context.new_page()

            verification_results["performance_optimized"][vp_label] = {}

            primary_routes = [r for r in ROUTES if r["name"] in ["Home", "Work", "Services", "About", "Contact", "Service_UI_UX", "Case_Spotlight"]]
            for r in primary_routes:
                url = f"{BASE_URL}{r['path']}"
                
                await page.add_init_script("""
                    window.__cwv = { lcp: 0, cls: 0, entries: [] };
                    try {
                        const lcpObserver = new PerformanceObserver((entryList) => {
                            const entries = entryList.getEntries();
                            const lastEntry = entries[entries.length - 1];
                            if (lastEntry) window.__cwv.lcp = lastEntry.renderTime || lastEntry.loadTime;
                        });
                        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

                        const clsObserver = new PerformanceObserver((entryList) => {
                            for (const entry of entryList.getEntries()) {
                                if (!entry.hadRecentInput) {
                                    window.__cwv.cls += entry.value;
                                }
                            }
                        });
                        clsObserver.observe({ type: 'layout-shift', buffered: true });
                    } catch (e) {}
                """)

                resp = await page.goto(url, wait_until="networkidle")
                await asyncio.sleep(2.0)

                timing = await page.evaluate("""() => {
                    const nav = performance.getEntriesByType('navigation')[0];
                    const cwv = window.__cwv || { lcp: 0, cls: 0 };
                    
                    const resources = performance.getEntriesByType('resource');
                    let jsBytes = 0, cssBytes = 0, imgBytes = 0, fontBytes = 0;
                    resources.forEach(res => {
                        const size = res.transferSize || res.decodedBodySize || 0;
                        if (res.initiatorType === 'script' || res.name.endsWith('.js')) jsBytes += size;
                        else if (res.initiatorType === 'css' || res.name.endsWith('.css')) cssBytes += size;
                        else if (res.initiatorType === 'img' || res.name.match(/\\.(webp|png|jpg|jpeg|svg|avif)/)) imgBytes += size;
                        else if (res.initiatorType === 'font' || res.name.match(/\\.(woff2|woff|ttf)/)) fontBytes += size;
                    });

                    return {
                        ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
                        domInteractive: nav ? Math.round(nav.domInteractive) : 0,
                        domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : 0,
                        loadTime: nav ? Math.round(nav.loadEventEnd) : 0,
                        lcp: Math.round(cwv.lcp || 0),
                        cls: Number(cwv.cls.toFixed(4)),
                        jsBytes,
                        cssBytes,
                        imgBytes,
                        fontBytes,
                        resourceCount: resources.length
                    };
                }""")

                verification_results["performance_optimized"][vp_label][r["name"]] = timing
                print(f"[{vp_label.upper()} {r['name']}] LCP: {timing['lcp']}ms | CLS: {timing['cls']} | DCL: {timing['domContentLoaded']}ms | Load: {timing['loadTime']}ms | JS: {timing['jsBytes']//1024}KB | IMG: {timing['imgBytes']//1024}KB")

            await page.close()
            await context.close()

        print("\n=== 2. VERIFYING ALL 9 RESPONSIVE VIEWPORTS ACROSS ALL 15 ROUTES ===")
        for vp in VIEWPORTS:
            vp_name = vp["name"]
            verification_results["viewport_results"][vp_name] = {}
            print(f"\n--- Testing Viewport: {vp_name} ({vp['width']}x{vp['height']}) ---")
            
            context = await browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                is_mobile=vp["is_mobile"],
                has_touch=vp["is_mobile"]
            )
            page = await context.new_page()

            for r in ROUTES:
                url = f"{BASE_URL}{r['path']}"
                try:
                    await page.goto(url, wait_until="networkidle")
                    await asyncio.sleep(1.2)

                    diag = await page.evaluate("""() => {
                        const docWidth = document.documentElement.clientWidth;
                        const scrollWidth = document.documentElement.scrollWidth;
                        const hasOverflow = scrollWidth > docWidth + 1;

                        const overflowingElements = [];
                        if (hasOverflow) {
                            const all = document.querySelectorAll('*');
                            all.forEach(el => {
                                const rect = el.getBoundingClientRect();
                                if (rect.right > docWidth + 2) {
                                    overflowingElements.push({
                                        tag: el.tagName,
                                        cls: (el.className || '').toString().slice(0, 60),
                                        id: el.id,
                                        right: Math.round(rect.right),
                                        width: Math.round(rect.width)
                                    });
                                }
                            });
                        }

                        const h1 = document.querySelector('h1');
                        let h1Info = null;
                        if (h1) {
                            const h1Rect = h1.getBoundingClientRect();
                            const style = window.getComputedStyle(h1);
                            h1Info = {
                                text: h1.innerText.slice(0, 30),
                                width: Math.round(h1Rect.width),
                                height: Math.round(h1Rect.height),
                                top: Math.round(h1Rect.top),
                                fontSize: style.fontSize,
                                opacity: style.opacity,
                                isVisible: h1Rect.width > 0 && h1Rect.height > 0 && style.visibility !== 'hidden'
                            };
                        }

                        const header = document.querySelector('.site-header, header');
                        let navGap = null;
                        if (header && h1) {
                            const headerRect = header.getBoundingClientRect();
                            const h1Rect = h1.getBoundingClientRect();
                            navGap = Math.round(h1Rect.top - headerRect.bottom);
                        }

                        const smallTouchTargets = [];
                        const interactives = document.querySelectorAll('button, a, input, select, textarea');
                        interactives.forEach(el => {
                            const rect = el.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden' && window.getComputedStyle(el).display !== 'none') {
                                if (rect.width < 40 || rect.height < 40) {
                                    const isInlineLink = el.tagName === 'A' && el.closest('p') && !el.classList.contains('button') && !el.classList.contains('btn');
                                    if (!isInlineLink) {
                                        smallTouchTargets.push({
                                            tag: el.tagName,
                                            cls: (el.className || '').toString().slice(0, 40),
                                            text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 20),
                                            w: Math.round(rect.width),
                                            h: Math.round(rect.height)
                                        });
                                    }
                                }
                            }
                        });

                        return {
                            docWidth,
                            scrollWidth,
                            hasOverflow,
                            overflowingElements: overflowingElements.slice(0, 5),
                            h1Info,
                            navGap,
                            smallTouchCount: smallTouchTargets.length,
                            smallTouchSample: smallTouchTargets.slice(0, 3)
                        };
                    }""")

                    status = "FAIL" if diag["hasOverflow"] else "PASS"
                    verification_results["viewport_results"][vp_name][r["name"]] = {
                        "status": status,
                        "scrollWidth": diag["scrollWidth"],
                        "clientWidth": diag["docWidth"],
                        "navGap": diag["navGap"],
                        "h1": diag["h1Info"],
                        "smallTouchCount": diag["smallTouchCount"]
                    }

                    if diag["hasOverflow"]:
                        overflow_record = {
                            "viewport": vp_name,
                            "route": r["name"],
                            "clientWidth": diag["docWidth"],
                            "scrollWidth": diag["scrollWidth"],
                            "elements": diag["overflowingElements"]
                        }
                        verification_results["overflow_issues"].append(overflow_record)
                        print(f"  [OVERFLOW] {r['name']} at {vp_name}: client={diag['docWidth']}px vs scroll={diag['scrollWidth']}px")
                    else:
                        print(f"  [{status}] {r['name']}: width={diag['docWidth']}px, navGap={diag['navGap']}px, h1={'OK' if diag['h1Info'] and diag['h1Info']['isVisible'] else 'NONE'}")

                    if vp["width"] in [1440, 390, 320] and r["name"] in ["Home", "Work", "Services", "About", "Contact", "Service_UI_UX", "Case_Spotlight"]:
                        scr_path = f"docs/evidence/phase-52/screenshots/optimized_{r['name'].lower()}_{vp['width']}.png"
                        await page.screenshot(path=scr_path)

                except Exception as ex:
                    print(f"  [ERROR] {r['name']} on {vp_name}: {ex}")

            # Test Mobile Navigation Drawer Interaction
            if vp["width"] in [390, 320]:
                print(f"  --- Testing Mobile Navigation Drawer Interaction ({vp_name}) ---")
                await page.goto(f"{BASE_URL}/", wait_until="networkidle")
                await asyncio.sleep(1.0)
                
                # Check toggle button presence and click to open
                toggle = page.locator("button.mobile-menu-toggle")
                await toggle.click()
                await asyncio.sleep(0.5)

                dialog = page.locator("#mobile-nav-dialog")
                is_open = await dialog.evaluate("el => el.open")
                drawer_vis = await page.locator(".nav-drawer").is_visible()
                print(f"    Drawer Open State: dialog.open={is_open}, drawer.visible={drawer_vis}")

                # Capture drawer open screenshot
                await page.screenshot(path=f"docs/evidence/phase-52/screenshots/mobile_drawer_open_{vp['width']}.png")

                # Test close button
                close_btn = page.locator(".drawer-close-btn")
                await close_btn.click()
                await asyncio.sleep(0.5)
                is_closed = await dialog.evaluate("el => !el.open")
                print(f"    Drawer Closed State: closed={is_closed}")

                verification_results["mobile_nav_checks"][vp_name] = {
                    "toggle_works": is_open and is_closed,
                    "dialog_open": is_open,
                    "drawer_visible": drawer_vis
                }

            await page.close()
            await context.close()

        await browser.close()

        # Save optimized verification JSON
        with open("docs/evidence/phase-52/optimization_results.json", "w", encoding="utf-8") as f:
            json.dump(verification_results, f, indent=2)

        print("\n=================== OPTIMIZATION VERIFICATION COMPLETE ===================")
        print(f"Total Overflow Issues: {len(verification_results['overflow_issues'])}")
        print(f"Results written to docs/evidence/phase-52/optimization_results.json")

if __name__ == "__main__":
    asyncio.run(run_verification())

