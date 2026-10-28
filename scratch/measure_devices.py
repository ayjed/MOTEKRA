import cv2
import numpy as np

img1_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png"
img2_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"

img1 = cv2.imread(img1_path, cv2.IMREAD_UNCHANGED)
img2 = cv2.imread(img2_path, cv2.IMREAD_UNCHANGED)

# Clean top artifact on img2 (rows 0 to 7)
img2_cleaned = img2.copy()
img2_cleaned[0:8, :] = 255

for name, img in [("img1 (UI/UX)", img1), ("img2 (Web Dev)", img2_cleaned)]:
    # Find bounding box of content where brightness is significantly darker than white (< 245)
    gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
    mask = gray < 248
    
    y_idxs, x_idxs = np.where(mask)
    print(f"=== {name} ===")
    print(f"Original dimensions: {img.shape[1]}x{img.shape[0]}")
    print(f"Content bbox (<248): xmin={x_idxs.min()}, xmax={x_idxs.max()}, ymin={y_idxs.min()}, ymax={y_idxs.max()}")
    print(f"Content width: {x_idxs.max() - x_idxs.min() + 1}, height: {y_idxs.max() - y_idxs.min() + 1}")
    
    # Phone bbox: phone is on the left (x < 300)
    phone_mask = mask & (np.arange(img.shape[1])[None, :] < 300)
    py, px = np.where(phone_mask)
    if len(px) > 0:
        print(f"Phone bbox: x=[{px.min()}, {px.max()}], y=[{py.min()}, {py.max()}], w={px.max()-px.min()+1}, h={py.max()-py.min()+1}")
        
    # Laptop screen top: where laptop screen begins (x > 200, y < 200)
    laptop_mask = mask & (np.arange(img.shape[1])[None, :] > 200)
    ly, lx = np.where(laptop_mask)
    if len(lx) > 0:
        print(f"Laptop bbox: x=[{lx.min()}, {lx.max()}], y=[{ly.min()}, {ly.max()}], w={lx.max()-lx.min()+1}, h={ly.max()-ly.min()+1}")

