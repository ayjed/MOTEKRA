import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/data/work";
import { candidateImage } from "@/content/projects/candidates";

export function StudyVisual({ visual }: { visual: "device" | "system" | "flow" }) {
  return <div className={`work-study-visual visual-${visual}`}><div className="study-browser-bar"><i /><i /><i /><span>MOTEKRA / WEBSITE STUDY</span></div><div className="study-interface"><span>CONCEPT / INTERFACE EXPLORATION</span><strong>{visual === "device" ? <>Ideas take<br />shape.</> : visual === "system" ? <>A considered<br />system.</> : <>From idea<br />to interaction.</>}</strong><div className="study-interface-modules">{(visual === "flow" ? ["Discover", "Define", "Design", "Develop", "Launch"] : ["Explore", "Define", "Create"]).map((label) => <i key={label}>{label}</i>)}</div></div></div>;
}

export function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const image = item.kind === "draft" ? candidateImage(item.id, "hero") : item.kind === "project" ? item.project.images?.[0] : null;
  const buckets=[item.status.includes('Concept')?'concept':'',item.status==='In Development'?'development':'',item.kind==='project'&&item.project.ownership==='motekra'&&item.project.status==='completed'?'company':'',item.kind==='project'&&['founder-independent','collaborator'].includes(item.project.ownership??'')?'founder':''].filter(Boolean).join(' ');
  return <article data-work-buckets={buckets} className={`work-card card-${index % 4} ${item.kind === "study" ? "study-card" : ""}`} data-work-reveal data-kind={item.kind} data-work-id={item.id}>
    <div className="work-image-mask"><Link href={item.href} prefetch={false} className="work-visual-link">
      {image ? <Image src={image.src} width={image.width} height={image.height} alt={item.kind === "draft" ? `Crop of the supplied ${item.title} interface screenshot; attribution and delivery unverified` : item.title} unoptimized={item.kind === "draft"} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 66vw" loading="lazy" className="work-source-image" /> : item.kind === "study" ? <StudyVisual visual={item.visual} /> : <div className="work-visual-pending">Project visual awaiting approved export</div>}
      <span className="work-image-caption">{item.kind === "draft" ? "Supplied screenshot / review only" : "Implemented website exploration"}</span><span className="work-open-icon" aria-hidden="true">↗</span>
      <span className="work-hover-detail"><span>{item.attribution}</span><b>{item.kind === "draft" ? "Inspect the evidence" : item.kind === "study" ? "Explore the live study" : "Enter the case study"} ↗</b></span>
    </Link></div>
    <div className="work-card-info"><div className="work-card-meta"><span className="work-status">{item.status}</span></div><h2><Link prefetch={false} href={item.href}>{item.title}</Link></h2><p className="work-attribution">{item.attribution}</p><p>{item.summary}</p><Link className="text-link work-entry-link" prefetch={false} href={item.href}>{item.kind === "draft" ? "Review case study" : item.kind === "study" ? "Explore website study" : "View case study"}<span aria-hidden="true">↗</span></Link></div>
  </article>;
}


