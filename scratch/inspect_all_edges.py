import cv2
import numpy as np

for name, path in [
    ("img1", r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png"),
    ("img2", r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png"),
]:
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    print(f"\n=== {name} ===")
    print(f"Shape: {img.shape}")
    
    # Left edge (cols 0-5)
    print("Col 0 BGR:", img[img.shape[0]//2, 0, :3])
    # Right edge (cols -5 to -1)
    print(f"Col {img.shape[1]-1} BGR:", img[img.shape[0]//2, -1, :3])
    # Top edge (row 0)
    print("Row 0 BGR:", img[0, img.shape[1]//2, :3])
    # Bottom edge (row -1)
    print(f"Row {img.shape[0]-1} BGR:", img[-1, img.shape[1]//2, :3])

