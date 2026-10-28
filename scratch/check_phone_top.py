import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")

# Find phone top corner (x between 50 and 250, y < 150)
gray = cv2.cvtColor(img1[:, :, :3], cv2.COLOR_BGR2GRAY)
phone_body = (gray < 240) & (np.arange(img1.shape[1])[None, :] < 260)
py, px = np.where(phone_body)
print(f"Phone body in img1: ymin={py.min()} at x={px[py == py.min()]}")
print(f"Phone left edge: xmin={px.min()} at y={py[px == px.min()]}")
print(f"Phone right edge: xmax={px.max()} at y={py[px == px.max()]}")

# Let's check what is at x=0 to 150, y=0 to 80
print(f"Top-left 80x150 pixels min brightness: {gray[0:80, 0:150].min()}")
print(f"Top-left 80x150 pixels mean brightness: {gray[0:80, 0:150].mean()}")

