import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

print("img1 corners:")
print("  (0,0):", img1[0, 0, :3])
print("  (0, 910):", img1[0, -1, :3])
print("  (10, 10):", img1[10, 10, :3])
print("  (10, 900):", img1[10, 900, :3])

print("img2 corners:")
print("  (10, 10):", img2[10, 10, :3])
print("  (10, 900):", img2[10, 900, :3])

