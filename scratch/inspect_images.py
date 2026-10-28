import cv2
import numpy as np

img1_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png"
img2_path = r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"

for idx, p in enumerate([img1_path, img2_path], 1):
    img = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    h, w = img.shape[:2]
    print(f"Image {idx}: shape = {img.shape}")
    
    # Check alpha if present
    if img.shape[2] == 4:
        alpha = img[:, :, 3]
        print(f"  Alpha min={alpha.min()}, max={alpha.max()}")
        b, g, r = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    else:
        b, g, r = img[:, :, 0], img[:, :, 1], img[:, :, 2]
        
    # Check background corners
    print(f"  Top-left pixel: BGR={b[0,0]},{g[0,0]},{r[0,0]}")
    print(f"  Top-right pixel: BGR={b[0,-1]},{g[0,-1]},{r[0,-1]}")
    print(f"  Bottom-left pixel: BGR={b[-1,0]},{g[-1,0]},{r[-1,0]}")
    print(f"  Bottom-right pixel: BGR={b[-1,-1]},{g[-1,-1]},{r[-1,-1]}")

    # Find non-white pixels (where any channel < 250)
    non_white = (b < 250) | (g < 250) | (r < 250)
    y_indices, x_indices = np.where(non_white)
    if len(y_indices) > 0:
        ymin, ymax = y_indices.min(), y_indices.max()
        xmin, xmax = x_indices.min(), x_indices.max()
        print(f"  Content bounding box (<250): ymin={ymin}, ymax={ymax}, xmin={xmin}, xmax={xmax}")
        print(f"  Content width={xmax - xmin + 1}, height={ymax - ymin + 1}")
        print(f"  Top margin: {ymin}, Bottom margin: {h - 1 - ymax}, Left margin: {xmin}, Right margin: {w - 1 - xmax}")
        
    # Also find soft shadow threshold (< 254)
    non_pure_white = (b < 254) | (g < 254) | (r < 254)
    y_indices2, x_indices2 = np.where(non_pure_white)
    if len(y_indices2) > 0:
        ymin2, ymax2 = y_indices2.min(), y_indices2.max()
        xmin2, xmax2 = x_indices2.min(), x_indices2.max()
        print(f"  Shadow/content bbox (<254): ymin={ymin2}, ymax={ymax2}, xmin={xmin2}, xmax={xmax2}")

