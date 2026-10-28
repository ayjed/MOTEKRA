with open('src/components/work/work-page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_work_hero = '''        const titleLine = hero.querySelector<HTMLElement>("[data-work-hero-line]");
        if (titleLine) {
          tl.fromTo(
            titleLine,
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" },
            0
          );
        }
        if (lead) {
          tl.fromTo(
            lead,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
            0.15
          );
        }'''

new_work_hero = '''        const titleLine = hero.querySelector<HTMLElement>("[data-work-hero-line]");
        if (titleLine) {
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
        }'''

assert old_work_hero in text
text = text.replace(old_work_hero, new_work_hero, 1)

with open('src/components/work/work-page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated work-page.tsx successfully!')

with open('src/components/work/work-cinema.tsx', 'r', encoding='utf-8') as f:
    wtext = f.read()

old_wc = '''        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "all" }'''

new_wc = '''        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.12, ease: "power3.out", clearProps: "all" }'''

if old_wc in wtext:
    wtext = wtext.replace(old_wc, new_wc, 1)
    with open('src/components/work/work-cinema.tsx', 'w', encoding='utf-8') as f:
        f.write(wtext)
    print('Updated work-cinema.tsx successfully!')

