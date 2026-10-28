import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/work_heading_frames/*.png"))

print(f"{'Time':<8} {'Dot_X':<8} {'Dot_Y':<8} {'I_X':<8} {'I_Y':<8} {'Line2_X':<8} {'Line2_Y':<8} {'Opacity':<8}")

for f in frames:
    img = cv2.imread(f)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Red dot in HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # red mask
    mask1 = cv2.inRange(hsv, np.array([0, 100, 100]), np.array([10, 255, 255]))
    mask2 = cv2.inRange(hsv, np.array([170, 100, 100]), np.array([180, 255, 255]))
    dot_mask = mask1 | mask2
    dot_pts = np.where(dot_mask > 0)
    dot_x = np.mean(dot_pts[1]) if len(dot_pts[1]) > 0 else 0
    dot_y = np.mean(dot_pts[0]) if len(dot_pts[0]) > 0 else 0
    
    # Letter 'I' in 'Ideas' is around x=100-300, y=100-250
    # Let's find the first vertical stroke of 'I'
    # 'I' has y around 100-240
    # Let's find dark pixels < 120 in y in [100, 250]
    sub = gray[100:250, 100:300]
    dark = np.where(sub < 120)
    
    basename = os.path.basename(f)
    time_str = basename.split("_")[2].replace("s", "")
    
    if len(dark[0]) > 50:
        # min x of the stroke
        i_x = np.min(dark[1]) + 100
        i_y = np.min(dark[0]) + 100
        # mean intensity of text
        mean_dark = np.mean(sub[dark])
        opacity_est = (255 - mean_dark) / 255.0
        
        # Also check second line "deliver" around y=240-350, x=100-300
        sub2 = gray[240:320, 100:300]
        dark2 = np.where(sub2 < 120)
        if len(dark2[0]) > 50:
            l2_x = np.min(dark2[1]) + 100
            l2_y = np.min(dark2[0]) + 240
        else:
            l2_x = 0
            l2_y = 0
            
        print(f"{time_str:<8} {dot_x:<8.1f} {dot_y:<8.1f} {i_x:<8} {i_y:<8} {l2_x:<8} {l2_y:<8} {opacity_est:<8.2f}")
    else:
        print(f"{time_str:<8} {dot_x:<8.1f} {dot_y:<8.1f} {'--':<8} {'--':<8} {'--':<8} {'--':<8} {'--':<8}")

