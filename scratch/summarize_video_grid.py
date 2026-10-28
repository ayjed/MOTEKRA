import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))

# Let's write an analysis script to check:
# 1. Background color of main content (light vs dark)
# 2. Key text/elements in view
# Let's save a collage of 16 key frames from the 88 seconds
key_indices = [0, 5, 12, 18, 25, 30, 36, 42, 48, 54, 60, 66, 72, 78, 83, 88]
collage = []
for idx in key_indices:
    if idx < len(frames):
        img = cv2.imread(frames[idx])
        # Resize to 477x216
        small = cv2.resize(img, (477, 216))
        # Draw label
        cv2.putText(small, f"t={idx}s", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        collage.append(small)

# 4x4 grid
rows = []
for r in range(4):
    row_imgs = collage[r*4:(r+1)*4]
    rows.append(np.hstack(row_imgs))
grid = np.vstack(rows)
cv2.imwrite("scratch/video_summary_grid.jpg", grid)
print("Saved scratch/video_summary_grid.jpg")

