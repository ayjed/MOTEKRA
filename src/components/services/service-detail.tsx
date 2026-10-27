import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import Link from "next/link";
import type { Service } from "@/content/models";
import { services } from "@/content/services";
import { serviceDetails } from "@/content/services/details";
import { relatedServiceProjects, serviceStructuredData } from "@/lib/data/services";
import { ButtonLink, DraftNote, Eyebrow } from "@/components/ui/primitives";
import { ServicePlayground } from "./service-playground";
import { ServicesCinema } from "./services-cinema";
import "@/styles/services.css";

export function ServiceDetail({ service }: { service: Service }) {
  const copy = serviceDetails[service.slug]; if (!copy) return null;
  const related = relatedServiceProjects(service.slug);
  const schema = serviceStructuredData(service);
  const next = services[(services.findIndex((item) => item.slug === service.slug)+1)%services.length]!;
  return <ServicesCinema><JsonLd data={schema}/><header className="service-detail-hero"><div className="container"><Breadcrumbs items={[{name:"Home",path:"/"},{name:"Services",path:"/services"},{name:service.title,path:`/services/${service.slug}`}]}/><div className="service-detail-heading"><Eyebrow>Proposed service / scope under review</Eyebrow><h1>{service.title}</h1><p className="lead">{copy.intent}</p><DraftNote>Provisional offering · deliverables subject to agreement</DraftNote></div></div></header>
    <section className={`service-detail-intro chapter-${service.visual}`} data-service-chapter={service.visual}><div className="container service-detail-intro-grid"><div><Eyebrow>The proposed focus</Eyebrow><h2>{copy.focus}</h2><p>{service.description}</p><p>{copy.overview}</p><ButtonLink href="/contact">Discuss this scope</ButtonLink></div><ServicePlayground service={service} /></div></section>
    <div className="container service-detail-body"><nav className="service-detail-index" aria-label="Service detail sections"><a href="#potential-deliverables">Deliverables</a><a href="#proposed-method">Approach</a><a href="#related-work">Related work</a><a href="#service-questions">Questions</a></nav><div className="service-detail-prose"><section id="potential-deliverables"><Eyebrow>Scope / possible outputs</Eyebrow><h2>Potential deliverables.</h2><p>The final outputs depend on the agreed brief. These are proposed areas to discuss, not a fixed package or a delivery promise.</p><ul className="service-deliverables">{copy.deliverables.map((item) => <li key={item}><span aria-hidden="true">◆</span>{item}</li>)}</ul></section>
    <section id="proposed-method"><Eyebrow>Method / a proposed approach</Eyebrow><h2>Make the decisions visible.</h2><ol className="service-method">{copy.approach.map(([title,body]) => <li key={title}><span>◆</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></section>
    <section id="related-work"><Eyebrow>Related case studies / evidence first</Eyebrow><h2>The work needs its context.</h2>{related.length ? <ul className="service-related-cases">{related.map((project) => <li key={project.slug}><Link prefetch={false} href={`/work/${project.slug}`}>{project.title} ↗</Link><p>{project.role}</p></li>)}</ul> : <div className="service-related-empty"><p>No approved client case study is linked to this proposed service yet. Candidate projects remain unpublished until ownership, contribution, status and display permission are verified.</p><Link prefetch={false} href="/work" className="text-link">View work and labelled website experiments ↗</Link></div>}</section>
    <section id="service-questions"><Eyebrow>Questions / before the brief</Eyebrow><h2>A clearer starting point.</h2><div className="service-faq">{copy.questions.map(([question,answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section></div></div>
    <section className="service-detail-cta"><div className="container"><Eyebrow>Let’s define the next step</Eyebrow><h2>Bring the idea.<br /><span>Shape the scope.</span></h2><p>Active service scope and availability still need confirmation. No budget, timeline or result is promised by this preview.</p><ButtonLink href="/contact">Discuss {service.title}</ButtonLink><Link prefetch={false} className="next-service-link" href={`/services/${next.slug}`}>Next proposed capability: {next.title}<span aria-hidden="true">↗</span></Link></div></section></ServicesCinema>;
}

