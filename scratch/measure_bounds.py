import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")
img2[:8, :] = 255

# Let's find the phone screen area:
# In phone 1: bright blue header on phone screen (B > 180, R < 100)
# In phone 2: bright blue button on phone screen (B > 180, R < 100)
# Let's find the phone outer boundary in both
# In both images, the phone is in cols 0 to 280.
for name, img in [("img1", img1), ("img2", img2)]:
    gray = cv2.cvtColor(img[:, :280, :3], cv2.COLOR_BGR2GRAY)
    # Mask of phone where gray < 240
    mask = gray < 240
    y_idxs, x_idxs = np.where(mask)
    print(f"\n{name} phone:")
    print(f"  y: min={y_idxs.min()}, max={y_idxs.max()}, h={y_idxs.max()-y_idxs.min()+1}")
    print(f"  x: min={x_idxs.min()}, max={x_idxs.max()}, w={x_idxs.max()-x_idxs.min()+1}")

    # Laptop screen width: from top-left bezel to top-right bezel
    laptop_gray = cv2.cvtColor(img[:, 240:, :3], cv2.COLOR_BGR2GRAY)
    l_mask = laptop_gray < 240
    ly, lx = np.where(l_mask)
    print(f"{name} laptop:")
    print(f"  y: min={ly.min()}, max={ly.max()}, h={ly.max()-ly.min()+1}")
    print(f"  x: min={lx.min()}, max={lx.max()}, w={lx.max()-lx.min()+1}")

