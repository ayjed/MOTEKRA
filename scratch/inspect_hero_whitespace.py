import asyncio
import os
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs("docs/evidence/phase-50/before", exist_ok=True)

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
        "title_sel": ".services-intro-title"
    },
    {
        "name": "About",
        "url": "http://localhost:3000/about",
        "hero_sel": ".editorial-hero",
        "title_sel": ".editorial-hero-title, .editorial-hero h1"
    },
    {
        "name": "Contact",
        "url": "http://localhost:3000/contact",
        "hero_sel": ".contact-hero",
        "title_sel": ".contact-hero h1, .contact-hero-title"
    }
]

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        for pg in PAGES:
            print(f"\n=================== INSPECTING {pg['name']} ===================")
            await page.goto(pg["url"], wait_until="networkidle")
            await asyncio.sleep(1)

            # Get nav bounds
            nav = page.locator(".site-header-glass")
            nav_box = await nav.bounding_box() if await nav.count() > 0 else None
            nav_bottom = (nav_box['y'] + nav_box['height']) if nav_box else 88.0

            # Get hero bounds
            hero = page.locator(pg["hero_sel"])
            hero_box = await hero.bounding_box() if await hero.count() > 0 else None

            # Get title bounds
            title = page.locator(pg["title_sel"]).first
            title_box = await title.bounding_box() if await title.count() > 0 else None

            gap = (title_box['y'] - nav_bottom) if title_box else 0.0

            print(f"Nav Box: {nav_box}")
            print(f"Nav Bottom: {nav_bottom:.1f}px")
            print(f"Hero Box: {hero_box}")
            print(f"Title Box: {title_box}")
            print(f">>> CURRENT GAP (Nav Bottom to Title Top): {gap:.1f}px (TARGET: 70–110px)")

            # Check computed styles of hero and parents
            styles = await page.evaluate(f'''() => {{
                const hero = document.querySelector("{pg['hero_sel']}");
                if (!hero) return null;
                const cs = window.getComputedStyle(hero);
                const parentCs = hero.parentElement ? window.getComputedStyle(hero.parentElement) : null;
                return {{
                    hero: {{
                        paddingTop: cs.paddingTop,
                        paddingBottom: cs.paddingBottom,
                        marginTop: cs.marginTop,
                        minHeight: cs.minHeight,
                        height: cs.height,
                        display: cs.display,
                        alignItems: cs.alignItems,
                        justifyContent: cs.justifyContent,
                        position: cs.position
                    }},
                    parent: parentCs ? {{
                        tagName: hero.parentElement.tagName,
                        className: hero.parentElement.className,
                        paddingTop: parentCs.paddingTop,
                        minHeight: parentCs.minHeight,
                        display: parentCs.display
                    }} : null
                }};
            }}''')
            print("Computed Styles:")
            import pprint
            pprint.pprint(styles)

            # Capture BEFORE screenshot (1440x900 viewport)
            before_path = f"docs/evidence/phase-50/before/{pg['name'].lower()}_before.png"
            await page.screenshot(path=before_path, full_page=False)
            print(f"Saved before screenshot: {before_path}")

        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
