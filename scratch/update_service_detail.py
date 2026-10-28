with open('src/components/services/service-detail.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_hero_tl = '''        if (titleLine) {
          tl.fromTo(
            titleLine,
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.8, clearProps: "all" },
            0
          );
        }

        if (lead) {
          tl.fromTo(
            lead,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, clearProps: "all" },
            0.15
          );
        }

        if (action) {
          tl.fromTo(
            action,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, clearProps: "all" },
            0.25
          );
        }'''

new_hero_tl = '''        if (titleLine) {
          tl.fromTo(
            titleLine,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.95, ease: "power3.out", clearProps: "all" },
            0
          );
        }

        if (lead) {
          tl.fromTo(
            lead,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all" },
            0.20
          );
        }

        if (action) {
          tl.fromTo(
            action,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
            0.32
          );
        }'''

old_showcase = '''        if (showcaseHeading) {
          showcaseTl.fromTo(
            showcaseHeading,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.75, clearProps: "all" },
            0
          );
        }

        if (showcaseText) {
          showcaseTl.fromTo(
            showcaseText,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, clearProps: "all" },
            0.1
          );
        }'''

new_showcase = '''        if (showcaseHeading) {
          showcaseTl.fromTo(
            showcaseHeading,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", clearProps: "all" },
            0
          );
        }

        if (showcaseText) {
          showcaseTl.fromTo(
            showcaseText,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all" },
            0.18
          );
        }'''

assert old_hero_tl in text, "old_hero_tl not found"
text = text.replace(old_hero_tl, new_hero_tl, 1)

assert old_showcase in text, "old_showcase not found"
text = text.replace(old_showcase, new_showcase, 1)

with open('src/components/services/service-detail.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated service-detail.tsx successfully!')

