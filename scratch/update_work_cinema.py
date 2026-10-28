with open("src/components/work/work-cinema.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_part = """    const title = root.querySelectorAll("[data-work-line]");
    if (title.length) gsap.fromTo(title, { yPercent: 108, rotation: 3 }, { yPercent: 0, rotation: 0, duration: .95, stagger: .13, ease: "power4.out", clearProps: "transform" });"""

new_part = """    const title = root.querySelectorAll<HTMLElement>("[data-work-line]");
    if (title.length) {
      gsap.fromTo(
        title,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
    }"""

assert old_part in text, "old_part not found in work-cinema.tsx"
text = text.replace(old_part, new_part)

old_card_info = """        gsap.fromTo(card.querySelector(".work-card-info"), { x: index % 2 ? 22 : -22 }, { x: 0, duration: .8, delay: .12, ease: "power3.out", clearProps: "transform" });"""
new_card_info = """        const cardInfo = card.querySelector<HTMLElement>(".work-card-info");
        if (cardInfo) {
          gsap.fromTo(cardInfo, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, delay: 0.12, ease: "power3.out", clearProps: "all" });
        }"""

assert old_card_info in text, "old_card_info not found in work-cinema.tsx"
text = text.replace(old_card_info, new_card_info)

# Add ensureVisible
old_return = """    return () => { removeFocusListeners.forEach((remove) => remove()); desktop.revert(); revealContext.revert(); };"""
new_return = """    const ensureVisible = () => {
      title.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      root.querySelectorAll<HTMLElement>(".work-card-info").forEach((info) => {
        gsap.set(info, { clearProps: "all" });
        info.style.opacity = "1";
        info.style.transform = "none";
      });
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
      removeFocusListeners.forEach((remove) => remove());
      desktop.revert();
      revealContext.revert();
    };"""

assert old_return in text, "old_return not found in work-cinema.tsx"
text = text.replace(old_return, new_return)

with open("src/components/work/work-cinema.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated work-cinema.tsx successfully!")

