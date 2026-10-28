from PIL import Image

banner = Image.open("MOTEKRA_X_HEADED_1640x624.png").convert("RGBA")

# Bounding box of text
# min_x=815, max_x=1307, min_y=233, max_y=276
min_x, max_x = 814, 1308
min_y, max_y = 232, 277
width = max_x - min_x + 1
height = max_y - min_y + 1

# Sample background directly above (y=226) and below (y=284)
bg_map = {}
for x in range(min_x, max_x + 1):
    top_p = banner.getpixel((x, 226))
    bot_p = banner.getpixel((x, 284))
    r = (top_p[0] + bot_p[0]) / 2.0
    g = (top_p[1] + bot_p[1]) / 2.0
    b = (top_p[2] + bot_p[2]) / 2.0
    lum = (r + g + b) / 3.0
    bg_map[x] = lum

out_dark = Image.new("RGBA", (width, height), (0, 0, 0, 0))
out_white = Image.new("RGBA", (width, height), (0, 0, 0, 0))

for y in range(min_y, max_y + 1):
    out_y = y - min_y
    for x in range(min_x, max_x + 1):
        out_x = x - min_x
        p = banner.getpixel((x, y))
        p_lum = (p[0] + p[1] + p[2]) / 3.0
        bg_lum = bg_map[x]
        
        if p_lum >= bg_lum - 1.5:
            alpha = 0
        else:
            # Exact optical formula: alpha = 1 - (p_lum / bg_lum)
            alpha_ratio = 1.0 - (p_lum / bg_lum)
            # Slight contrast curve to eliminate background noise while preserving subpixel edge anti-aliasing
            alpha = max(0, min(255, int(alpha_ratio * 258)))
            
        if alpha > 0:
            out_dark.putpixel((out_x, out_y), (8, 21, 43, alpha))
            out_white.putpixel((out_x, out_y), (255, 255, 255, alpha))

# Trim any transparent borders
bbox = out_dark.getbbox()
print("Trimmed bbox:", bbox)
trimmed_dark = out_dark.crop(bbox)
trimmed_white = out_white.crop(bbox)

print("Final wordmark dimensions:", trimmed_dark.size)

# Save to public/assets/brand/
trimmed_dark.save("public/assets/brand/motekra-wordmark.png")
trimmed_white.save("public/assets/brand/motekra-wordmark-white.png")
print("Saved public/assets/brand/motekra-wordmark.png and motekra-wordmark-white.png")
