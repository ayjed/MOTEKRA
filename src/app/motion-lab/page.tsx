import { notFound } from "next/navigation";
import { SplitHeading } from "@/components/motion/typography";
import { Reveal } from "@/components/motion/reveal";
import { HeroHandoff } from "@/components/motion/handoff";
import { HoverPreview, PointerTilt } from "@/components/motion/tactile";
import { ProductPoster } from "@/components/three/product-poster";
import { SceneDemo } from "@/components/three/scene-demo";
import { ButtonLink, DraftNote, Eyebrow } from "@/components/ui/primitives";
import { LabDiagnostics } from "@/components/motion/lab-diagnostics";

// Build-time gated static demo; no request-time server feature.
export const metadata = {
  title: "Private motion lab",
  description: "MOTEKRA internal motion architecture evaluation.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function MotionLab() {
  if (process.env.MOTION_LAB_ENABLED !== "true") notFound();
  return <div className="motion-lab">
    <HeroHandoff>
      <section className="lab-hero"><div className="container lab-hero-grid"><div><Eyebrow>MOTEKRA / private motion studies / 02</Eyebrow><SplitHeading as="h1" lines={["Motion with", "a point of view."]} /><p className="lead">A shared language for ideas becoming interfaces. Typography, product depth and native interaction, composed together.</p><div className="button-group"><ButtonLink href="#motion-studies">Explore the Studies</ButtonLink><ButtonLink href="/work" secondary>Test a Route Transition</ButtonLink></div><DraftNote>Internal demo · concept UI · no client work</DraftNote></div><div data-handoff-visual><SceneDemo poster={<ProductPoster />} /></div></div></section>
      <section className="lab-handoff-target dark"><div className="container"><div className="handoff-energy" data-handoff-energy aria-hidden="true" /><Eyebrow>01 / scroll handoff</Eyebrow><h2>Give the next idea<br /><span>room to arrive.</span></h2><p>The device reframes as this section arrives. Native scroll stays in control; the words stay in the document.</p></div></section>
    </HeroHandoff>
    <section className="section" id="motion-studies"><div className="container"><Eyebrow>02 / masks, perspective & focus</Eyebrow><SplitHeading lines={["Less repetition.", "More intention."]} /><p className="lead lab-intro">One interface exploration, three ways to direct attention. These are interaction studies, not portfolio projects.</p>
      <Reveal kind="stagger"><div className="study-grid">
        <div data-stagger><PointerTilt><HoverPreview preview={<span>Focus reveals the same layer as hover ↗</span>}><article className="study-card"><Eyebrow>Pointer / focus</Eyebrow><div className="interface-study" aria-hidden="true"><div /><div /><div /></div><h3>Find another layer.</h3><p>Pointer depth for a mouse. A clear preview for keyboard focus.</p><ButtonLink href="/services/ui-ux-design">Explore Proposed Design Scope</ButtonLink></article></HoverPreview></PointerTilt></div>
        <div data-stagger><Reveal kind="image"><article className="study-card study-card-blue" data-image><Eyebrow>Image / surface mask</Eyebrow><div className="wireframe-study" aria-hidden="true"><i /><i /><i /></div><h3>Structure becomes surface.</h3><p>A perspective crop resolves into a readable interface composition.</p><ButtonLink href="/services/web-development" secondary>Explore Proposed Web Scope</ButtonLink></article></Reveal></div>
      </div></Reveal>
    <LabDiagnostics /></div></section>
    <section className="section dark lab-notes"><div className="container"><Eyebrow>03 / a shared engineering contract</Eyebrow><SplitHeading lines={["Designed to move.", "Built to step back."]} /><Reveal kind="stagger"><ol className="lab-contract"><li data-stagger><span>01</span><h3>Readable first.</h3><p>Headings, service text and links arrive as HTML. Animation is an enhancement.</p></li><li data-stagger><span>02</span><h3>Attention, respected.</h3><p>Reduced motion, smaller screens and data-saving preferences select the static visual.</p></li><li data-stagger><span>03</span><h3>Quiet when idle.</h3><p>The 3D scene renders on demand, pauses offscreen and stops while the tab is hidden.</p></li></ol></Reveal><div className="button-group"><ButtonLink href="/contact">Test Contact Navigation</ButtonLink><ButtonLink href="#top" secondary>Back to the Scene</ButtonLink></div></div></section>
  </div>;
}
