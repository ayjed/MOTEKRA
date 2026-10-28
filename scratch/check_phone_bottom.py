import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Inspect phone bottom rows in both
# In img1: phone is in cols 40 to 280
print("img1 phone bottom rows:")
for r in range(450, 488, 5):
    p_pixels = img1[r, 40:280, :3]
    dark_cnt = np.sum(cv2.cvtColor(p_pixels[None, :, :], cv2.COLOR_BGR2GRAY) < 240)
    print(f"  row {r}: {dark_cnt} non-white pixels")

print("\nimg2 phone bottom rows:")
for r in range(400, 426, 3):
    p_pixels = img2[r, 40:280, :3]
    dark_cnt = np.sum(cv2.cvtColor(p_pixels[None, :, :], cv2.COLOR_BGR2GRAY) < 240)
    print(f"  row {r}: {dark_cnt} non-white pixels")

