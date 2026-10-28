with open('src/components/home/section-cinema.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

contact_block = '''  if(kind==='contact'){
    const contactLead = root.querySelector<HTMLElement>('[data-contact-lead-support]');
    const contactBtn = root.querySelector<HTMLElement>('[data-contact-cta-support] a, [data-contact-cta-support] button');
    if (contactLead || contactBtn) {
      ScrollTrigger.create({
        trigger: root,
        start: 'top 88%',
        once: true,
        onEnter: () => animations.add(() => {
          if (contactLead) {
            gsap.fromTo(contactLead, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.22, ease: 'power3.out', clearProps: 'all' });
          }
          if (contactBtn) {
            gsap.fromTo(contactBtn, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: 'power3.out', clearProps: 'all' });
          }
        }),
      });
    }
  }'''

old_contact = '''  if(kind==='contact'){
    // Scoped entrance and pointer-responsive movement are managed inside ConceptCreationVisual
  }'''

assert old_contact in text
text = text.replace(old_contact, contact_block, 1)

with open('src/components/home/section-cinema.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated section-cinema.tsx successfully!')

