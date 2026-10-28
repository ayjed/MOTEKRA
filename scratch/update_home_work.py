with open('src/components/home/home-work.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_header_block = '''        if (titleLines.length) {
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

        if (allProjectsLink) {
          headerTl.fromTo(
            allProjectsLink,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              clearProps: "all",
            },
            0.15
          );
        }'''

new_header_block = '''        if (titleLines.length) {
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

        if (allProjectsLink) {
          headerTl.fromTo(
            allProjectsLink,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              clearProps: "all",
            },
            0.22
          );
        }'''

old_card_title = '''        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              clearProps: "all",'''

new_card_title = '''        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",'''

assert old_header_block in text, "old_header_block not found"
text = text.replace(old_header_block, new_header_block, 1)

assert old_card_title in text, "old_card_title not found"
text = text.replace(old_card_title, new_card_title, 1)

with open('src/components/home/home-work.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/components/home/home-work.tsx successfully!')
