import cv2
from PIL import Image
import os

img_b1 = Image.open("scratch/verB_ui_ux.png")
img_b2 = Image.open("scratch/verB_web_dev.png")

# Save as WebP with quality=92
img_b1.save("scratch/ui-ux-design.webp", "WEBP", quality=92, method=6)
img_b2.save("scratch/web-development.webp", "WEBP", quality=92, method=6)

# Also save as JPEG with quality=92 as fallback/comparison
img_b1.save("scratch/ui-ux-design.jpg", "JPEG", quality=92)
img_b2.save("scratch/web-development.jpg", "JPEG", quality=92)

print(f"ui-ux-design.webp size: {os.path.getsize('scratch/ui-ux-design.webp')} bytes")
print(f"web-development.webp size: {os.path.getsize('scratch/web-development.webp')} bytes")
print(f"ui-ux-design.jpg size: {os.path.getsize('scratch/ui-ux-design.jpg')} bytes")
print(f"web-development.jpg size: {os.path.getsize('scratch/web-development.jpg')} bytes")

