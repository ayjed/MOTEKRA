import cv2
import numpy as np

img2_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"
img2 = cv2.imread(img2_path, cv2.IMREAD_UNCHANGED)

# Let's inspect the top 15 rows
print("Rows 0-5 in col 300-305:")
print(img2[0:6, 300:305, :3])

# Save a crop of the top 25 rows
cv2.imwrite("scratch/img2_top.png", img2[0:30, 250:560])
print("Saved scratch/img2_top.png")

