import cv2

for name in ["56_services_page", "66_about_page_hero", "76_contact_page_hero", "80_contact_form"]:
    img = cv2.imread(f"scratch/video_key_moments/{name}.jpg")
    crop = img[:250, 400:1500]
    cv2.imwrite(f"scratch/{name}_top.jpg", crop)
    print(f"Saved scratch/{name}_top.jpg")

