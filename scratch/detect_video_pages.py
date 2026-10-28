import cv2
import numpy as np
import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))

# Let's check URL bar or page title area in the recording to see which route is visited
# The video shows a browser window. Let's find where the URL bar is or crop the browser address bar
img0 = cv2.imread(frames[0])
print("Resolution of video frames:", img0.shape)

# Let's check a strip of the top of the video (say y=0 to 120) to see if browser address bar is visible
cv2.imwrite("scratch/top_strip.jpg", img0[:150, :])
print("Saved top_strip.jpg")

