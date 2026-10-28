import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))

# Let's inspect specific time segments to see what the user was demonstrating:
# 0s - 15s
# 15s - 30s
# 30s - 50s
# 50s - 70s
# 70s - 88s

print("Frame inspection:")
for idx in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85]:
    f = frames[idx]
    img = cv2.imread(f)
    h, w = img.shape[:2]
    # Check top portion (nav bar)
    nav_region = img[:100, :]
    # Check middle portion
    mid_region = img[100:600, :]
    print(f"Frame {idx} ({os.path.basename(f)}): w={w}, h={h}")

