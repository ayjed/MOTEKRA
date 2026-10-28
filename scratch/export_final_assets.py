import cv2
import numpy as np
from PIL import Image

# 1. Load source images
img1_src = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png", cv2.IMREAD_UNCHANGED)[:, :, :3]
img2_src = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png", cv2.IMREAD_UNCHANGED)[:, :, :3]

# 2. Clean img2 top 8 artifact rows
img2_src[:8, :] = 255

# 3. Add soft contact shadow extension below img2 row 425
extended_img2 = np.full((431, img2_src.shape[1], 3), 255, dtype=np.uint8)
extended_img2[:426, :] = img2_src
last_row = img2_src[425, :, :3].astype(float)
mask = last_row.mean(axis=1) < 240
for r_offset, weight in enumerate([0.70, 0.45, 0.20, 0.08, 0.02], 1):
    r = 425 + r_offset
    for c in range(img2_src.shape[1]):
        if mask[c]:
            val = last_row[c] * (1.0 - weight) + 255.0 * weight
            extended_img2[r, c] = np.clip(val, 0, 255)

# 4. Clean white background function (ensuring seamless pure white #FFFFFF)
def clean_white(img):
    res = img.astype(np.float32)
    min_chan = np.minimum(np.minimum(res[:, :, 0], res[:, :, 1]), res[:, :, 2])
    ramp = np.clip((min_chan - 246.0) / 5.0, 0.0, 1.0)
    for c in range(3):
        res[:, :, c] = res[:, :, c] * (1.0 - ramp) + 255.0 * ramp
    return np.clip(res, 0, 255).astype(np.uint8)

i1 = clean_white(img1_src)
i2 = clean_white(extended_img2)

# 5. Place on unified 4:3 canvas (1040 x 780)
canvas_w, canvas_h = 1040, 780
x_offset = (canvas_w - 911) // 2   # 64
y_offset = (canvas_h - 488) // 2   # 146

c1 = np.full((canvas_h, canvas_w, 3), 255, dtype=np.uint8)
c2 = np.full((canvas_h, canvas_w, 3), 255, dtype=np.uint8)

c1[y_offset:y_offset+i1.shape[0], x_offset:x_offset+i1.shape[1]] = i1
c2[y_offset:y_offset+i2.shape[0], x_offset:x_offset+i2.shape[1]] = i2

# 6. Convert to PIL Image (RGB)
rgb1 = cv2.cvtColor(c1, cv2.COLOR_BGR2RGB)
rgb2 = cv2.cvtColor(c2, cv2.COLOR_BGR2RGB)
pil1 = Image.fromarray(rgb1)
pil2 = Image.fromarray(rgb2)

# 7. Save WebP and JPEG to public/assets/services/
out_dir = r"public/assets/services"
pil1.save(f"{out_dir}/ui-ux-design.webp", "WEBP", quality=92, method=6)
pil1.save(f"{out_dir}/ui-ux-design.jpg", "JPEG", quality=92)

pil2.save(f"{out_dir}/web-development.webp", "WEBP", quality=92, method=6)
pil2.save(f"{out_dir}/web-development.jpg", "JPEG", quality=92)

print("Exported production assets to public/assets/services/ successfully.")

