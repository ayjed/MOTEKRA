import cv2
import numpy as np

img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")
gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

# Look at cols 40 to 200, find bottom of phone
for r in range(350, 426):
    row_vals = gray[r, 40:220]
    dark_vals = np.where(row_vals < 200)[0]
    if len(dark_vals) > 0:
        print(f"Row {r}: min col {dark_vals.min()+40}, max col {dark_vals.max()+40}, count {len(dark_vals)}")
    else:
        print(f"Row {r}: all white")

