import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")
img2[:8, :] = 255

# Both images are 911 wide.
# Let's compare the outer frame of the phone in img1 and img2:
# Phone top-left corner is at x around 45-80, y around 35-100
crop1 = img1[35:100, 45:90, :3]
crop2 = img2[35:100, 45:90, :3]

diff = np.abs(crop1.astype(int) - crop2.astype(int))
print("Mean absolute difference on phone top frame:", diff.mean())

