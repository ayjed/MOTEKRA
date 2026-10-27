import Image from "next/image";
import type { Founder } from "@/content/models";
import { founderDetails } from "@/content/team/profile";

export function FounderPortrait({ person, priority = false }: { person: Founder; priority?: boolean }) {
  const portrait = founderDetails[person.slug]?.portrait;
  return <figure className="editorial-portrait" data-portrait>
    <div className="portrait-geometry" aria-hidden="true"><i /><i /></div>
    <div className="portrait-frame" data-portrait-frame>{portrait ? <div className="portrait-parallax" data-portrait-plane><Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 45vw, 40vw" preload={priority} className="founder-photograph" /></div> : <div className="portrait-pending" data-portrait-plane><Image src="/assets/brand/motekra-mark.png" width={76} height={76} alt="" /><p>Original founder photograph<br />awaiting confirmation</p></div>}</div>
    <figcaption className="portrait-caption"><span>{person.name}</span><span>{person.title}<br />MOTEKRA</span></figcaption>
  </figure>;
}
