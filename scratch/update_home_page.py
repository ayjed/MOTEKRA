with open('src/components/home/home-page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace HeroHeading with line-by-line masked span
old_heading = '''function HeroHeading() {
  return (
    <h1 className="cinema-title" aria-label="Digital Products for What’s Next.">
      {HERO_LINES.map(({ lineIndex, words, highlight }) => (
        <span className={`hero-title-line title-line-${lineIndex}`} key={lineIndex} aria-hidden="true">
          {words.map((word, wordIndex) => {
            const isHighlight = word === highlight;
            const globalWordOrder = lineIndex === 0 ? wordIndex : 2 + wordIndex;
            return (
              <span
                className={`hero-word ${isHighlight ? "hero-word-accent" : "hero-word-navy"}`}
                key={word}
                style={{ "--word-order": globalWordOrder } as CSSProperties}
              >
                {wordIndex > 0 ? " " : ""}
                {Array.from(word).map((char, i) => (
                  <span
                    data-hero-glyph
                    key={i}
                    style={{ "--glyph-order": globalWordOrder * 5 + i } as CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}'''

new_heading = '''function HeroHeading() {
  return (
    <h1 className="cinema-title" aria-label="Digital Products for What’s Next.">
      {HERO_LINES.map(({ lineIndex, words, highlight }) => (
        <span className={`hero-title-line title-line-${lineIndex}`} key={lineIndex} aria-hidden="true">
          <span className="hero-title-line-inner" data-hero-title-line>
            {words.map((word, wordIndex) => {
              const isHighlight = word === highlight;
              const globalWordOrder = lineIndex === 0 ? wordIndex : 2 + wordIndex;
              return (
                <span
                  className={`hero-word ${isHighlight ? "hero-word-accent" : "hero-word-navy"}`}
                  key={word}
                  style={{ "--word-order": globalWordOrder } as CSSProperties}
                >
                  {wordIndex > 0 ? " " : ""}
                  {word}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </h1>
  );
}'''

# Also add animation targets to Services intro on Home:
# <p className="services-intro"> -> <p className="services-intro" data-services-intro-support>
old_services_intro = '''          <div>
            <p className="services-intro">One connected perspective.<br />Five ways to move an idea forward.</p>
            <ButtonLink href="/services" secondary>Explore All Services</ButtonLink>
          </div>'''

new_services_intro = '''          <div>
            <p className="services-intro" data-services-intro-support>One connected perspective.<br />Five ways to move an idea forward.</p>
            <div data-services-cta-support>
              <ButtonLink href="/services" secondary>Explore All Services</ButtonLink>
            </div>
          </div>'''

# Also add animation targets to Closing Contact CTA on Home:
old_contact_cta = '''            <div className="button-group">
              <ButtonLink href="/contact">Let’s Talk</ButtonLink>
              <p>Tell us about your idea.<br />Let’s explore what’s possible.</p>
            </div>'''

new_contact_cta = '''            <div className="button-group" data-contact-cta-support>
              <ButtonLink href="/contact">Let’s Talk</ButtonLink>
              <p data-contact-lead-support>Tell us about your idea.<br />Let’s explore what’s possible.</p>
            </div>'''

assert old_heading in text, "old_heading not found"
text = text.replace(old_heading, new_heading, 1)

assert old_services_intro in text, "old_services_intro not found"
text = text.replace(old_services_intro, new_services_intro, 1)

assert old_contact_cta in text, "old_contact_cta not found"
text = text.replace(old_contact_cta, new_contact_cta, 1)

with open('src/components/home/home-page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/components/home/home-page.tsx successfully!')

