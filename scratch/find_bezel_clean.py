import cv2
import numpy as np

img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")
# Clean top 8 rows
img2[:8, :] = 255

gray = cv2.cvtColor(img2[:, :, :3], cv2.COLOR_BGR2GRAY)
bezel = (gray < 100) & (np.arange(img2.shape[1])[None, :] > 250)
by, bx = np.where(bezel)
print("img2 dark bezel (with row >= 8):")
print(f"  Top bezel min y={by.min()} at x={bx[by == by.min()]}")
print(f"  Top-left bezel corner: x={bx[by < by.min()+20].min()}, y={by[bx == bx[by < by.min()+20].min()].min()}")
print(f"  Top-right bezel corner: x={bx[by < by.min()+20].max()}, y={by[bx == bx[by < by.min()+20].max()].min()}")
print(f"  Width of top bezel: {bx[by < by.min()+20].max() - bx[by < by.min()+20].min()}")

