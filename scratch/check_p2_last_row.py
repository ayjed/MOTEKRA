import cv2
import numpy as np

img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Look at rows 415 to 425 in col 50 to 250
gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
print("Row 424 col 50 to 250 values:")
print(gray[424, 50:250:10])
print("\nRow 425 (last row) col 50 to 250 values:")
print(gray[425, 50:250:10])

