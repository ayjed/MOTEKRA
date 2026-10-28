import cv2

img = cv2.imread("scratch/video_key_moments/56_services_page.jpg")
# Header is at top: row 0 to 180
cv2.imwrite("scratch/services_page_header_check.jpg", img[:220, :])
print("Saved services_page_header_check.jpg")

