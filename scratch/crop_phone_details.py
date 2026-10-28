import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Let's check what is at row 420-488 in img1 for the phone:
# In phone 1: is there an "Add to Cart" button at the bottom of the phone screen?
# In phone 2: is there a "Get Started" button or stat numbers?
# Let's inspect the screen text on phone 1 vs phone 2
cv2.imwrite("scratch/p1_crop.png", img1[25:485, 40:270])
cv2.imwrite("scratch/p2_crop.png", img2[25:425, 40:270])
print(f"p1_crop shape: {img1[25:485, 40:270].shape}")
print(f"p2_crop shape: {img2[25:425, 40:270].shape}")

