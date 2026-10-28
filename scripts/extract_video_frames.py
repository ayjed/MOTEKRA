import cv2
import os

video_path = "ggggggggggg.mp4"
output_dir = "scratch/video_analysis"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print(f"Error opening video: {video_path}")
    exit(1)

fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps

print(f"Video FPS: {fps}, Total Frames: {total_frames}, Duration: {duration:.2f}s")

# Specific key intervals where text appears and enters:
# 1. Hero text (Design / Davka)
# 2. Services text ("What we do")
# 3. Work text ("Ideas shape brands. We deliver")
# 4. Process text ("We collaborate closely. Shaping your brand together.")
# 5. Reviews text ("Success stories from our clients")

intervals = [
    ("hero", 1.5, 3.2, 0.1),
    ("services", 2.8, 4.2, 0.1),
    ("work", 4.5, 6.2, 0.1),
    ("process", 13.5, 15.2, 0.1),
    ("reviews", 17.5, 19.2, 0.1),
]

for label, start_s, end_s, step_s in intervals:
    t = start_s
    while t <= end_s:
        frame_idx = int(t * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if ret:
            filename = os.path.join(output_dir, f"{label}_{t:.2f}s.png")
            cv2.imwrite(filename, frame)
        t += step_s

cap.release()
print("All frames extracted successfully.")

