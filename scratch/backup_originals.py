import shutil
import os

services_dir = r"public/assets/services"
files_to_backup = [
    "ui-ux-design.jpg",
    "ui-ux-design.webp",
    "web-development.jpg",
    "web-development.webp",
]

backup_dir = os.path.join(services_dir, "backup_originals")
os.makedirs(backup_dir, exist_ok=True)

for fname in files_to_backup:
    src_path = os.path.join(services_dir, fname)
    if os.path.exists(src_path):
        dst_path = os.path.join(backup_dir, fname)
        if not os.path.exists(dst_path):
            shutil.copy2(src_path, dst_path)
            print(f"Backed up {fname} to backup_originals/{fname}")
        else:
            print(f"Backup already exists for {fname}")

