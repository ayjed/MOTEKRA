with open('src/components/home/home-process.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = '''      if (titleLines.length) {
        headerTl.fromTo(
          titleLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            clearProps: "all",
          },
          0
        );
      }

      if (lead) {
        headerTl.fromTo(
          lead,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            clearProps: "all",
          },
          0.15
        );
      }'''

new_block = '''      if (titleLines.length) {
        headerTl.fromTo(
          titleLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        );
      }

      if (lead) {
        headerTl.fromTo(
          lead,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
          },
          0.22
        );
      }'''

assert old_block in text, "old_block not found in home-process.tsx"
text = text.replace(old_block, new_block, 1)

with open('src/components/home/home-process.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/components/home/home-process.tsx successfully!')
