import asyncio
import os
import sys
from playwright.async_api import async_playwright

# Ensure utf-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

PROJECTS = [
    {
        "slug": "spotlight-contest",
        "title": "Spotlight Contest",
        "category": "Web Application",
        "next": "LAD Global Travels"
    },
    {
        "slug": "lad-global-travels",
        "title": "LAD Global Travels",
        "category": "Travel & Mobility",
        "next": "TOG Africa"
    },
    {
        "slug": "tog-africa",
        "title": "TOG Africa",
        "category": "Corporate Platform",
        "next": "ConnectAPI"
    },
    {
        "slug": "connectapi",
        "title": "ConnectAPI",
        "category": "UI/UX Concept",
        "next": "Spotlight Contest"
    }
]

PROHIBITED_PHRASES = [
    "draft evidence / local review only",
    "attribution unverified",
    "delivery status unverified",
    "contribution unverified",
    "draft — display permission pending",
    "evidence review, not a completed client case",
    "what the screenshot shows",
    "before publication",
    "the story still needs its facts",
    "the work needs its context",
    "1836ab98-1426-4fca-b9fa-adb23268b2fd",
    "205d73c3-66c4-4918-9643-b0eadfcb3032",
    "18f8400e-473b-45df-b71d-216ad14f4e9b",
    "eb4d75b3-7a73-4ba7-bfc6-876fba4f6315",
    "observed source evidence"
]

os.makedirs("docs/evidence/phase-49", exist_ok=True)

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        
        # Test Case Studies across Desktop and Mobile
        for device_name, width, height in [("desktop", 1440, 900), ("mobile", 390, 844)]:
            context = await browser.new_context(viewport={"width": width, "height": height})
            page = await context.new_page()

            for proj in PROJECTS:
                url = f"http://localhost:3000/work/{proj['slug']}"
                print(f"\n--- Checking {proj['title']} on {device_name} ({width}x{height}) ---")
                await page.goto(url, wait_until="networkidle")
                await asyncio.sleep(1)

                # Check header clearance
                header = page.locator("header.liquid-glass-header")
                if await header.count() > 0:
                    header_box = await header.bounding_box()
                    title = page.locator(".case-hero-title")
                    title_box = await title.bounding_box()
                    if header_box and title_box:
                        print(f"Header bottom: {header_box['y'] + header_box['height']:.1f}px, Title top: {title_box['y']:.1f}px")
                        assert title_box['y'] > (header_box['y'] + header_box['height']), "Title overlaps header!"

                # Check horizontal scroll overflow
                overflow = await page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
                print(f"Horizontal scroll overflow: {overflow}")
                assert not overflow, f"Horizontal scroll overflow detected on {proj['slug']} {device_name}!"

                # Check title text
                h1_text = await page.locator("h1.case-hero-title").inner_text()
                print(f"H1: {h1_text.strip()}")
                assert proj["title"] in h1_text, f"Expected {proj['title']} in H1"

                # Check breadcrumb
                breadcrumb = page.locator(".case-breadcrumb-nav")
                assert await breadcrumb.count() > 0, "Missing breadcrumb navigation"

                # Check category badge
                badge = await page.locator(".case-category-badge").inner_text()
                print(f"Badge: {badge.strip()}")

                # Check primary showcase image
                hero_img = page.locator(".case-showcase-img")
                assert await hero_img.count() > 0, "Missing hero showcase image"

                # Check overview section
                overview_h2 = await page.locator(".case-overview-section h2").inner_text()
                assert "About the Project" in overview_h2, "Missing About the Project heading"

                # Check capabilities cards (should be 4)
                cards = page.locator(".case-capability-card")
                count = await cards.count()
                print(f"Capabilities count: {count}")
                assert count == 4, f"Expected 4 capability cards, got {count}"

                # Check visual gallery section
                gallery_img = page.locator(".case-gallery-img")
                assert await gallery_img.count() > 0, "Missing gallery detail image"

                # Check Next Project section
                next_title = await page.locator(".case-next-title").inner_text()
                print(f"Next Project: {next_title.strip()} (expected: {proj['next']})")
                assert proj["next"] in next_title, f"Expected next project {proj['next']}, got {next_title}"

                # Verify absence of prohibited internal review phrases
                page_html = (await page.content()).lower()
                for phrase in PROHIBITED_PHRASES:
                    if phrase in page_html:
                        raise AssertionError(f"Prohibited phrase '{phrase}' found on page {proj['slug']}!")

                print("Zero prohibited internal review phrases found!")

                # Capture screenshot
                screenshot_path = f"docs/evidence/phase-49/{proj['slug']}_{device_name}.png"
                await page.screenshot(path=screenshot_path, full_page=True)
                print(f"Captured full-page screenshot: {screenshot_path}")

            await context.close()

        # Check Protected Areas: Homepage & Work page
        print("\n--- Verifying Protected Areas ---")
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        # 1. Homepage Featured Projects (must be strictly 2 projects: TOG Africa and ConnectAPI)
        await page.goto("http://localhost:3000/", wait_until="networkidle")
        home_cards = page.locator("#featured-work .davka-project-card")
        home_count = await home_cards.count()
        print(f"Homepage featured projects count: {home_count}")
        assert home_count == 2, f"Homepage must have 2 featured projects, found {home_count}"
        print("Homepage featured projects verified: strictly 2 projects.")

        # 2. Work Page (must be strictly 4 projects)
        await page.goto("http://localhost:3000/work", wait_until="networkidle")
        work_cards = page.locator("[data-work-card]")
        work_count = await work_cards.count()
        print(f"Work page projects count: {work_count}")
        assert work_count == 4, f"Work page must have 4 projects, found {work_count}"
        print("Work page gallery verified: strictly 4 projects.")

        await context.close()
        await browser.close()
        print("\nALL 10 CHECKS PASSED PERFECTLY!")

if __name__ == "__main__":
    asyncio.run(run())
