import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/work_heading_frames/*.png"))

print(f"{'Frame':<15} {'Time':<8} {'Visible?':<10} {'Min_X':<8} {'Min_Y':<8} {'Max_X':<8} {'Max_Y':<8} {'Centroid_X':<12} {'Centroid_Y':<12} {'Text_Area':<10}")

for f in frames:
    img = cv2.imread(f)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Text is dark on white background (< 150)
    # The dot 'Featured work' is near the top; heading is in the lower half (y > 80)
    heading_region = gray[80:, :]
    
    dark_pixels = np.where(heading_region < 140)
    y_coords, x_coords = dark_pixels
    
    basename = os.path.basename(f)
    time_str = basename.split("_")[2].replace("s", "")
    
    if len(x_coords) > 500: # threshold for text visibility
        min_x = np.min(x_coords)
        max_x = np.max(x_coords)
        min_y = np.min(y_coords) + 80
        max_y = np.max(y_coords) + 80
        cx = np.mean(x_coords)
        cy = np.mean(y_coords) + 80
        area = len(x_coords)
        print(f"{basename:<15} {time_str:<8} {'YES':<10} {min_x:<8} {min_y:<8} {max_x:<8} {max_y:<8} {cx:<12.2f} {cy:<12.2f} {area:<10}")
    else:
        print(f"{basename:<15} {time_str:<8} {'NO':<10}")

