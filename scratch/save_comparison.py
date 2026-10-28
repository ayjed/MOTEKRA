import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Pad img2 to 488 height
img2_padded = cv2.copyMakeBorder(img2, 0, 488 - 426, 0, 0, cv2.BORDER_CONSTANT, value=[255, 255, 255])
comparison = np.vstack([img1, img2_padded])
cv2.imwrite("scratch/comparison.png", comparison)
print("Saved comparison.png")

