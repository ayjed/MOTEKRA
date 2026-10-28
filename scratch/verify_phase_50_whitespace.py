import asyncio
import os
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs("docs/evidence/phase-50/after", exist_ok=True)
os.makedirs("docs/evidence/phase-50/mobile", exist_ok=True)

PAGES = [
    {
        "name": "Work",
        "url": "http://localhost:3000/work",
        "hero_sel": ".work-hero",
        "title_sel": ".work-hero-title"
    },
    {
        "name": "Services",
        "url": "http://localhost:3000/services",
        "hero_sel": ".services-intro-section",
        "title_sel": "#services-main-heading, .services-intro-left h1"
    },
    {
        "name": "About",
        "url": "http://localhost:3000/about",
        "hero_sel": ".editorial-hero",
        "title_sel": ".editorial-hero h1"
    },
    {
        "name": "Contact",
        "url": "http://localhost:3000/contact",
        "hero_sel": ".contact-hero",
        "title_sel": "#contact-hero-title, .contact-hero h1"
    }
]

VIEWPORTS = [
    {"name": "desktop_1440", "width": 1440, "height": 900},
    {"name": "laptop_1280", "width": 1280, "height": 800},
    {"name": "tablet_1024", "width": 1024, "height": 768},
    {"name": "tablet_768", "width": 768, "height": 1024},
    {"name": "mobile_390", "width": 390, "height": 844},
    {"name": "mobile_375", "width": 375, "height": 667},
]

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        
        results = {}

        for vp in VIEWPORTS:
            context = await browser.new_context(viewport={"width": vp["width"], "height": vp["height"]})
            page = await context.new_page()

            for pg in PAGES:
                key = f"{pg['name']}_{vp['name']}"
                await page.goto(pg["url"], wait_until="networkidle")
                await asyncio.sleep(0.8)

                # Get nav bounds
                nav = page.locator(".site-header-glass")
                nav_box = await nav.bounding_box() if await nav.count() > 0 else None
                nav_bottom = (nav_box['y'] + nav_box['height']) if nav_box else 88.0

                # Get title bounds
                title = page.locator(pg["title_sel"]).first
                title_box = await title.bounding_box() if await title.count() > 0 else None

                gap = (title_box['y'] - nav_bottom) if title_box else 0.0

                # Check overflow
                overflow = await page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")

                results[key] = {
                    "page": pg["name"],
                    "viewport": vp["name"],
                    "width": vp["width"],
                    "nav_bottom": nav_bottom,
                    "title_top": title_box['y'] if title_box else 0.0,
                    "gap": gap,
                    "overflow": overflow
                }

                print(f"[{vp['name']}] {pg['name']}: NavBottom={nav_bottom:.1f}px, TitleTop={title_box['y'] if title_box else 0:.1f}px -> GAP = {gap:.1f}px (Overflow: {overflow})")

                # Capture screenshots for 1440 desktop and 390 mobile
                if vp["name"] == "desktop_1440":
                    path = f"docs/evidence/phase-50/after/{pg['name'].lower()}_after.png"
                    await page.screenshot(path=path, full_page=False)
                elif vp["name"] == "mobile_390":
                    path = f"docs/evidence/phase-50/mobile/{pg['name'].lower()}_mobile.png"
                    await page.screenshot(path=path, full_page=False)

            await context.close()

        await browser.close()

        print("\n=================== SUMMARY OF DESKTOP 1440px GAPS ===================")
        print("Page       | Nav Bottom | Title Top | Visible Gap | Target (70–110px)")
        print("-----------|------------|-----------|-------------|------------------")
        for pg in PAGES:
            d = results[f"{pg['name']}_desktop_1440"]
            status = "PASS" if (70 <= d['gap'] <= 110) else ("CLOSE" if 60 <= d['gap'] <= 120 else "FAIL")
            print(f"{pg['name']:<10} | {d['nav_bottom']:<10.1f} | {d['title_top']:<9.1f} | {d['gap']:<11.1f} | {status}")

if __name__ == "__main__":
    asyncio.run(run())

