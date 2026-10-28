import cv2
import numpy as np

# Let's inspect the preview card area in desktop-1440-services-initial-ui-ux.png
# and desktop-1440-services-web-development-open.png
img_uiux = cv2.imread("docs/evidence/phase-46/desktop-1440-services-initial-ui-ux.png")
img_webdev = cv2.imread("docs/evidence/phase-46/desktop-1440-services-web-development-open.png")

print(f"Captured screenshot shape: {img_uiux.shape}")

# Find where the preview card is in the screenshot:
# Preview card has white background in the media stack
# Find white pixels (RGB == 255, 255, 255)
white_uiux = np.where((img_uiux[:, :, 0] > 250) & (img_uiux[:, :, 1] > 250) & (img_uiux[:, :, 2] > 250))
print(f"White card area in UI/UX: y in [{white_uiux[0].min()}, {white_uiux[0].max()}], x in [{white_uiux[1].min()}, {white_uiux[1].max()}]")

white_webdev = np.where((img_webdev[:, :, 0] > 250) & (img_webdev[:, :, 1] > 250) & (img_webdev[:, :, 2] > 250))
print(f"White card area in Web Dev: y in [{white_webdev[0].min()}, {white_webdev[0].max()}], x in [{white_webdev[1].min()}, {white_webdev[1].max()}]")

# Crop the preview card from both screenshots to inspect
ymin = min(white_uiux[0].min(), white_webdev[0].min()) - 20
ymax = max(white_uiux[0].max(), white_webdev[0].max()) + 60
xmin = min(white_uiux[1].min(), white_webdev[1].min()) - 20
xmax = max(white_uiux[1].max(), white_webdev[1].max()) + 20

cv2.imwrite("docs/evidence/phase-46/card-crop-ui-ux.png", img_uiux[ymin:ymax, xmin:xmax])
cv2.imwrite("docs/evidence/phase-46/card-crop-web-dev.png", img_webdev[ymin:ymax, xmin:xmax])
print(f"Saved card crops of size {xmax-xmin} x {ymax-ymin}")

