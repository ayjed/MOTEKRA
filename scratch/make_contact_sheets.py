import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))

# Create 3 contact sheets:
# Sheet 1: frames 0-29 (0s to 29s)
# Sheet 2: frames 30-59 (30s to 59s)
# Sheet 3: frames 60-88 (60s to 88s)

def make_sheet(frame_subset, out_name):
    thumb_w, thumb_h = 320, 180
    cols = 5
    rows = (len(frame_subset) + cols - 1) // cols
    sheet = np.zeros((rows * thumb_h, cols * thumb_w, 3), dtype=np.uint8)
    
    for idx, fpath in enumerate(frame_subset):
        img = cv2.imread(fpath)
        thumb = cv2.resize(img, (thumb_w, thumb_h))
        # Add timestamp label
        sec = int(idx * (frames.index(frame_subset[-1]) - frames.index(frame_subset[0]) + 1) / len(frame_subset)) # approx
        cv2.putText(thumb, os.path.basename(fpath).replace(".jpg", ""), (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
        r = idx // cols
        c = idx % cols
        sheet[r*thumb_h:(r+1)*thumb_h, c*thumb_w:(c+1)*thumb_w] = thumb
        
    cv2.imwrite(out_name, sheet)
    print(f"Saved {out_name}")

make_sheet(frames[:30], "scratch/sheet1.jpg")
make_sheet(frames[30:60], "scratch/sheet2.jpg")
make_sheet(frames[60:], "scratch/sheet3.jpg")
