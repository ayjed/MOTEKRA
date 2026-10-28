with open("src/components/home/testimonials-marquee.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_markup = """      <div className="container testimonials-header-center">
        <h2 id="testimonials-title" className="testimonials-title">
          Feedback that fuels us
        </h2>

        <p className="testimonials-subtitle">
          See how our design partnership turned client ideas into momentum - and why they keep coming back.
        </p>

        <div className="testimonials-controls">"""

new_markup = """      <div className="container testimonials-header-center">
        <h2 id="testimonials-title" className="testimonials-title" aria-label="Feedback that fuels us">
          <span className="testimonials-title-mask" aria-hidden="true">
            <span data-testimonials-title-line>Feedback that fuels us</span>
          </span>
        </h2>

        <p className="testimonials-subtitle" data-testimonials-subtitle>
          See how our design partnership turned client ideas into momentum - and why they keep coming back.
        </p>

        <div className="testimonials-controls" data-testimonials-controls>"""

assert old_markup in text, "old_markup not found in testimonials-marquee.tsx"
text = text.replace(old_markup, new_markup)

# In useEffect, add header entrance
old_ctx = """      // Start immediately when the section enters 95% of the viewport"""

new_ctx = """      // Header entrance animation
      const titleLine = section.querySelector<HTMLElement>("[data-testimonials-title-line]");
      const subtitle = section.querySelector<HTMLElement>("[data-testimonials-subtitle]");
      const controls = section.querySelector<HTMLElement>("[data-testimonials-controls]");

      if (titleLine) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        headerTl.fromTo(
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
        }

        if (controls) {
          headerTl.fromTo(
            controls,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              clearProps: "all",
            },
            0.25
          );
        }
      }

      // Start immediately when the section enters 95% of the viewport"""

assert old_ctx in text, "old_ctx not found in testimonials-marquee.tsx"
text = text.replace(old_ctx, new_ctx)

# In handleVisibilityChange, restore visibility
old_vis = """    const handleVisibilityChange = () => {
      if (document.hidden) {
        row1TweenRef.current?.pause();
        row2TweenRef.current?.pause();
      } else if (!isManuallyPaused) {
        row1TweenRef.current?.play();
        row2TweenRef.current?.play();
      }
    };"""

new_vis = """    const handleVisibilityChange = () => {
      if (document.hidden) {
        row1TweenRef.current?.pause();
        row2TweenRef.current?.pause();
      } else {
        const titleLine = section.querySelector<HTMLElement>("[data-testimonials-title-line]");
        const subtitle = section.querySelector<HTMLElement>("[data-testimonials-subtitle]");
        const controls = section.querySelector<HTMLElement>("[data-testimonials-controls]");
        if (titleLine) { gsap.set(titleLine, { clearProps: "all" }); titleLine.style.opacity = "1"; titleLine.style.transform = "none"; }
        if (subtitle) { gsap.set(subtitle, { clearProps: "all" }); subtitle.style.opacity = "1"; subtitle.style.transform = "none"; }
        if (controls) { gsap.set(controls, { clearProps: "all" }); controls.style.opacity = "1"; controls.style.transform = "none"; }
        if (!isManuallyPaused) {
          row1TweenRef.current?.play();
          row2TweenRef.current?.play();
        }
      }
    };"""

assert old_vis in text, "old_vis not found in testimonials-marquee.tsx"
text = text.replace(old_vis, new_vis)

with open("src/components/home/testimonials-marquee.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated testimonials-marquee.tsx successfully!")

