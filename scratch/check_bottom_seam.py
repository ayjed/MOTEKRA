import cv2
import numpy as np

c1 = cv2.imread("scratch/test_ui_ux_1200x900.png")
c2 = cv2.imread("scratch/test_web_dev_1200x900.png")

print("c1 bottom boundary:")
print("  Row 692 min value:", c1[692, 144:1055].min())
print("  Row 693 min value:", c1[693, 144:1055].min())
print("  Row 694 min value:", c1[694, 144:1055].min())

print("c2 bottom boundary:")
# y_offset + 426 = 632
print("  Row 631 min value:", c2[631, 144:1055].min())
print("  Row 632 min value:", c2[632, 144:1055].min())
print("  Row 633 min value:", c2[633, 144:1055].min())

