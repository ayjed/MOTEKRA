import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

print("img1 row 487 (last row) dark columns:")
dark1 = np.where(img1[487, :, :3].min(axis=1) < 200)[0]
print(f"  Cols: min={dark1.min()}, max={dark1.max()}, count={len(dark1)}")
# Print sample pixels
print("  Sample values at col 300..320:", img1[487, 300:320, 0])

print("\nimg2 row 425 (last row) dark columns:")
dark2 = np.where(img2[425, :, :3].min(axis=1) < 200)[0]
print(f"  Cols: min={dark2.min()}, max={dark2.max()}, count={len(dark2)}")
print("  Sample values at col 300..320:", img2[425, 300:320, 0])

