# 1. Update src/app/contact/page.tsx
with open('src/app/contact/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_hero_block = '''          <div>
            <h1 id="contact-hero-title">
              {["Have Something", "in Mind?"].map((line) => (
                <span className="contact-line" key={line}>
                  {line.split(" ").map((word, j) => (
                    <span key={word}>
                      {j > 0 && " "}
                      <span data-contact-word>{word}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="lead">
              Tell us about your idea. Let’s explore what’s possible.
            </p>
            <Link prefetch={false} className="contact-scroll-link" href="#inquiry">
              <span>Start the conversation</span>
              <span aria-hidden="true">↓</span>
            </Link>
          </div>'''

new_hero_block = '''          <div>
            <h1 id="contact-hero-title">
              {["Have Something", "in Mind?"].map((line) => (
                <span className="contact-line-mask" key={line}>
                  <span data-contact-title-line>
                    {line.split(" ").map((word, j) => (
                      <span key={word}>
                        {j > 0 && " "}
                        <span data-contact-word>{word}</span>
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>
            <p className="lead" data-contact-hero-lead>
              Tell us about your idea. Let’s explore what’s possible.
            </p>
            <Link prefetch={false} className="contact-scroll-link" href="#inquiry" data-contact-hero-cta>
              <span>Start the conversation</span>
              <span aria-hidden="true">↓</span>
            </Link>
          </div>'''

old_inquiry = '''            <h2 id="inquiry-heading">
              Tell Us About Your Project.
            </h2>
            <p className="inquiry-lead">
              Share a few details about what you have in mind.
            </p>'''

new_inquiry = '''            <h2 id="inquiry-heading">
              <span className="contact-line-mask"><span data-inquiry-heading-line>Tell Us About Your Project.</span></span>
            </h2>
            <p className="inquiry-lead" data-inquiry-lead>
              Share a few details about what you have in mind.
            </p>'''

old_aside = '''            <h2>
              Let’s build<br />
              <span>something meaningful.</span>
            </h2>
            <p className="inquiry-aside-intro">
              Share your vision and we’ll explore the next steps together.
            </p>'''

new_aside = '''            <h2 aria-label="Let’s build something meaningful.">
              <span className="contact-line-mask"><span data-aside-heading-line>Let’s build</span></span>
              <span className="contact-line-mask"><span data-aside-heading-line className="blue-text">something meaningful.</span></span>
            </h2>
            <p className="inquiry-aside-intro" data-aside-lead>
              Share your vision and we’ll explore the next steps together.
            </p>'''

assert old_hero_block in text, "old_hero_block not found"
text = text.replace(old_hero_block, new_hero_block, 1)

assert old_inquiry in text, "old_inquiry not found"
text = text.replace(old_inquiry, new_inquiry, 1)

assert old_aside in text, "old_aside not found"
text = text.replace(old_aside, new_aside, 1)

with open('src/app/contact/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/app/contact/page.tsx successfully!')

# 2. Update src/components/contact/contact-cinema.tsx
new_contact_cinema = '''"use client";
import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function ContactCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const artwork = root.querySelector<HTMLElement>(".contact-artwork");
    const hero = root.querySelector<HTMLElement>(".contact-hero");
    const titleLines = root.querySelectorAll<HTMLElement>("[data-contact-title-line]");
    const words = root.querySelectorAll<HTMLElement>("[data-contact-word]");
    const heroLead = root.querySelector<HTMLElement>("[data-contact-hero-lead]");
    const heroCta = root.querySelector<HTMLElement>("[data-contact-hero-cta]");

    const headingTargets = titleLines.length ? titleLines : words;

    // 1. Hero Headline, Lead, CTA & Artwork Entrance Timeline
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headingTargets.length) {
      introTl.fromTo(
        headingTargets,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.14, duration: 0.95, clearProps: "all" },
        0
      );
    }

    if (heroLead) {
      introTl.fromTo(
        heroLead,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, clearProps: "all" },
        0.25
      );
    }

    if (heroCta) {
      introTl.fromTo(
        heroCta,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
        0.38
      );
    }

    if (artwork) {
      introTl.fromTo(
        artwork,
        { rotationY: -16, rotationZ: -4, y: 35, opacity: 0 },
        { rotationY: 0, rotationZ: 0, y: 0, opacity: 1, duration: 1.1, clearProps: "opacity" },
        0.1
      );
    }

    // 2. Desktop Scroll-Linked 3D Rotation
    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      if (hero && artwork) {
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 10%",
            scrub: 0.5,
            onLeaveBack: () => {
              gsap.set(artwork, { y: 0, rotationY: 0, rotationZ: 0, scale: 1 });
            },
          },
        })
          .to(artwork, { y: 80, rotationY: 14, rotationZ: 4, scale: 0.88, ease: "none" }, 0)
          .to(hero, { "--contact-illumination": 1, ease: "none" }, 0);
      }
    });

    // 3. Staggered reveal for contact inquiry panels
    const entries = gsap.context(() => {}, root);
    root.querySelectorAll<HTMLElement>("[data-contact-reveal]").forEach((element) => {
      const inqHeading = element.querySelector<HTMLElement>("[data-inquiry-heading-line]");
      const inqLead = element.querySelector<HTMLElement>("[data-inquiry-lead]");
      const asideHeading = element.querySelectorAll<HTMLElement>("[data-aside-heading-line]");
      const asideLead = element.querySelector<HTMLElement>("[data-aside-lead]");

      ScrollTrigger.create({
        trigger: element,
        start: "top 92%",
        invalidateOnRefresh: true,
        once: true,
        onEnter: () =>
          entries.add(() => {
            gsap.fromTo(
              element,
              { clipPath: "inset(0% 0% 10% 0% round 20px)", y: 24 },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                clearProps: "all",
              }
            );

            if (inqHeading) {
              gsap.fromTo(
                inqHeading,
                { yPercent: 105, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", clearProps: "all" }
              );
            }
            if (inqLead) {
              gsap.fromTo(
                inqLead,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, delay: 0.15, ease: "power3.out", clearProps: "all" }
              );
            }
            if (asideHeading.length) {
              gsap.fromTo(
                asideHeading,
                { yPercent: 105, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out", clearProps: "all" }
              );
            }
            if (asideLead) {
              gsap.fromTo(
                asideLead,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, delay: 0.18, ease: "power3.out", clearProps: "all" }
              );
            }
          }),
      });
    });

    const focus = (event: FocusEvent) => {
      const active = event.type === "focusin";
      entries.add(() =>
        gsap.to(root.querySelector(".inquiry-panel"), {
          "--form-focus": active ? 1 : 0,
          duration: 0.35,
          overwrite: "auto",
        })
      );
    };
    const form = root.querySelector("form");
    form?.addEventListener("focusin", focus as EventListener);
    form?.addEventListener("focusout", focus as EventListener);

    // Lifecycle recovery: Ensure returning from inactive tab restores visibility deterministically
    const ensureVisible = () => {
      headingTargets.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
      if (heroLead) {
        heroLead.style.opacity = "1";
        heroLead.style.transform = "none";
      }
      if (heroCta) {
        heroCta.style.opacity = "1";
        heroCta.style.transform = "none";
      }
      if (artwork) {
        artwork.style.opacity = "1";
      }
      root.querySelectorAll<HTMLElement>("[data-contact-reveal]").forEach((element) => {
        element.style.clipPath = "none";
        element.style.opacity = "1";
      });
    };
    window.addEventListener("motekra-tab-restored", ensureVisible);
    document.addEventListener("visibilitychange", ensureVisible);
    window.addEventListener("focus", ensureVisible);

    return () => {
      window.removeEventListener("motekra-tab-restored", ensureVisible);
      document.removeEventListener("visibilitychange", ensureVisible);
      window.removeEventListener("focus", ensureVisible);
      form?.removeEventListener("focusin", focus as EventListener);
      form?.removeEventListener("focusout", focus as EventListener);
      entries.revert();
      media.revert();
    };
  });

  return <div className="contact-cinema" ref={ref}>{children}</div>;
}
'''

with open('src/components/contact/contact-cinema.tsx', 'w', encoding='utf-8') as f:
    f.write(new_contact_cinema)

print('Updated contact-cinema.tsx successfully!')

# 3. Update src/components/contact/contact-faq.tsx
with open('src/components/contact/contact-faq.tsx', 'r', encoding='utf-8') as f:
    faq_text = f.read()

old_faq = '''        if (titleLines.length) {
          headerTl.fromTo(
            titleLines,
            { yPercent: 110, rotateX: -12, opacity: 0 },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.12,
              clearProps: "all",
            },
            0
          );
        }

        if (subtitle) {
          headerTl.fromTo(
            subtitle,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              clearProps: "all",
            },
            0.25
          );
        }'''

new_faq = '''        if (titleLines.length) {
          headerTl.fromTo(
            titleLines,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.14,
              ease: "power3.out",
              clearProps: "all",
            },
            0
          );
        }

        if (subtitle) {
          headerTl.fromTo(
            subtitle,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
            },
            0.22
          );
        }'''

if old_faq in faq_text:
    faq_text = faq_text.replace(old_faq, new_faq, 1)
    with open('src/components/contact/contact-faq.tsx', 'w', encoding='utf-8') as f:
        f.write(faq_text)
    print('Updated contact-faq.tsx successfully!')
else:
    print('Warning: old_faq block not found directly, checking variations...')

