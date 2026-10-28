with open('src/components/home/testimonials-marquee.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = '''        headerTl.fromTo(
          titleLine,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            clearProps: "all",
          },
          0
        );

        if (subtitle) {
          headerTl.fromTo(
            subtitle,
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

new_block = '''        headerTl.fromTo(
          titleLine,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        );

        if (subtitle) {
          headerTl.fromTo(
            subtitle,
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

assert old_block in text, "old_block not found in testimonials-marquee.tsx"
text = text.replace(old_block, new_block, 1)

with open('src/components/home/testimonials-marquee.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/components/home/testimonials-marquee.tsx successfully!')
