import cv2

img1 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_95dc7033.png")
img2 = cv2.imread(r"C:/Users/DELL/.gemini/antigravity/brain/603a94eb-f5c0-4339-9b5b-b7c487f97988/.user_uploaded/media_1793153345868_6f76fbb2.png")

# Crop phone from both
phone1 = img1[:, :300]
phone2 = img2[:, :300]

cv2.imwrite("scratch/phone1.png", phone1)
cv2.imwrite("scratch/phone2.png", phone2)
print("Saved phone1.png and phone2.png")

