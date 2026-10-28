import cv2
import numpy as np

img1_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png"
img2_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"

img1 = cv2.imread(img1_path)
img2 = cv2.imread(img2_path)

# Save the bottom 80 rows of each image
cv2.imwrite("scratch/img1_bottom.png", img1[-80:, :])
cv2.imwrite("scratch/img2_bottom.png", img2[-80:, :])
print("Saved bottom slices")

