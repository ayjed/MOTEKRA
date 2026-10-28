import cv2
import numpy as np

img1_clean = cv2.imread("scratch/test_ui_ux_1200x900.png")
# Let's recreate directly from source
img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png", cv2.IMREAD_UNCHANGED)[:, :, :3]
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png", cv2.IMREAD_UNCHANGED)[:, :, :3]
img2[:8, :] = 255

# Contact shadow on img2 bottom
extended_img2 = np.full((431, img2.shape[1], 3), 255, dtype=np.uint8)
extended_img2[:426, :] = img2
last_row = img2[425, :, :3].astype(float)
mask = last_row.mean(axis=1) < 240
for r_offset, weight in enumerate([0.7, 0.45, 0.2, 0.08, 0.02], 1):
    r = 425 + r_offset
    for c in range(img2.shape[1]):
        if mask[c]:
            val = last_row[c] * (1.0 - weight) + 255.0 * weight
            extended_img2[r, c] = np.clip(val, 0, 255)

def clean_white(img):
    res = img.astype(np.float32)
    min_chan = np.minimum(np.minimum(res[:, :, 0], res[:, :, 1]), res[:, :, 2])
    ramp = np.clip((min_chan - 246.0) / 5.0, 0.0, 1.0)
    for c in range(3):
        res[:, :, c] = res[:, :, c] * (1.0 - ramp) + 255.0 * ramp
    return np.clip(res, 0, 255).astype(np.uint8)

i1 = clean_white(img1)
i2 = clean_white(extended_img2)

# Version A: 1200 x 900
cA1 = np.full((900, 1200, 3), 255, dtype=np.uint8)
cA2 = np.full((900, 1200, 3), 255, dtype=np.uint8)
cA1[206:206+i1.shape[0], 144:144+i1.shape[1]] = i1
cA2[206:206+i2.shape[0], 144:144+i2.shape[1]] = i2
cv2.imwrite("scratch/verA_ui_ux.png", cA1)
cv2.imwrite("scratch/verA_web_dev.png", cA2)

# Version B: 1040 x 780 (4:3)
# Left offset = (1040 - 911) // 2 = 64
# y_offset = (780 - 488) // 2 = 146
cB1 = np.full((780, 1040, 3), 255, dtype=np.uint8)
cB2 = np.full((780, 1040, 3), 255, dtype=np.uint8)
cB1[146:146+i1.shape[0], 64:64+i1.shape[1]] = i1
cB2[146:146+i2.shape[0], 64:64+i2.shape[1]] = i2
cv2.imwrite("scratch/verB_ui_ux.png", cB1)
cv2.imwrite("scratch/verB_web_dev.png", cB2)

print("Saved Version A and Version B")

