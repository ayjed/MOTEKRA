with open("src/components/three/product-poster.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    'loading="eager"\n          decoding="async"\n          className="product-poster-img"',
    'loading="eager"\n          decoding="async"\n          fetchPriority="high"\n          className="product-poster-img"'
).replace(
    'loading="eager"\r\n          decoding="async"\r\n          className="product-poster-img"',
    'loading="eager"\r\n          decoding="async"\r\n          fetchPriority="high"\r\n          className="product-poster-img"'
)

with open("src/components/three/product-poster.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated product-poster.tsx with fetchPriority='high'!")

