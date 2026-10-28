import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Let's find where the keyboard begins in both images:
# Looking down column 600:
print("img1 column 600 from row 350 to 450:")
for r in range(360, 440, 10):
    print(f"  y={r}: {img1[r, 600]}")

print("\nimg2 column 600 from row 300 to 400:")
for r in range(300, 390, 10):
    print(f"  y={r}: {img2[r, 600]}")

