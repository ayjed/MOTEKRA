import cv2
import numpy as np

c2 = cv2.imread("scratch/test_web_dev_1200x900.png")

# Let's inspect the transition at row 630-635 across cols 400 to 750
print("test_web_dev_1200x900.png rows 628 to 635 at col 500:")
for r in range(628, 636):
    print(f"  row {r}: {c2[r, 500]}")

# Also at col 600:
print("\ntest_web_dev_1200x900.png rows 628 to 635 at col 600:")
for r in range(628, 636):
    print(f"  row {r}: {c2[r, 600]}")

