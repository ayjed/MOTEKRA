import sys
import time
import os
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

EVIDENCE_DIR = os.path.join(os.getcwd(), "docs", "evidence", "phase-47")
os.makedirs(EVIDENCE_DIR, exist_ok=True)

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("[1/5] Testing Home page...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.5)
        
        # Verify hero button text
        hero_buttons = page.locator(".home-hero .button-group a").all_inner_texts()
        print("Hero buttons:", hero_buttons)
        assert any("Get in Touch" in b for b in hero_buttons), "Hero should have 'Get in Touch' button"
        
        # Verify homepage projects
        project_titles = page.locator(".davka-project-title").all_inner_texts()
        print("Featured projects:", project_titles)
        assert len(project_titles) == 2, f"Expected 2 projects, got {len(project_titles)}"
        assert "TOG Africa" in project_titles
        assert "ConnectAPI" in project_titles

        # Verify preview card has no caption bar
        caption_bars = page.locator(".services-preview-caption-bar").count()
        print("Caption bar count in services preview:", caption_bars)
        assert caption_bars == 0, "Caption bar should be removed"

        page.screenshot(path=os.path.join(EVIDENCE_DIR, "01_home_hero.png"))
        
        # Scroll to services
        page.locator("#home-services").scroll_into_view_if_needed()
        time.sleep(1)
        page.screenshot(path=os.path.join(EVIDENCE_DIR, "02_home_services_preview.png"))

        print("[2/5] Testing Contact page...")
        page.goto("http://localhost:3000/contact", wait_until="networkidle")
        time.sleep(1.5)
        
        # Check header clearance
        hero_box = page.locator(".contact-hero h1").bounding_box()
        header_box = page.locator(".site-header").bounding_box()
        print(f"Header bottom: {header_box['y'] + header_box['height']}, Contact H1 top: {hero_box['y']}")
        assert hero_box['y'] >= header_box['y'] + header_box['height'], "Contact H1 must not overlap header"

        # Check form heading
        inquiry_h2 = page.locator("#inquiry-heading").inner_text()
        print("Inquiry heading:", inquiry_h2)
        assert "Tell Us About Your Project." in inquiry_h2, f"Unexpected inquiry heading: {inquiry_h2}"

        # Check inquiry lead
        inquiry_lead = page.locator(".inquiry-lead").inner_text()
        print("Inquiry lead:", inquiry_lead)
        assert "Share a few details about what you have in mind." in inquiry_lead

        # Check no redundant eyebrows
        eyebrow_texts = page.locator(".contact-hero .eyebrow, .contact-inquiry .eyebrow, .contact-faq-sidebar .eyebrow").all_inner_texts()
        print("Contact page redundant eyebrows:", eyebrow_texts)
        assert len(eyebrow_texts) == 0, f"Expected 0 redundant eyebrows, got: {eyebrow_texts}"

        page.screenshot(path=os.path.join(EVIDENCE_DIR, "03_contact_hero.png"))
        page.locator("#inquiry").scroll_into_view_if_needed()
        time.sleep(0.8)
        page.screenshot(path=os.path.join(EVIDENCE_DIR, "04_contact_inquiry_form.png"))

        print("[3/5] Testing Services page...")
        page.goto("http://localhost:3000/services", wait_until="networkidle")
        time.sleep(1.5)

        # Check header clearance
        services_h1 = page.locator("#services-main-heading").bounding_box()
        header_box = page.locator(".site-header").bounding_box()
        print(f"Header bottom: {header_box['y'] + header_box['height']}, Services H1 top: {services_h1['y']}")
        assert services_h1['y'] >= header_box['y'] + header_box['height'], "Services H1 must not overlap header"

        # Check no caption bar on /services
        assert page.locator(".services-preview-caption-bar").count() == 0

        page.screenshot(path=os.path.join(EVIDENCE_DIR, "05_services_hero.png"))

        print("[4/5] Testing About page...")
        page.goto("http://localhost:3000/about", wait_until="networkidle")
        time.sleep(1.5)

        # Check header clearance
        about_h1 = page.locator(".editorial-hero h1").bounding_box()
        header_box = page.locator(".site-header").bounding_box()
        print(f"Header bottom: {header_box['y'] + header_box['height']}, About H1 top: {about_h1['y']}")
        assert about_h1['y'] >= header_box['y'] + header_box['height'], "About H1 must not overlap header"

        page.screenshot(path=os.path.join(EVIDENCE_DIR, "06_about_hero.png"))

        print("[5/5] Testing Work page...")
        page.goto("http://localhost:3000/work", wait_until="networkidle")
        time.sleep(1.5)

        work_projects = page.locator(".work-card-title").all_inner_texts()
        print("Work page projects:", work_projects)
        assert len(work_projects) == 4, f"Work page should have 4 projects, found {len(work_projects)}"

        page.screenshot(path=os.path.join(EVIDENCE_DIR, "07_work_grid.png"))

        # Mobile responsiveness check on Contact
        print("[Mobile] Testing Contact on mobile viewport (390x844)...")
        mobile_context = browser.new_context(viewport={"width": 390, "height": 844})
        mobile_page = mobile_context.new_page()
        mobile_page.goto("http://localhost:3000/contact", wait_until="networkidle")
        time.sleep(1.2)
        mobile_h1 = mobile_page.locator(".contact-hero h1").bounding_box()
        mobile_header = mobile_page.locator(".site-header").bounding_box()
        print(f"Mobile header bottom: {mobile_header['y'] + mobile_header['height']}, Mobile H1 top: {mobile_h1['y']}")
        assert mobile_h1['y'] >= mobile_header['y'] + mobile_header['height'] - 10, "Mobile H1 should not collide with header"
        mobile_page.screenshot(path=os.path.join(EVIDENCE_DIR, "08_mobile_contact.png"))

        browser.close()
        print("\nAll automated checks passed successfully!")

if __name__ == "__main__":
    verify()
