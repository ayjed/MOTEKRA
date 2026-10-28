import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))
out_dir = "scratch/nav_overlap_inspection"
os.makedirs(out_dir, exist_ok=True)

# The floating header is roughly at x=200..1700, y=10..90
# Let's inspect frames where text or headings pass near y=10..120
for idx, fpath in enumerate(frames):
    img = cv2.imread(fpath)
    # Crop the top 200 rows
    top_area = img[:200, :]
    # Save every 5th frame or when something is near the header
    if idx % 3 == 0:
        cv2.imwrite(os.path.join(out_dir, f"top_{idx:03d}.jpg"), top_area)

print(f"Saved top area crops to {out_dir}")

