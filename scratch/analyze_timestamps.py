import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))

# Let's inspect each 5-second interval:
# Find where the user scrolls or navigates
for i in range(0, len(frames), 4):
    f = frames[i]
    img = cv2.imread(f)
    # Check average color in center to know if light or dark section
    center_color = img[300:600, 400:1500].mean(axis=(0, 1))
    # Top nav color
    nav_color = img[20:70, 800:1100].mean(axis=(0, 1))
    print(f"t={i:02d}s: center BGR={center_color.astype(int)}, nav BGR={nav_color.astype(int)}")

