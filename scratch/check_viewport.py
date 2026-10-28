import cv2
import numpy as np

img = cv2.imread("docs/evidence/phase-46/desktop-1440-services-initial-ui-ux.png")
print("Screenshot shape:", img.shape)
print("Top row mean color:", img[0, :, :3].mean(axis=0))
print("Middle row mean color:", img[450, :, :3].mean(axis=0))
print("Bottom row mean color:", img[899, :, :3].mean(axis=0))

