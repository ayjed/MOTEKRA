with open('src/components/work/project-detail.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update JSX attributes
text = text.replace(
    '<p className="case-hero-lead">{study.lead}</p>',
    '<p className="case-hero-lead" data-case-hero-lead>{study.lead}</p>'
)
text = text.replace(
    '<div className="case-meta-bar" role="list">',
    '<div className="case-meta-bar" role="list" data-case-meta-bar>'
)
text = text.replace(
    '<p className="case-overview-text">{study.overview}</p>',
    '<p className="case-overview-text" data-case-overview-lead>{study.overview}</p>'
)
text = text.replace(
    '<p className="case-gallery-desc">{study.galleryDescription}</p>',
    '<p className="case-gallery-desc" data-case-gallery-lead>{study.galleryDescription}</p>'
)

# 2. Update GSAP timeline
old_gsap = '''      // 1. Hero Title Slide-in
      const heroTitle = root.querySelector<HTMLElement>("[data-case-title-line]");
      if (heroTitle) {
        gsap.fromTo(
          heroTitle,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
        );
      }

      // 2. Headings on Scroll
      const animatedHeadings = root.querySelectorAll<HTMLElement>("[data-case-heading]");
      animatedHeadings.forEach((heading) => {
        const line = heading.querySelector<HTMLElement>("[data-case-heading-line]");
        if (line) {
          gsap.fromTo(
            line,
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: heading,
                start: "top 88%",
                once: true,
              },
            }
          );
        }
      });'''

new_gsap = '''      // 1. Hero Entrance Timeline (Title -> Lead -> Meta Bar)
      const heroTitle = root.querySelector<HTMLElement>("[data-case-title-line]");
      const heroLead = root.querySelector<HTMLElement>("[data-case-hero-lead]");
      const metaBar = root.querySelector<HTMLElement>("[data-case-meta-bar]");

      if (heroTitle || heroLead) {
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (heroTitle) {
          heroTl.fromTo(
            heroTitle,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.95, ease: "power3.out", clearProps: "all" },
            0
          );
        }
        if (heroLead) {
          heroTl.fromTo(
            heroLead,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" },
            0.22
          );
        }
        if (metaBar) {
          heroTl.fromTo(
            metaBar,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all" },
            0.34
          );
        }
      }

      // 2. Headings on Scroll
      const animatedHeadings = root.querySelectorAll<HTMLElement>("[data-case-heading]");
      animatedHeadings.forEach((heading) => {
        const line = heading.querySelector<HTMLElement>("[data-case-heading-line]");
        if (line) {
          gsap.fromTo(
            line,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.95,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: heading,
                start: "top 88%",
                once: true,
              },
            }
          );
        }
      });

      // 3. Overview Lead Reveal
      const overviewLead = root.querySelector<HTMLElement>("[data-case-overview-lead]");
      if (overviewLead) {
        gsap.fromTo(
          overviewLead,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: overviewLead,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      // 4. Gallery Description Reveal
      const galleryLead = root.querySelector<HTMLElement>("[data-case-gallery-lead]");
      if (galleryLead) {
        gsap.fromTo(
          galleryLead,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: galleryLead,
              start: "top 88%",
              once: true,
            },
          }
        );
      }'''

assert old_gsap in text, "old_gsap not found"
text = text.replace(old_gsap, new_gsap, 1)

old_ensure = 'root.querySelectorAll<HTMLElement>("[data-case-title-line], [data-case-heading-line]").forEach((el) => {'
new_ensure = 'root.querySelectorAll<HTMLElement>("[data-case-title-line], [data-case-heading-line], [data-case-hero-lead], [data-case-meta-bar], [data-case-overview-lead], [data-case-gallery-lead]").forEach((el) => {'
assert old_ensure in text
text = text.replace(old_ensure, new_ensure, 1)

with open('src/components/work/project-detail.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated project-detail.tsx successfully!')

