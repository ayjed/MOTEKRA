import cv2
import numpy as np

img2_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"
img2 = cv2.imread(img2_path, cv2.IMREAD_UNCHANGED)

# Let's inspect rows 0 to 30 of img2
for row in range(30):
    non_white_in_row = np.where((img2[row, :, 0] < 250) | (img2[row, :, 1] < 250) | (img2[row, :, 2] < 250))[0]
    if len(non_white_in_row) > 0:
        print(f"Row {row}: {len(non_white_in_row)} non-white px, cols from {non_white_in_row.min()} to {non_white_in_row.max()}")

print("\n--- Bottom rows of img2 ---")
for row in range(img2.shape[0]-15, img2.shape[0]):
    non_white_in_row = np.where((img2[row, :, 0] < 250) | (img2[row, :, 1] < 250) | (img2[row, :, 2] < 250))[0]
    if len(non_white_in_row) > 0:
        print(f"Row {row}: {len(non_white_in_row)} non-white px, cols from {non_white_in_row.min()} to {non_white_in_row.max()}")

