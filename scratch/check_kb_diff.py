import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Compare rows 370 to 425 in cols 400 to 700:
# Is the keyboard in img1 and img2 identical?
# (The keyboard is hardware, so if it's the same 3D render, the keyboard keys should be identical!)
k1 = img1[370:425, 400:700].astype(float)
k2 = img2[370:425, 400:700].astype(float)

diff = np.abs(k1 - k2)
print("Difference on keyboard rows 370-425 cols 400-700:")
print("  Mean diff:", diff.mean())
print("  Max diff:", diff.max())

