import cv2
import os

video_path = r"c:\Users\DELL\Desktop\MESH PROJECT\MOTEKRA\sdvkjjrt.mp4"
out_dir = r"scratch/video_audit_frames"
os.makedirs(out_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps if fps > 0 else 0

print(f"Video FPS: {fps}, Total frames: {total_frames}, Duration: {duration:.2f}s")

# Extract 1 frame per second or every 0.5s
interval_sec = 1.0
interval_frames = int(fps * interval_sec) if fps > 0 else 30

saved = 0
frame_idx = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if frame_idx % interval_frames == 0:
        sec = frame_idx / fps if fps > 0 else 0
        fname = os.path.join(out_dir, f"frame_{saved:03d}_sec{sec:.1f}.jpg")
        cv2.imwrite(fname, frame)
        saved += 1
    frame_idx += 1

cap.release()
print(f"Saved {saved} frames to {out_dir}")

