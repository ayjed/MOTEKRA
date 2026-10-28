import cv2
import numpy as np

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Let's find the top-left and top-right corners of the laptop screen
# In img1:
# The laptop screen top bevel has a dark edge
# Let's find the top-most row of the laptop screen (x between 250 and 800)
for name, img in [("img1", img1), ("img2", img2)]:
    # Find min y where pixel is dark (screen bezel)
    gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
    # Mask dark pixels (bezel is dark gray / black, say < 100)
    bezel = (gray < 100) & (np.arange(img.shape[1])[None, :] > 250)
    by, bx = np.where(bezel)
    print(f"\n{name} dark bezel:")
    print(f"  Top bezel min y={by.min()} at x={bx[by == by.min()]}")
    print(f"  Top-left bezel corner: x={bx[by < by.min()+20].min()}, y={by[bx == bx[by < by.min()+20].min()].min()}")
    print(f"  Top-right bezel corner: x={bx[by < by.min()+20].max()}, y={by[bx == bx[by < by.min()+20].max()].min()}")
    print(f"  Width of top bezel: {bx[by < by.min()+20].max() - bx[by < by.min()+20].min()}")

