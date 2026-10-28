import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")
# Clean top artifact of img2
img2[:8, :] = 255

# 1. Phone dimensions
# The phone has a dark outer border/frame
# Let's crop the phone region: x in [0, 300], y in [0, 500]
p1 = img1[:, :280]
p2 = img2[:, :280]

# Phone screen or frame edges
# Let's find the speaker / dynamic island at the top of the phone
# In phone 1: dynamic island / pill notch
# In phone 2: dynamic island / pill notch
gray1 = cv2.cvtColor(p1[:, :, :3], cv2.COLOR_BGR2GRAY)
gray2 = cv2.cvtColor(p2[:, :, :3], cv2.COLOR_BGR2GRAY)

# Dark pill notch inside phone (gray < 30, y < 100, x in [100, 200])
notch1 = np.where((gray1 < 30) & (np.arange(p1.shape[1])[None, :] > 100) & (np.arange(p1.shape[1])[None, :] < 200) & (np.arange(p1.shape[0])[:, None] < 100))
notch2 = np.where((gray2 < 30) & (np.arange(p2.shape[1])[None, :] > 100) & (np.arange(p2.shape[1])[None, :] < 200) & (np.arange(p2.shape[0])[:, None] < 100))

print("Notch 1 (UI/UX phone):")
print(f"  y: min={notch1[0].min()}, max={notch1[0].max()}, height={notch1[0].max()-notch1[0].min()+1}")
print(f"  x: min={notch1[1].min()}, max={notch1[1].max()}, width={notch1[1].max()-notch1[1].min()+1}")

print("Notch 2 (Web Dev phone):")
print(f"  y: min={notch2[0].min()}, max={notch2[0].max()}, height={notch2[0].max()-notch2[0].min()+1}")
print(f"  x: min={notch2[1].min()}, max={notch2[1].max()}, width={notch2[1].max()-notch2[1].min()+1}")

