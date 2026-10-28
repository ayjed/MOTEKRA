import cv2
import os

frames_dir = "scratch/video_audit_frames"
out_dir = "scratch/video_key_moments"
os.makedirs(out_dir, exist_ok=True)

# Select key seconds
moments = {
    "00_home_hero": 0,
    "05_home_projects_header": 5,
    "10_home_tog_africa": 10,
    "16_home_connectapi": 16,
    "20_home_services_top": 20,
    "24_home_services_accordion": 24,
    "28_home_process": 28,
    "32_home_testimonials": 32,
    "36_home_closing_cta": 36,
    "40_home_footer": 40,
    "44_navigating_work": 44,
    "48_work_page_hero": 48,
    "52_work_page_grid": 52,
    "56_services_page": 56,
    "60_services_process": 60,
    "66_about_page_hero": 66,
    "70_about_page_story": 70,
    "76_contact_page_hero": 76,
    "80_contact_form": 80,
    "84_contact_faq": 84,
}

for name, sec in moments.items():
    fname = os.path.join(frames_dir, f"frame_{sec:03d}_sec{sec:.1f}.jpg")
    if os.path.exists(fname):
        img = cv2.imread(fname)
        out_path = os.path.join(out_dir, f"{name}.jpg")
        cv2.imwrite(out_path, img)
        print(f"Saved {out_path}")

