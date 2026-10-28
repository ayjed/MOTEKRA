import cv2
import numpy as np

img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")
img2[:8, :] = 255

# Let's inspect the bottom edge (row 425) of img2
last_row = img2[425, :, :3].astype(float)

# Create an extended image with 5 extra rows of natural contact shadow
extended_img2 = np.full((431, img2.shape[1], 3), 255, dtype=np.uint8)
extended_img2[:426, :] = img2

# Where last_row is dark (< 240), create a soft 3-4 pixel contact shadow fade
mask = last_row.mean(axis=1) < 240

for r_offset, weight in enumerate([0.7, 0.45, 0.2, 0.08, 0.02], 1):
    r = 425 + r_offset
    for c in range(img2.shape[1]):
        if mask[c]:
            val = last_row[c] * (1.0 - weight) + 255.0 * weight
            extended_img2[r, c] = np.clip(val, 0, 255)

cv2.imwrite("scratch/img2_extended.png", extended_img2)
print("Saved img2_extended.png")

