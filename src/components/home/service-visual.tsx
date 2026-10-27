import Image from "next/image";
import type { Service } from "@/content/models";

export function ServiceVisual({ type }: { type: Service["visual"] }) {
  return <div className={`service-stage visual-${type}`}>
    {type === "design" && <><div className="design-board"><div className="design-sidebar" /><div className="design-heading" /><div className="design-block" /><div className="design-text" /></div><div className="token-strip"><i /><i /><i /><i /></div></>}
    {type === "web" && <><div className="web-window window-back"><span /><i /><i /></div><div className="web-window window-front"><span /><div className="web-layout"><i /><i /><i /></div></div><div className="web-label">web / responsive</div></>}
    {type === "mobile" && <><div className="mobile-device"><span /><div className="mobile-screen"><i /><i /><i /></div></div><div className="mobile-preview"><i /><i /></div></>}
    {type === "strategy" && <div className="roadmap"><div className="roadmap-line" />{["Idea", "Scope", "Build"].map((item, i) => <div className={`roadmap-stop stop-${i}`} key={item}><span>Phase</span><strong>{item}</strong></div>)}</div>}
    {type === "brand" && <><div className="identity-sheet"><Image src="/assets/brand/motekra-mark.png" width={56} height={56} alt="" /><b>MOTEKRA</b><span>Form. Colour. Character.</span></div><div className="identity-swatches"><i /><i /><i /></div></>}
  </div>;
}

