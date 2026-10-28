import cv2
import numpy as np

c_uiux = cv2.imread("docs/evidence/phase-46/element-preview-card-ui-ux.png")
c_webdev = cv2.imread("docs/evidence/phase-46/element-preview-card-web-dev.png")

# Let's check pixel at x=350, y=50 (top right, which should be pure white background):
print("Pixel at (x=350, y=50) in UI/UX:", c_uiux[50, 350])
print("Pixel at (x=350, y=50) in Web Dev:", c_webdev[50, 350])

# Let's check pixel at x=400, y=100 (right margin, white background):
print("Pixel at (x=400, y=100) in UI/UX:", c_uiux[100, 400])
print("Pixel at (x=400, y=100) in Web Dev:", c_webdev[100, 400])

# Let's check pixel at x=50, y=300 (bottom left, white desk or shadow):
print("Pixel at (x=50, y=300) in UI/UX:", c_uiux[300, 50])
print("Pixel at (x=50, y=300) in Web Dev:", c_webdev[300, 50])

