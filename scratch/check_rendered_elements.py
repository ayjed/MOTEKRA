import cv2
import numpy as np

c_uiux = cv2.imread("docs/evidence/phase-46/element-preview-card-ui-ux.png")
c_webdev = cv2.imread("docs/evidence/phase-46/element-preview-card-web-dev.png")

print(f"c_uiux shape: {c_uiux.shape}")
print(f"c_webdev shape: {c_webdev.shape}")

# Inspect the corners of the media stack inside the card
# The card top-left corner is curved (border radius 24px)
# Let's check pixel (50, 50) inside the media stack:
print("Pixel at (50, 50) in UI/UX:", c_uiux[50, 50])
print("Pixel at (50, 50) in Web Dev:", c_webdev[50, 50])

# Pixel at (200, 200) (should be on the mockup screen or background):
print("Pixel at (200, 200) in UI/UX:", c_uiux[200, 200])
print("Pixel at (200, 200) in Web Dev:", c_webdev[200, 200])

# Check caption bar at bottom (row ~400):
print("Caption bar at row 400:", c_uiux[400, 200])

