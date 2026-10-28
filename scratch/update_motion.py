with open("src/components/home/home-cinema.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Normalize to LF
text = text.replace("\r\n", "\n")

old_part = """      intro
        .fromTo(words, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.045, clearProps: "all" }, 0)
        .from(nav, { y: -8, opacity: 0.6, duration: 0.45, stagger: 0.04, clearProps: "all" }, 0.06)
        .fromTo(lead, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, clearProps: "all" }, 0.22)
        .fromTo(buttons, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, clearProps: "all" }, 0.3)
        .fromTo(tags, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, clearProps: "all" }, 0.36)
        .fromTo(capabilities, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, clearProps: "all" }, 0.42)
        .fromTo(capabilityDividers, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.35, stagger: 0.06, clearProps: "all" }, 0.46);"""

new_part = """      intro
        .fromTo(words, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.04, clearProps: "all" }, 0)
        .from(nav, { y: -8, opacity: 0.6, duration: 0.45, stagger: 0.04, clearProps: "all" }, 0.06)
        .fromTo(lead, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all" }, 0.2)
        .fromTo(buttons, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.06, ease: "power3.out", clearProps: "all" }, 0.28)
        .fromTo(tags, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, clearProps: "all" }, 0.34)
        .fromTo(capabilities, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, clearProps: "all" }, 0.38)
        .fromTo(capabilityDividers, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.35, stagger: 0.06, clearProps: "all" }, 0.42);"""

old_set = """      gsap.set(words, { opacity: 0, y: 26 });
      if (lead) gsap.set(lead, { opacity: 0, y: 16 });
      gsap.set(buttons, { opacity: 0, y: 14 });
      gsap.set(tags, { opacity: 0, scale: 0.88 });
      gsap.set(capabilities, { opacity: 0, y: 12 });"""

new_set = """      gsap.set(words, { opacity: 0, yPercent: 105 });
      if (lead) gsap.set(lead, { opacity: 0, y: 20 });
      gsap.set(buttons, { opacity: 0, y: 16 });
      gsap.set(tags, { opacity: 0, scale: 0.9 });
      gsap.set(capabilities, { opacity: 0, y: 16 });"""

assert old_part in text, "old_part not found!"
assert old_set in text, "old_set not found!"

text = text.replace(old_part, new_part)
text = text.replace(old_set, new_set)

with open("src/components/home/home-cinema.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated home-cinema.tsx successfully!")

