import cv2
import numpy as np

img1_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png"
img2_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"

img1 = cv2.imread(img1_path, cv2.IMREAD_UNCHANGED)
img2 = cv2.imread(img2_path, cv2.IMREAD_UNCHANGED)

# Ensure 3-channel BGR
if img1.shape[2] == 4:
    img1 = img1[:, :, :3]
if img2.shape[2] == 4:
    img2 = img2[:, :, :3]

# In img2, remove the top 7 rows artifact by setting to pure white
img2[:8, :] = 255

# Let's inspect the white background of both images:
# Pixels that are background (e.g. >= 251) should blend to 255 (pure white)
def clean_white_background(img):
    res = img.astype(np.float32)
    # Background threshold: where all channels are high
    # Soft ramp for values between 248 and 255
    min_chan = np.minimum(np.minimum(res[:, :, 0], res[:, :, 1]), res[:, :, 2])
    # If min_chan >= 251, make it 255
    # If min_chan is between 246 and 251, gently ramp
    ramp = np.clip((min_chan - 246.0) / 5.0, 0.0, 1.0)
    for c in range(3):
        res[:, :, c] = res[:, :, c] * (1.0 - ramp) + 255.0 * ramp
    return np.clip(res, 0, 255).astype(np.uint8)

img1_clean = clean_white_background(img1)
img2_clean = clean_white_background(img2)

# Check corner pixels of clean images
print("img1_clean corners:", img1_clean[0, 0], img1_clean[0, -1], img1_clean[10, 10])
print("img2_clean corners:", img2_clean[0, 0], img2_clean[0, -1], img2_clean[10, 10])

# Target 4:3 canvas: 1200 x 900
canvas_w, canvas_h = 1200, 900

# We want both images placed on a 1200x900 pure white canvas
# img1 is 911 x 488.
# img2 is 911 x 426.
# If we center img1 horizontally:
# x_offset = (1200 - 911) // 2 = 144
x_offset = (canvas_w - 911) // 2  # 144

# Vertically:
# For img1 (height 488):
# If centered: y_offset = (900 - 488) // 2 = 206
# Let's check where the laptop and phone sit with y_offset = 206:
# Laptop screen top in img1 is at y = 18 -> on canvas: 206 + 18 = 224
# Phone bottom in img1 is at y = 475 -> on canvas: 206 + 475 = 681
# Laptop bottom in img1 is at y = 487 -> on canvas: 206 + 487 = 693
# Canvas height is 900.
# Top margin: 224px. Bottom margin: 900 - 693 = 207px.
# This is beautifully balanced!
y_offset = (canvas_h - 488) // 2  # 206

# Canvas 1 (UI/UX)
c1 = np.full((canvas_h, canvas_w, 3), 255, dtype=np.uint8)
c1[y_offset:y_offset+img1_clean.shape[0], x_offset:x_offset+img1_clean.shape[1]] = img1_clean

# Canvas 2 (Web Dev)
# Use the EXACT same offsets (x_offset, y_offset) so the devices are in the EXACT SAME relative position!
c2 = np.full((canvas_h, canvas_w, 3), 255, dtype=np.uint8)
c2[y_offset:y_offset+img2_clean.shape[0], x_offset:x_offset+img2_clean.shape[1]] = img2_clean

# Save test outputs
cv2.imwrite("scratch/test_ui_ux_1200x900.png", c1)
cv2.imwrite("scratch/test_web_dev_1200x900.png", c2)
print("Saved scratch/test_ui_ux_1200x900.png and scratch/test_web_dev_1200x900.png")

