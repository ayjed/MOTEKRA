import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

EVIDENCE_DIR = os.path.join(os.getcwd(), "docs", "evidence", "phase-48")
os.makedirs(EVIDENCE_DIR, exist_ok=True)

SERVICES = [
    {
        "slug": "ui-ux-design",
        "title": "UI/UX Design",
        "expected_focus": "Intuitive product design engineered for clarity, usability, and conversion.",
        "image_alt": "modern e-commerce dashboard"
    },
    {
        "slug": "web-development",
        "title": "Web Development",
        "expected_focus": "Modern web engineering built for speed, scalability, and resilience.",
        "image_alt": "Nexora website interface"
    },
    {
        "slug": "mobile-app-development",
        "title": "Mobile App Development",
        "expected_focus": "Native and cross-platform mobile products tailored for modern mobility.",
        "image_alt": "mobile application analytics"
    },
    {
        "slug": "product-strategy",
        "title": "Product Strategy",
        "expected_focus": "Clear product definition and actionable decision paths before engineering.",
        "image_alt": "Product strategy and analytics dashboard"
    },
    {
        "slug": "brand-visual-design",
        "title": "Brand & Visual Design",
        "expected_focus": "A unified visual language that builds trust, recognition, and product authority.",
        "image_alt": "Brand identity design system showcase"
    }
]

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)

        for s in SERVICES:
            slug = s["slug"]
            print(f"\n==========================================")
            print(f"Testing Service: {s['title']} (/services/{slug})")
            print(f"==========================================")

            # 1. Desktop Test
            context = browser.new_context(viewport={"width": 1440, "height": 900})
            page = context.new_page()
            url = f"http://localhost:3000/services/{slug}"
            page.goto(url, wait_until="networkidle")
            time.sleep(1.2)

            # Check Breadcrumbs
            breadcrumb = page.locator(".service-subpage-breadcrumbs").inner_text()
            print("Breadcrumbs:", breadcrumb.replace("\n", " "))
            assert "Home" in breadcrumb and "Services" in breadcrumb and s["title"] in breadcrumb

            # Check Hero Section
            hero_title = page.locator(".service-hero-title").inner_text()
            print("Hero title:", hero_title)
            assert s["title"] in hero_title

            hero_lead = page.locator(".service-hero-lead").inner_text()
            print("Hero lead:", hero_lead[:60] + "...")
            assert len(hero_lead) > 20

            # Check Hero CTA
            hero_cta = page.locator(".service-hero-action a").inner_text()
            print("Hero CTA:", hero_cta.replace("\n", " "))
            assert "Discuss Your Project" in hero_cta

            # Check Header Clearance
            hero_box = page.locator(".service-hero-title").bounding_box()
            header_box = page.locator(".site-header").bounding_box()
            print(f"Header bottom: {header_box['y'] + header_box['height']}, Hero Title top: {hero_box['y']}")
            assert hero_box['y'] >= header_box['y'] + header_box['height'], "Hero title must not collide with header"

            # Check Showcase Section
            showcase_heading = page.locator(".service-showcase-heading").inner_text()
            print("Showcase heading:", showcase_heading)
            assert s["expected_focus"] in showcase_heading

            highlights = page.locator(".service-showcase-highlights li").all_inner_texts()
            print(f"Showcase highlights count: {len(highlights)}")
            assert len(highlights) == 4

            # Check Showcase Image
            img_src = page.locator(".service-showcase-img").get_attribute("src")
            print("Showcase image src:", img_src)
            assert slug in img_src or "assets/services" in img_src

            badge_text = page.locator(".service-badge-text").inner_text()
            print("Badge text:", badge_text)
            assert len(badge_text) > 3

            # Check Deliverables Section (Exactly 4)
            deliverables = page.locator(".deliverable-item-card").all_inner_texts()
            print(f"Deliverables count: {len(deliverables)}")
            assert len(deliverables) == 4

            # Check Approach Section (Exactly 3)
            approach_steps = page.locator(".approach-step-card").all_inner_texts()
            print(f"Approach steps count: {len(approach_steps)}")
            assert len(approach_steps) == 3

            # Check FAQs Section (Exactly 3)
            faqs = page.locator(".service-faq-details").all()
            print(f"FAQ count: {len(faqs)}")
            assert len(faqs) == 3

            # Check FAQ interactive expansion
            summary_0 = faqs[0].locator("summary").inner_text()
            print("First FAQ question:", summary_0.replace("\n", " "))
            assert faqs[0].is_visible()

            # Check Contact Panel
            contact_panel = page.locator(".service-contact-panel").inner_text()
            print("Contact panel:", contact_panel[:50].replace("\n", " ") + "...")
            assert "Have a project in mind?" in contact_panel
            assert "Get in Touch" in contact_panel

            # Check Absence of Broken Elements & Disclaimers
            body_text = page.locator("body").inner_text()
            assert "Proposed service / scope under review" not in body_text, "Found unwanted scope disclaimer"
            assert "Provisional offering · deliverables subject to agreement" not in body_text, "Found unwanted provisional note"
            assert "No approved client case study is linked" not in body_text, "Found unwanted case study disclaimer"
            assert "Concept interface / built for this website / not client work" not in body_text, "Found raw playground note"

            # Capture desktop full page screenshot
            desktop_shot = os.path.join(EVIDENCE_DIR, f"{slug}_desktop.png")
            page.screenshot(path=desktop_shot, full_page=True)
            print(f"Saved desktop screenshot: {desktop_shot}")

            # 2. Mobile Responsive Test (390px)
            mobile_context = browser.new_context(viewport={"width": 390, "height": 844})
            mobile_page = mobile_context.new_page()
            mobile_page.goto(url, wait_until="networkidle")
            time.sleep(1)

            mobile_h1 = mobile_page.locator(".service-hero-title").bounding_box()
            mobile_header = mobile_page.locator(".site-header").bounding_box()
            print(f"Mobile header bottom: {mobile_header['y'] + mobile_header['height']}, Mobile H1 top: {mobile_h1['y']}")
            assert mobile_h1['y'] >= mobile_header['y'] + mobile_header['height'] - 10, "Mobile H1 should not collide with header"

            # Check zero horizontal overflow
            scroll_width = mobile_page.evaluate("document.documentElement.scrollWidth")
            client_width = mobile_page.evaluate("document.documentElement.clientWidth")
            print(f"Mobile widths: scroll={scroll_width}, client={client_width}")
            assert scroll_width <= client_width + 1, "Page must not have horizontal overflow on mobile"

            mobile_shot = os.path.join(EVIDENCE_DIR, f"{slug}_mobile.png")
            mobile_page.screenshot(path=mobile_shot, full_page=True)
            print(f"Saved mobile screenshot: {mobile_shot}")

            context.close()
            mobile_context.close()

        browser.close()
        print("\nAll 5 service subpages verified successfully across Desktop and Mobile!")

if __name__ == "__main__":
    verify()

