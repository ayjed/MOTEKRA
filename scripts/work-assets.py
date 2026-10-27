"""Extract review-only crops from supplied PDF screenshots; never creates project art."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
from PIL import Image

root = Path(__file__).resolve().parents[1]
out = root / "assets/review/work"
tmp = root / "tmp/pdfs/work"
out.mkdir(parents=True, exist_ok=True)
tmp.mkdir(parents=True, exist_ok=True)
sources = {
    "spotlight-contest": ("1836ab98-1426-4fca-b9fa-adb23268b2fd", (0, 0, 1, .17), (0, .17, 1, .335)),
    "lad-global-travels": ("205d73c3-66c4-4918-9643-b0eadfcb3032", (0, 0, 1, .19), (0, .19, 1, .413)),
    "tog-africa": ("18f8400e-473b-45df-b71d-216ad14f4e9b", (0, 0, 1, .135), (0, .247, 1, .405)),
    "connectapi": ("eb4d75b3-7a73-4ba7-bfc6-876fba4f6315", (.056, .013, .942, .145), (.056, .405, .942, .635)),
}
manifest = []
for slug, (stem, hero, detail) in sources.items():
    source = root / "Motekra Info/Motekra Info" / f"{stem}.pdf"
    prefix = tmp / slug
    subprocess.run([shutil.which("pdftoppm"), "-f", "1", "-singlefile", "-scale-to-x", "1400", "-scale-to-y", "-1", "-png", str(source), str(prefix)], check=True)
    with Image.open(prefix.with_suffix(".png")) as image:
        for kind, box in [("hero", hero), ("detail", detail)]:
            crop = image.crop(tuple(round(v * (image.width if i % 2 == 0 else image.height)) for i, v in enumerate(box))).convert("RGB")
            target = out / f"{slug}-{kind}.webp"
            crop.save(target, "WEBP", quality=88, method=6)
            manifest.append({"slug": slug, "kind": kind, "source": str(source.relative_to(root)), "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(), "page": 1, "normalizedCrop": box, "asset": str(target.relative_to(root)), "width": crop.width, "height": crop.height, "bytes": target.stat().st_size, "sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "publication": "local draft review only; permissions unverified"})
    prefix.with_suffix(".png").unlink()
(root / "docs/WORK_EVIDENCE_ASSETS.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(f"Extracted {len(manifest)} review crops; original PDFs unchanged.")
