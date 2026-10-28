import cv2
import numpy as np

img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Look at rows 420-425 in cols 530-580 (where MacBook thumb notch is)
print(img2[420:426, 545:565, 0])

