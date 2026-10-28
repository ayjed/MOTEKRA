import cv2
import numpy as np

# Let's simulate desktop (4:3) and mobile (16:10) crops to visualize
canvas_w, canvas_h = 1200, 900

# Load test canvas
c1 = cv2.imread("scratch/test_ui_ux_1200x900.png")
c2 = cv2.imread("scratch/test_web_dev_1200x900.png")

# Mobile crop: aspect ratio 16:10 (container width W, container height W * 10/16 = W * 0.625)
# In 1200 width, mobile container height is 1200 * 10/16 = 750
crop_h = int(canvas_w * 10 / 16) # 750
y_start = (canvas_h - crop_h) // 2 # (900 - 750) // 2 = 75

mobile_crop1 = c1[y_start:y_start+crop_h, :]
mobile_crop2 = c2[y_start:y_start+crop_h, :]

cv2.imwrite("scratch/simulated_mobile_crop1.png", mobile_crop1)
cv2.imwrite("scratch/simulated_mobile_crop2.png", mobile_crop2)
print(f"Saved simulated_mobile_crop1.png (shape: {mobile_crop1.shape})")

