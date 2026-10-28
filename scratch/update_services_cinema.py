with open("src/components/services/services-cinema.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_anim = """      if (headingLines.length) {
        introTl.fromTo(
          headingLines,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }
        );
      }

      if (introElements.length) {
        introTl.fromTo(
          introElements,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.5"
        );
      }"""

new_anim = """      if (headingLines.length) {
        introTl.fromTo(
          headingLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          },
          0
        );
      }

      if (introElements.length) {
        introTl.fromTo(
          introElements,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          },
          0.15
        );
      }"""

assert old_anim in text, "old_anim not found in services-cinema.tsx"
text = text.replace(old_anim, new_anim)

with open("src/components/services/services-cinema.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated services-cinema.tsx successfully!")

