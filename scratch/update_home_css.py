with open("src/styles/home.css", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update cinema-hero-grid mobile padding and title clamp
old_str = ".cinema-hero-grid { grid-template-columns: 1fr; padding-block: 20px 24px; gap: 24px; min-height: auto; } .home-cinema .cinema-title { font-size: clamp(32px, 8.5vw, 42px);"
new_str = ".cinema-hero-grid { grid-template-columns: 1fr; padding-block: clamp(40px, 9vw, 56px) 24px; gap: 24px; min-height: auto; } .home-cinema .cinema-title { font-size: clamp(30px, 8.5vw, 42px);"

assert old_str in content, "old_str not found in home.css"
content = content.replace(old_str, new_str)

# 2. Fix 359px media query
old_359 = ".home-cinema .cinema-title { font-size: 54px; }."
new_359 = "."
content = content.replace(old_359, new_359)

with open("src/styles/home.css", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated home.css successfully!")

