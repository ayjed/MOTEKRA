with open("src/components/home/home-work.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    '                      className="davka-project-img"\n                      priority\n',
    '                      className="davka-project-img"\n                      priority={false}\n'
).replace(
    '                      className="davka-project-img"\r\n                      priority\r\n',
    '                      className="davka-project-img"\r\n                      priority={false}\r\n'
)

with open("src/components/home/home-work.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated home-work.tsx with priority={false}!")

