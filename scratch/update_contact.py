with open("src/components/contact/contact-cinema.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_words = """    // 1. Hero Headline & Artwork Entrance Timeline
    const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    if (words.length) {
      introTl.fromTo(
        words,
        { yPercent: 115, rotationX: -35 },
        { yPercent: 0, rotationX: 0, stagger: 0.09, duration: 0.9, clearProps: "all" },
        0
      );
    }"""

new_words = """    // 1. Hero Headline & Artwork Entrance Timeline (Reference-matched vertical reveal, zero rotation)
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (words.length) {
      introTl.fromTo(
        words,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.8, clearProps: "all" },
        0
      );
    }"""

assert old_words in text, "old_words not found in contact-cinema.tsx"
text = text.replace(old_words, new_words)

with open("src/components/contact/contact-cinema.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated contact-cinema.tsx successfully!")

with open("src/components/contact/contact-faq.tsx", "r", encoding="utf-8") as f:
    faq_text = f.read().replace("\r\n", "\n")

old_faq = """      if (titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { yPercent: 110, rotateX: -12, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            clearProps: "transform,opacity",
          },
          0.05
        );
      }"""

new_faq = """      if (titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            clearProps: "all",
          },
          0.05
        );
      }"""

assert old_faq in faq_text, "old_faq not found in contact-faq.tsx"
faq_text = faq_text.replace(old_faq, new_faq)

with open("src/components/contact/contact-faq.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(faq_text)

print("Updated contact-faq.tsx successfully!")

