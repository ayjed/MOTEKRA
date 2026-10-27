import type { CSSProperties } from "react";
import { HomeSectionCinema } from "./section-cinema";
import Image from "next/image";
import Link from "next/link";
import { HomeCinema } from "./home-cinema";
import { HeroProduct } from "./hero-product";
import { SplitHeading } from "../motion/typography";
import { HoverPreview, PointerTilt } from "../motion/tactile";
import { ProductPoster } from "../three/product-poster";
import { ButtonLink, Eyebrow } from "../ui/primitives";
import { studies } from "@/content/studies";
import { founderProfiles } from "@/content/team";
import { candidates, candidateImage } from "@/content/projects/candidates";
import { pageMetadata } from "@/lib/seo/site";
import { TestimonialsMarquee } from "./testimonials-marquee";
import { ServicesAccordion } from "../services/services-accordion";
import { HomeProcess } from "./home-process";
import { HomeWork } from "./home-work";
import "@/styles/home.css";
import "@/styles/services.css";

export const metadata = pageMetadata("Digital products for what’s next", "We design and build high-performance web and mobile applications that help ambitious businesses grow, scale, and create real impact.", "/");

function HeroHeading() {
  return <h1 className="cinema-title" aria-label="Digital Products for What’s Next.">{["Digital Products", "for what’s", "Next."].map((line, index) => <span className={`hero-title-line title-line-${index}`} key={line} aria-hidden="true">{line.split(" ").map((word, wordIndex) => <span className="hero-word" key={word} style={{"--word-order":index*2+wordIndex} as CSSProperties}>{wordIndex > 0 ? " " : ""}{Array.from(word).map((char, i) => <span data-hero-glyph key={i} style={{"--glyph-order":index*5+wordIndex*2+i} as CSSProperties}>{char}</span>)}</span>)}{index < 2 ? " " : null}</span>)}</h1>;
}

export default function HomePage() {
  return <HomeCinema>
    <section className="home-hero home-hero-cinema" aria-label="Digital products for what’s next" data-home-section="hero">
      <div className="container cinema-hero-grid">
        <div className="hero-copy">
          <HeroHeading />
          <p className="lead" data-hero-support>We design and build high-performance web and mobile applications that help ambitious businesses grow, scale, and create real impact.</p>
          <div className="button-group" data-hero-support>
            <ButtonLink href="/work">See Our Work</ButtonLink>
            <ButtonLink href="/contact" secondary>Start a Project</ButtonLink>
          </div>
        </div>
        <div className="hero-product-handoff" id="hero-product">
          <div className="hero-orbit" aria-hidden="true" />
          <HeroProduct poster={<ProductPoster />} />
          <div className="capability-tag tag-design" aria-hidden="true"><span>UI & Product Design</span> ↗</div>
          <div className="capability-tag tag-build" aria-hidden="true"><span>Web & Mobile Development</span> ↗</div>
        </div>
      </div>
    </section>

    <HomeWork />

    <section className="section home-services" id="home-services" data-home-section="services" aria-labelledby="services-title">
      <div className="container">
        <Eyebrow>Our services / from thought to product</Eyebrow>
        <div className="section-heading">
          <div id="services-title">
            <SplitHeading lines={["What We", "Bring to Life."]} />
          </div>
          <div>
            <p className="services-intro">One connected perspective.<br />Five ways to move an idea forward.</p>
            <ButtonLink href="/services" secondary>Explore All Services</ButtonLink>
          </div>
        </div>
        <ServicesAccordion initialActiveSlug="ui-ux-design" />
      </div>
    </section>

    <HomeProcess />

    <HomeSectionCinema kind="founder"><section className="section home-founder" id="home-founder" data-home-section="founder" aria-labelledby="founder-title"><div className="container founder-grid"><div><Eyebrow>About MOTEKRA / Creative Technologist</Eyebrow><div id="founder-title"><SplitHeading lines={["A Studio","for What’s Next."]} /></div><p className="lead">Design and engineering, considered together.</p><ButtonLink href="/about">More About MOTEKRA</ButtonLink></div><div className="founder-editorial"><div className="founder-photo-frame"><Image src="/assets/team/ayomiposi.webp" alt="Akinwumi Ayomiposi — Software Developer & Creative Technologist" width={834} height={1024} className="founder-photo-real" sizes="(max-width: 767px) 90vw, 42vw" priority /></div><div className="founder-byline"><p className="eyebrow">Akinwumi Ayomiposi</p><h3>Software Developer &amp;<br />Creative Technologist</h3><p>MOTEKRA</p><Link prefetch={false} href="/team/akinwumi-ayomiposi" className="text-link">Developer profile ↗</Link><nav className="founder-socials" aria-label="Professional profiles">{founderProfiles.map(([label,href]) => <a href={href} key={label}>{label}<span aria-hidden="true">↗</span></a>)}</nav></div></div></div></section></HomeSectionCinema>

    <section className="section home-lab" id="creative-lab" data-home-section="lab" aria-labelledby="creative-lab-title"><div className="container"><Eyebrow>Creative lab / live interaction studies</Eyebrow><div className="section-heading"><div id="creative-lab-title"><SplitHeading lines={["Experiments","in the Making."]} /></div><p>Ideas made tangible.<br />Honest about where they stand.</p></div><div className="creative-study-grid">{studies.map((study) => <PointerTilt key={study.title}><HoverPreview preview={<span>Explore this working website study ↗</span>}><article className={`creative-study study-${study.visual}`}><div className="study-meta"><span className="status-pill">{study.status}</span><span className="study-tag">Live Study</span></div><a className="study-visual" href={study.href} aria-label={`Explore ${study.title}`}><div className="study-object" aria-hidden="true">{study.visual === "device" ? <><i /><i /></> : study.visual === "system" ? <><i /><i /><i /><i /></> : <><i /><i /><i /><i /><i /></>}</div></a><p>{study.type}</p><h3><a href={study.href}>{study.title} <span aria-hidden="true">↗</span></a></h3></article></HoverPreview></PointerTilt>)}</div><p className="study-attribution">Built as part of this website exploration. These studies are not client engagements or measured business outcomes.</p></div></section>

    <TestimonialsMarquee />

    <HomeSectionCinema kind="contact"><section className="home-contact" id="home-contact" data-home-section="contact" aria-labelledby="contact-title"><div className="container home-contact-inner"><div className="contact-copy"><Eyebrow>Let’s create the next perspective</Eyebrow><div id="contact-title"><SplitHeading lines={["Have Something","in Mind?"]} /></div><div className="button-group"><ButtonLink href="/contact">Let’s Talk</ButtonLink><p>Inquiry channel details<br />are being confirmed.</p></div></div><div className="contact-sculpture" aria-hidden="true"><div className="sculpture-panel sculpture-back"><span /><i /><i /></div><div className="sculpture-panel sculpture-mid"><span /><i /><i /></div><div className="sculpture-panel sculpture-front"><span /><i /><i /><b>↗</b></div><div className="sculpture-halo" /></div></div></section></HomeSectionCinema>
  </HomeCinema>;
}
