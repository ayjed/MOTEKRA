import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Let's inspect the phone screen corners
# Phone screen has 4 corners in 3D perspective:
# top-left, top-right, bottom-left, bottom-right.
# Also let's inspect the laptop screen in both images:
# Laptop screen top-left corner, top-right corner, bottom-left corner, bottom-right corner.

print(f"img1 shape: {img1.shape}")
print(f"img2 shape: {img2.shape}")

# Find laptop screen in img1 and img2:
# In img1: laptop screen contains "Discover Your Next Favorite"
# In img2: laptop screen contains "Build Smarter Digital Experiences."
# Let's measure the laptop display area (inner display dimensions)
# The display is bordered by the black bezel:
# Top bezel: y ~ 20-35
# Left bezel: x ~ 250
# Right bezel: x ~ 860-900
# Bottom bezel (above keyboard): y ~ ?
for name, img in [("img1", img1), ("img2", img2)]:
    # Find black bezel pixels: gray < 40 and x in [300, 800]
    gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
    bezel_pixels = (gray < 40) & (np.arange(img.shape[1])[None, :] > 300) & (np.arange(img.shape[1])[None, :] < 800)
    by, bx = np.where(bezel_pixels)
    print(f"\n{name} bezel:")
    print(f"  top bezel row: {by.min()}")
    # Where is the bottom bezel of the screen (before keyboard)?
    # Screen is tall, roughly from y=35 to y=380
    screen_bottom_bezel = by[(by > 300) & (by < 420)]
    if len(screen_bottom_bezel) > 0:
        print(f"  screen bottom bezel row: min={screen_bottom_bezel.min()}, max={screen_bottom_bezel.max()}")
        print(f"  Screen inner height: ~{screen_bottom_bezel.min() - by.min()}")

