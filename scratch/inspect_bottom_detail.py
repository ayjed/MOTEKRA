import cv2
import numpy as np

img1 = cv2.imread("scratch/img1_bottom.png")
img2 = cv2.imread("scratch/img2_bottom.png")

print(f"img1 bottom slice shape: {img1.shape}")
print(f"img2 bottom slice shape: {img2.shape}")

# Look at the bottom of the laptop in img1:
# Trackpad is in cols ~450 to ~650
# Let's see the colors in img1 at row -1 (row 487 of full image):
print("img1 row 487 across laptop:")
print("  col 300 (phone side):", img1[-1, 300])
print("  col 500 (middle):", img1[-1, 500])
print("  col 700 (right):", img1[-1, 700])
print("  col 900 (far right):", img1[-1, 900])

print("\nimg2 row 425 across laptop:")
print("  col 300 (phone side):", img2[-1, 300])
print("  col 500 (middle):", img2[-1, 500])
print("  col 700 (right):", img2[-1, 700])
print("  col 900 (far right):", img2[-1, 900])

