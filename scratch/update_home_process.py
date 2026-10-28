with open("src/components/home/home-process.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_anim = """    if (header) {
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
            start: "top 90%",
            once: true,
          },
        }
      );
    }"""

new_anim = """    const titleLines = root.querySelectorAll<HTMLElement>("[data-process-title-line]");
    const lead = root.querySelector<HTMLElement>("[data-process-lead]");

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
      }
    }"""

assert old_anim in text, "old_anim not found in home-process.tsx"
text = text.replace(old_anim, new_anim)

old_markup = """        <div className="process-section-header">
          <div className="process-header-grid">
            <h2 id="process-heading" className="process-title">
              From Idea<br />
              <span>to Impact.</span>
            </h2>
            <p className="process-lead">
              Every step makes the next one clearer. A structured, collaborative path from early vision to a production-ready digital product.
            </p>
          </div>
        </div>"""

new_markup = """        <div className="process-section-header">
          <div className="process-header-grid">
            <h2 id="process-heading" className="process-title" aria-label="From Idea to Impact.">
              <span className="process-title-mask" aria-hidden="true">
                <span data-process-title-line>From Idea</span>
              </span>
              <span className="process-title-mask" aria-hidden="true">
                <span data-process-title-line>to Impact.</span>
              </span>
            </h2>
            <p className="process-lead" data-process-lead>
              Every step makes the next one clearer. A structured, collaborative path from early vision to a production-ready digital product.
            </p>
          </div>
        </div>"""

assert old_markup in text, "old_markup not found in home-process.tsx"
text = text.replace(old_markup, new_markup)

# Lifecycle recovery inside home-process
old_cleanup = """    return () => {
      triggerRef.current = null;
      mm.revert();
    };"""

new_cleanup = """    const ensureProcessVisible = () => {
      titleLines.forEach((l) => {
        gsap.set(l, { clearProps: "all" });
        l.style.opacity = "1";
        l.style.transform = "none";
      });
      if (lead) {
        gsap.set(lead, { clearProps: "all" });
        lead.style.opacity = "1";
        lead.style.transform = "none";
      }
    };
    document.addEventListener("visibilitychange", ensureProcessVisible);
    window.addEventListener("focus", ensureProcessVisible);
    window.addEventListener("pageshow", ensureProcessVisible);
    window.addEventListener("motekra-tab-restored", ensureProcessVisible);

    return () => {
      document.removeEventListener("visibilitychange", ensureProcessVisible);
      window.removeEventListener("focus", ensureProcessVisible);
      window.removeEventListener("pageshow", ensureProcessVisible);
      window.removeEventListener("motekra-tab-restored", ensureProcessVisible);
      triggerRef.current = null;
      mm.revert();
    };"""

assert old_cleanup in text, "old_cleanup not found in home-process.tsx"
text = text.replace(old_cleanup, new_cleanup)

with open("src/components/home/home-process.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated home-process.tsx successfully!")

