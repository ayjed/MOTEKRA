import glob
import os

frames = sorted(glob.glob("scratch/video_audit_frames/*.jpg"))
print(f"Total frames: {len(frames)}")

# Print frame list with timestamps
for i, f in enumerate(frames):
    basename = os.path.basename(f)
    if i % 5 == 0:
        print(f"  [{i:02d}] {basename}")

