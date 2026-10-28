import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Look at laptop trackpad / keyboard bottom edge in both:
# In img1: laptop keyboard starts at y around 380, trackpad at ~430, bottom edge of laptop at ~470.
# Let's find the bottom edge of the laptop chassis (non-shadow, metallic or plastic)
for name, img in [("img1", img1), ("img2", img2)]:
    h, w = img.shape[:2]
    # Check middle of laptop base x=500 to 600
    column_strip = img[:, 550, :3]
    # Print the last 20 pixels of column 550
    print(f"\n{name} column 550 last 15 pixels (from row {h-15} to {h-1}):")
    for r in range(h-15, h):
        print(f"  y={r}: BGR={column_strip[r]}")

