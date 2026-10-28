import cv2

b1 = cv2.imread("docs/evidence/phase-46/mobile-preview-box-ui-ux.png")
b2 = cv2.imread("docs/evidence/phase-46/mobile-preview-box-web-dev.png")

print(f"UI/UX mobile preview box: {b1.shape[1]}x{b1.shape[0]}")
print(f"Web Dev mobile preview box: {b2.shape[1]}x{b2.shape[0]}")

# Top corners of mobile preview box
print("b1 top-right corner (row 10, col -10):", b1[10, -10])
print("b2 top-right corner (row 10, col -10):", b2[10, -10])

# Bottom corners of mobile preview box
print("b1 bottom-left corner (row -10, col 10):", b1[-10, 10])
print("b2 bottom-left corner (row -10, col 10):", b2[-10, 10])

