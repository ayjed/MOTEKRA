import cv2

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Save keyboard region of both (rows 370 to 488, cols 300 to 750)
cv2.imwrite("scratch/kb1.png", img1[370:488, 300:750])
cv2.imwrite("scratch/kb2.png", img2[370:426, 300:750])
print("Saved kb1.png and kb2.png")

