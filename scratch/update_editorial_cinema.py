with open("src/components/about/editorial-cinema.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_lines = """    // 1. Headline masked line entrance
    const lines = root.querySelectorAll("[data-editorial-line]");
    if (lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 110, rotation: 2 },
        { yPercent: 0, rotation: 0, duration: 1, stagger: 0.12, ease: "power4.out", clearProps: "all" }
      );
    }"""

new_lines = """    // 1. Headline masked line entrance (Reference-matched vertical reveal, zero rotation)
    const lines = root.querySelectorAll<HTMLElement>("[data-editorial-line]");
    if (lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
    }"""

assert old_lines in text, "old_lines not found in editorial-cinema.tsx"
text = text.replace(old_lines, new_lines)

old_stagger = """    // 3. Editorial staggered groups
    root.querySelectorAll<HTMLElement>("[data-editorial-stagger]").forEach((group) => {
      ScrollTrigger.create({
        trigger: group,
        start: "top 95%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() =>
            gsap.fromTo(
              group.querySelectorAll("[data-editorial-item]"),
              { x: -24, rotationY: -5, opacity: 0 },
              { x: 0, rotationY: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: "power3.out", clearProps: "all" }
            )
          ),
      });
    });

    // 4. Biography paragraphs
    root.querySelectorAll<HTMLElement>(".editorial-bio p").forEach((paragraph) => {
      ScrollTrigger.create({
        trigger: paragraph,
        start: "top 95%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() =>
            gsap.fromTo(
              paragraph.querySelectorAll(".bio-word"),
              { y: 16, rotationX: 35 },
              { y: 0, rotationX: 0, duration: 0.65, stagger: 0.018, ease: "power3.out", clearProps: "all" }
            )
          ),
      });
    });"""

new_stagger = """    // 3. Editorial staggered groups (Reference-matched upward glide, zero rotation)
    root.querySelectorAll<HTMLElement>("[data-editorial-stagger]").forEach((group) => {
      ScrollTrigger.create({
        trigger: group,
        start: "top 90%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() =>
            gsap.fromTo(
              group.querySelectorAll("[data-editorial-item]"),
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out", clearProps: "all" }
            )
          ),
      });
    });

    // 4. Biography paragraphs (Subtle upward glide, zero rotation)
    root.querySelectorAll<HTMLElement>(".editorial-bio p").forEach((paragraph) => {
      ScrollTrigger.create({
        trigger: paragraph,
        start: "top 90%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entrances.add(() =>
            gsap.fromTo(
              paragraph.querySelectorAll(".bio-word"),
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.015, ease: "power3.out", clearProps: "all" }
            )
          ),
      });
    });"""

assert old_stagger in text, "old_stagger not found in editorial-cinema.tsx"
text = text.replace(old_stagger, new_stagger)

old_recovery = """    const ensureVisible = () => {
      root.querySelectorAll<HTMLElement>("[data-editorial-line]").forEach((line) => {
        line.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>("[data-portrait-frame]").forEach((frame) => {
        frame.style.clipPath = "none";
      });
      root.querySelectorAll<HTMLElement>(".portrait-caption > span").forEach((caption) => {
        caption.style.opacity = "1";
        caption.style.transform = "none";
      });
    };"""

new_recovery = """    const ensureVisible = () => {
      root.querySelectorAll<HTMLElement>("[data-editorial-line]").forEach((line) => {
        gsap.set(line, { clearProps: "all" });
        line.style.opacity = "1";
        line.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>("[data-editorial-item], .bio-word").forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>("[data-portrait-frame]").forEach((frame) => {
        frame.style.clipPath = "none";
      });
      root.querySelectorAll<HTMLElement>(".portrait-caption > span").forEach((caption) => {
        caption.style.opacity = "1";
        caption.style.transform = "none";
      });
    };"""

assert old_recovery in text, "old_recovery not found in editorial-cinema.tsx"
text = text.replace(old_recovery, new_recovery)

with open("src/components/about/editorial-cinema.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated editorial-cinema.tsx successfully!")

