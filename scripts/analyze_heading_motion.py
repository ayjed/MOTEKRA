import cv2
import numpy as np
import os

video_path = "ggggggggggg.mp4"
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)

# Let's extract fine-grained frames between 4.7s and 5.5s (work heading entrance) at every single frame (30fps)!
out_dir = "scratch/work_heading_frames"
os.makedirs(out_dir, exist_ok=True)

start_frame = int(4.7 * fps)
end_frame = int(5.6 * fps)

cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
curr_frame = start_frame

while curr_frame <= end_frame:
    ret, frame = cap.read()
    if not ret:
        break
    t = curr_frame / fps
    # Crop the region of the heading (around y=500 to 720, x=50 to 900)
    # Let's save both the crop and the full frame
    crop = frame[400:720, 50:900]
    cv2.imwrite(f"{out_dir}/frame_{curr_frame:04d}_{t:.3f}s_crop.png", crop)
    curr_frame += 1

# Also let's extract services heading entrance (around 2.5s to 3.5s)
services_dir = "scratch/services_heading_frames"
os.makedirs(services_dir, exist_ok=True)

start_frame_serv = int(2.5 * fps)
end_frame_serv = int(3.5 * fps)

cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame_serv)
curr_frame = start_frame_serv

while curr_frame <= end_frame_serv:
    ret, frame = cap.read()
    if not ret:
        break
    t = curr_frame / fps
    crop = frame[200:550, 50:700]
    cv2.imwrite(f"{services_dir}/frame_{curr_frame:04d}_{t:.3f}s_crop.png", crop)
    curr_frame += 1

# Also let's extract process heading entrance (around 13.5s to 14.8s)
process_dir = "scratch/process_heading_frames"
os.makedirs(process_dir, exist_ok=True)

start_frame_proc = int(13.5 * fps)
end_frame_proc = int(14.8 * fps)

cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame_proc)
curr_frame = start_frame_proc

while curr_frame <= end_frame_proc:
    ret, frame = cap.read()
    if not ret:
        break
    t = curr_frame / fps
    crop = frame[100:600, 50:700]
    cv2.imwrite(f"{process_dir}/frame_{curr_frame:04d}_{t:.3f}s_crop.png", crop)
    curr_frame += 1

cap.release()
print("Fine-grained frames extracted.")

