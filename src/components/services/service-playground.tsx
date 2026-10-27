import type { Service } from "@/content/models";
import { serviceDetails } from "@/content/services/details";
import { PrototypeArt } from "./prototype-art";
import { MobileDepth } from "./mobile-depth";

export function ServicePlayground({ service }: { service: Service }) {
  const copy = serviceDetails[service.slug];
  if (!copy) return null;
  return <div className={`service-playground playground-${service.visual}`} data-service-demo={service.visual}>
    <div className="scene-choreography" data-service-scene>{service.visual === "mobile" ? <MobileDepth poster={<PrototypeArt type="mobile" />} /> : <PrototypeArt type={service.visual} />}</div>
    <details className="prototype-switch"><summary>{copy.control}<span aria-hidden="true">↗</span></summary><p>{copy.outcome}</p></details>
    <p className="prototype-disclosure">Concept interface / built for this website / not client work</p>
  </div>;
}
