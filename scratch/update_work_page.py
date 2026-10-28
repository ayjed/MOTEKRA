with open("src/components/work/work-page.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_markup = """            <div className="work-hero-headline-wrap">
              <h1 id="work-main-heading" className="work-hero-title">
                Selected Work.
              </h1>
              <p className="work-hero-lead">
                A selection of digital products, websites, and interfaces.
              </p>
            </div>"""

new_markup = """            <div className="work-hero-headline-wrap">
              <h1 id="work-main-heading" className="work-hero-title" aria-label="Selected Work.">
                <span className="work-title-mask" aria-hidden="true">
                  <span data-work-hero-line>Selected Work.</span>
                </span>
              </h1>
              <p className="work-hero-lead">
                A selection of digital products, websites, and interfaces.
              </p>
            </div>"""

assert old_markup in text, "old_markup not found in work-page.tsx"
text = text.replace(old_markup, new_markup)

old_anim = """        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all" }
          );
        }
        if (lead) {
          tl.fromTo(
            lead,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
            "-=0.5"
          );
        }
        if (bar) {
          tl.fromTo(
            bar,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" },
            "-=0.4"
          );
        }"""

new_anim = """        const titleLine = hero.querySelector<HTMLElement>("[data-work-hero-line]");
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
        }
        if (bar) {
          tl.fromTo(
            bar,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "all" },
            0.25
          );
        }"""

assert old_anim in text, "old_anim not found in work-page.tsx"
text = text.replace(old_anim, new_anim)

with open("src/components/work/work-page.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated work-page.tsx successfully!")

