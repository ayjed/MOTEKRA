"""Read-only source inventory. Run from repository root with Pillow and pypdf."""
import hashlib
import json
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

root = Path(__file__).resolve().parent.parent
records = []
sources = sorted(root.glob('*.png')) + sorted((root / 'Motekra Info').rglob('*.pdf'))
for source in sources:
    item = {'path': source.relative_to(root).as_posix(), 'bytes': source.stat().st_size,
            'sha256': hashlib.sha256(source.read_bytes()).hexdigest()}
    if source.suffix == '.png':
        with Image.open(source) as image:
            image.verify()
        with Image.open(source) as image:
            item.update(width=image.width, height=image.height, mode=image.mode)
    else:
        reader = PdfReader(source)
        item['pages'] = len(reader.pages)
        item['page_details'] = [
            {'width_pt': float(page.mediabox.width), 'height_pt': float(page.mediabox.height),
             'text_characters': len(page.extract_text() or ''),
             'images': [{'width': img.image.width, 'height': img.image.height}
                        for img in page.images]}
            for page in reader.pages
        ]
        preview = root / 'docs' / 'audit' / (source.stem + '.png')
        assert preview.exists(), f'Missing rendered preview: {preview}'
        with Image.open(preview) as image:
            image.verify()
    records.append(item)
assert len(records) == 9, f'Expected nine supplied image/PDF sources; found {len(records)}'
print(json.dumps(records, indent=2))
