import cv2
import numpy as np

c1 = cv2.imread("scratch/test_ui_ux_1200x900.png")
c2 = cv2.imread("scratch/test_web_dev_1200x900.png")

# Check rows right above y_offset (204, 205, 206, 207)
# and rows right below (206 + 488 = 694)
# and cols right next to x_offset (142, 143, 144, 145)
# and cols right next to 144 + 911 = 1055

for name, canvas in [("c1", c1), ("c2", c2)]:
    print(f"\nChecking {name} for seams:")
    # Check top boundary across cols 150 to 230 (left of laptop)
    top_strip = canvas[204:208, 150:230]
    print("  Top boundary non-255 pixels:", np.sum(top_strip < 255))
    
    # Check left boundary across rows 100 to 200 (above phone)
    left_strip = canvas[100:200, 142:146]
    print("  Left boundary non-255 pixels:", np.sum(left_strip < 255))
    
    # Check right boundary across rows 100 to 300
    right_strip = canvas[100:300, 1053:1057]
    print("  Right boundary non-255 pixels:", np.sum(right_strip < 255))

