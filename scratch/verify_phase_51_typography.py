import asyncio
import os
import sys
import json
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs("docs/evidence/phase-51/screenshots", exist_ok=True)
os.makedirs("docs/evidence/phase-51/video", exist_ok=True)

ROUTES = [
    {
        "name": "Home",
        "url": "http://localhost:3000/",
        "heading_sel": "[data-hero-title-line]",
        "lead_sel": ".lead[data-hero-support]",
    },
    {
        "name": "Work",
        "url": "http://localhost:3000/work",
        "heading_sel": "[data-work-hero-line]",
        "lead_sel": ".work-hero-lead",
    },
    {
        "name": "Services",
        "url": "http://localhost:3000/services",
        "heading_sel": "[data-services-heading-line]",
        "lead_sel": "[data-services-hero-lead]",
    },
    {
        "name": "About",
        "url": "http://localhost:3000/about",
        "heading_sel": "[data-editorial-line]",
        "lead_sel": "[data-editorial-lead]",
    },
    {
        "name": "Contact",
        "url": "http://localhost:3000/contact",
        "heading_sel": "[data-contact-title-line], [data-contact-word]",
        "lead_sel": "[data-contact-hero-lead]",
    },
    {
        "name": "Service_Detail_UI_UX",
        "url": "http://localhost:3000/services/ui-ux-design",
        "heading_sel": "[data-service-hero-title]",
        "lead_sel": ".service-hero-lead",
    },
    {
        "name": "Case_Study_Spotlight",
        "url": "http://localhost:3000/work/spotlight-contest",
        "heading_sel": "[data-case-title-line]",
        "lead_sel": "[data-case-hero-lead]",
    },
]

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)

        results = []

        # =========================================================================
        # 1. Desktop Verification with Video Recording
        # =========================================================================
        desktop_context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir="docs/evidence/phase-51/video",
            record_video_size={"width": 1440, "height": 900}
        )
        page = await desktop_context.new_page()

        for route in ROUTES:
            print(f"\n--- Testing Desktop Route: {route['name']} ({route['url']}) ---")
            await page.goto(route["url"], wait_until="networkidle")
            
            # Wait for preloader/initial animations to complete
            await asyncio.sleep(1.8)

            # Check heading presence and computed visibility
            heading_elements = page.locator(route["heading_sel"])
            heading_count = await heading_elements.count()
            
            heading_visible = False
            heading_opacity = "0"
            if heading_count > 0:
                first_heading = heading_elements.first
                heading_visible = await first_heading.is_visible()
                heading_opacity = await first_heading.evaluate("el => window.getComputedStyle(el).opacity")
                heading_transform = await first_heading.evaluate("el => window.getComputedStyle(el).transform")
            else:
                heading_transform = "none"

            # Check lead paragraph presence and computed visibility
            lead_el = page.locator(route["lead_sel"]).first
            lead_count = await page.locator(route["lead_sel"]).count()
            lead_visible = False
            lead_opacity = "0"
            lead_transform = "none"
            if lead_count > 0:
                lead_visible = await lead_el.is_visible()
                lead_opacity = await lead_el.evaluate("el => window.getComputedStyle(el).opacity")
                lead_transform = await lead_el.evaluate("el => window.getComputedStyle(el).transform")

            # Check horizontal overflow
            overflow = await page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")

            # Capture desktop screenshot
            scr_path = f"docs/evidence/phase-51/screenshots/{route['name'].lower()}_desktop.png"
            await page.screenshot(path=scr_path)

            status = "PASS" if (heading_visible and lead_visible and not overflow and heading_opacity == "1" and lead_opacity == "1") else "FAIL"

            result_entry = {
                "route": route["name"],
                "viewport": "desktop_1440",
                "heading_count": heading_count,
                "heading_visible": heading_visible,
                "heading_opacity": heading_opacity,
                "heading_transform": heading_transform,
                "lead_visible": lead_visible,
                "lead_opacity": lead_opacity,
                "lead_transform": lead_transform,
                "overflow": overflow,
                "status": status
            }
            results.append(result_entry)
            print(f"[{status}] Heading: {heading_count} lines, visible={heading_visible}, opacity={heading_opacity} | Lead: visible={lead_visible}, opacity={lead_opacity} | Overflow: {overflow}")

            # On Home, also scroll down to verify services and contact sections
            if route["name"] == "Home":
                # Scroll to Services
                await page.evaluate("window.scrollTo({ top: 1800, behavior: 'instant' })")
                await asyncio.sleep(1.2)
                serv_intro = page.locator("[data-services-intro-support]").first
                serv_vis = await serv_intro.is_visible() if await page.locator("[data-services-intro-support]").count() > 0 else False
                serv_op = await serv_intro.evaluate("el => window.getComputedStyle(el).opacity") if serv_vis else "0"
                print(f"  [Home Scroll] Services Intro: visible={serv_vis}, opacity={serv_op}")

                # Scroll to Testimonials & Closing Contact
                await page.evaluate("window.scrollTo({ top: 4000, behavior: 'instant' })")
                await asyncio.sleep(1.2)
                contact_lead = page.locator("[data-contact-lead-support]").first
                contact_vis = await contact_lead.is_visible() if await page.locator("[data-contact-lead-support]").count() > 0 else False
                contact_op = await contact_lead.evaluate("el => window.getComputedStyle(el).opacity") if contact_vis else "0"
                print(f"  [Home Scroll] Contact Lead: visible={contact_vis}, opacity={contact_op}")

        # Test tab invisibility / restoration recovery
        print("\n--- Testing Tab Inactivity Recovery ---")
        await page.goto("http://localhost:3000/", wait_until="networkidle")
        await asyncio.sleep(1.5)
        # Simulate tab hidden
        await page.evaluate("() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }")
        await asyncio.sleep(0.5)
        # Simulate tab restored
        await page.evaluate("() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('focus')); window.dispatchEvent(new Event('motekra-tab-restored')); }")
        await asyncio.sleep(0.5)

        home_lead_after_tab = await page.locator(".lead[data-hero-support]").evaluate("el => window.getComputedStyle(el).opacity")
        home_heading_after_tab = await page.locator("[data-hero-title-line]").first.evaluate("el => window.getComputedStyle(el).opacity")
        tab_recovery_pass = (home_lead_after_tab == "1" and home_heading_after_tab == "1")
        print(f"Tab Recovery: Heading Opacity={home_heading_after_tab}, Lead Opacity={home_lead_after_tab} -> {'PASS' if tab_recovery_pass else 'FAIL'}")

        # Close page and context to finalize video
        await page.close()
        await desktop_context.close()

        # =========================================================================
        # 2. Mobile Verification (390px)
        # =========================================================================
        mobile_context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True
        )
        m_page = await mobile_context.new_page()

        for route in ROUTES[:5]: # Primary 5 pages on mobile
            print(f"\n--- Testing Mobile Route: {route['name']} ---")
            await m_page.goto(route["url"], wait_until="networkidle")
            await asyncio.sleep(1.6)

            h_el = m_page.locator(route["heading_sel"]).first
            l_el = m_page.locator(route["lead_sel"]).first

            h_vis = await h_el.is_visible() if await m_page.locator(route["heading_sel"]).count() > 0 else False
            h_op = await h_el.evaluate("el => window.getComputedStyle(el).opacity") if h_vis else "0"
            l_vis = await l_el.is_visible() if await m_page.locator(route["lead_sel"]).count() > 0 else False
            l_op = await l_el.evaluate("el => window.getComputedStyle(el).opacity") if l_vis else "0"

            overflow = await m_page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")

            scr_path = f"docs/evidence/phase-51/screenshots/{route['name'].lower()}_mobile.png"
            await m_page.screenshot(path=scr_path)

            status = "PASS" if (h_vis and l_vis and not overflow and h_op == "1" and l_op == "1") else "FAIL"
            print(f"[{status}] Mobile {route['name']}: Heading={h_vis} (op={h_op}) | Lead={l_vis} (op={l_op}) | Overflow={overflow}")

        await m_page.close()
        await mobile_context.close()

        await browser.close()

        # Save json results
        with open("docs/evidence/phase-51/verification_results.json", "w", encoding="utf-8") as f:
            json.dump({
                "results": results,
                "tab_recovery_pass": tab_recovery_pass
            }, f, indent=2)

        print("\n=================== VERIFICATION SUMMARY ===================")
        all_passed = all(r["status"] == "PASS" for r in results) and tab_recovery_pass
        print(f"Overall Result: {'100% PASSED' if all_passed else 'SOME CHECKS FAILED'}")

if __name__ == "__main__":
    asyncio.run(run())

