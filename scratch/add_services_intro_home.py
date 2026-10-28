with open('src/components/home/home-cinema.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

services_block = '''    // Services section supporting intro animation on scroll
    const servicesSection = root.querySelector<HTMLElement>(".home-services");
    const servicesIntro = root.querySelector<HTMLElement>("[data-services-intro-support]");
    const servicesCta = root.querySelector<HTMLElement>("[data-services-cta-support]");
    if (servicesSection && (servicesIntro || servicesCta)) {
      ScrollTrigger.create({
        trigger: servicesSection,
        start: "top 88%",
        once: true,
        onEnter: () => {
          if (servicesIntro) {
            gsap.fromTo(
              servicesIntro,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: 0.22, ease: "power3.out", clearProps: "all" }
            );
          }
          if (servicesCta) {
            gsap.fromTo(
              servicesCta,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: "power3.out", clearProps: "all" }
            );
          }
        },
      });
    }

    // Lifecycle recovery: Ensure returning from inactive tab or BFCache never hides hero text'''

assert "// Lifecycle recovery: Ensure returning from inactive tab or BFCache never hides hero text" in text
text = text.replace("// Lifecycle recovery: Ensure returning from inactive tab or BFCache never hides hero text", services_block, 1)

with open('src/components/home/home-cinema.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Added services intro animation to home-cinema.tsx!')

