with open("src/components/home/home-work.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

# 1. Update the header markup
old_markup = """        {/* Section Header */}
        <div className="davka-work-header">
          <div>
            <h2 id="work-title" className="davka-work-title">
              Real Projects.
              <span>Real Impact.</span>
            </h2>
          </div>

          <Link href="/work" className="davka-all-projects-link">
            <span>Explore All Work</span>
            <span className="davka-all-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>"""

new_markup = """        {/* Section Header */}
        <div className="davka-work-header">
          <div>
            <h2 id="work-title" className="davka-work-title" aria-label="Real Projects. Real Impact.">
              <span className="davka-title-mask" aria-hidden="true">
                <span data-work-title-line>Real Projects.</span>
              </span>
              <span className="davka-title-mask" aria-hidden="true">
                <span data-work-title-line>Real Impact.</span>
              </span>
            </h2>
          </div>

          <Link href="/work" className="davka-all-projects-link">
            <span>Explore All Work</span>
            <span className="davka-all-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>"""

assert old_markup in text, "old_markup not found in home-work.tsx"
text = text.replace(old_markup, new_markup)

# 2. Update the GSAP animation in home-work.tsx
old_anim = """      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
              once: true,
            },
          }
        );
      }"""

new_anim = """      const titleLines = root.querySelectorAll<HTMLElement>("[data-work-title-line]");
      const allProjectsLink = root.querySelector<HTMLElement>(".davka-all-projects-link");

      if (header) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        if (titleLines.length) {
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
        }
      }"""

assert old_anim in text, "old_anim not found in home-work.tsx"
text = text.replace(old_anim, new_anim)

# 3. Add ensureVisible for safety
old_return = """    return () => mm.revert();"""
new_return = """    const ensureVisible = () => {
      titleLines.forEach((line) => {
        gsap.set(line, { clearProps: "all" });
        line.style.opacity = "1";
        line.style.transform = "none";
      });
      if (allProjectsLink) {
        gsap.set(allProjectsLink, { clearProps: "all" });
        allProjectsLink.style.opacity = "1";
        allProjectsLink.style.transform = "none";
      }
    };
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);
    window.addEventListener("pageshow", ensureVisible);
    window.addEventListener("motekra-tab-restored", ensureVisible);

    return () => {
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      window.removeEventListener("pageshow", ensureVisible);
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      mm.revert();
    };"""

assert old_return in text, "old_return not found in home-work.tsx"
text = text.replace(old_return, new_return)

with open("src/components/home/home-work.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated home-work.tsx successfully!")

