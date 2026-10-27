import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { projectSchema } from "@/lib/seo/schema";
import { team } from "@/content/team";
import { services } from "@/content/services";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/models";
import { candidates, candidateImage, isCandidate } from "@/content/projects/candidates";
import { projects } from "@/content/projects";
import { publishableProjects } from "@/content/models";
import { ownershipLabel, statusLabel } from "@/lib/data/work";
import { ContactCta } from "@/components/sections/shared";
import { Eyebrow } from "@/components/ui/primitives";
import { WorkCinema } from "./work-cinema";
import "@/styles/work.css";

export function ProjectDetail({ project }: { project: Project }) {
  const draft = isCandidate(project);
  const image = draft ? candidateImage(project.slug, "hero") : project.images?.[0];
  const nextItems = draft ? candidates : publishableProjects(projects);
  const next = nextItems.length > 1 ? nextItems[(nextItems.findIndex((p) => p.slug === project.slug) + 1) % nextItems.length] : undefined;
  const relatedServices=services.filter(service=>service.publication==="approved"&&project.serviceSlugs?.includes(service.slug));
  const credits=(project.contributions??[]).filter(credit=>credit.approved&&credit.role.trim()).flatMap(credit=>{const person=team.find(person=>person.slug===credit.personSlug&&person.publication==="approved");return person?[{person,role:credit.role}]:[];});
  return <WorkCinema><JsonLd data={projectSchema(project)}/><header className="case-hero"><div className="container"><Breadcrumbs items={[{name:"Home",path:"/"},{name:"Work",path:"/work"},{name:project.title,path:`/work/${project.slug}`}]}/><div className="case-hero-grid"><div><Eyebrow>{draft ? "Draft evidence / local review only" : `${ownershipLabel(project)} / ${statusLabel(project)}`}</Eyebrow><h1>{project.title}</h1><p className="lead">{project.summary}</p></div><dl className="case-facts"><div><dt>Attribution</dt><dd>{ownershipLabel(project)}</dd></div><div><dt>Stage</dt><dd>{statusLabel(project)}</dd></div><div><dt>Contribution</dt><dd>{project.role ?? "Unverified — awaiting exact role"}</dd></div><div><dt>Publication</dt><dd>{draft ? "Draft — display permission pending" : "Approved for display"}</dd></div></dl></div>
    {draft && <aside className="case-draft-notice"><strong>Evidence review, not a completed client case.</strong><p>Source screenshots establish visible interface content. They do not verify ownership, implementation, completion, production integrations or business results. This review is excluded from indexing.</p></aside>}
    {image && <figure className="case-hero-evidence"><Image src={image.src} width={image.width} height={image.height} alt={draft ? `${project.title}: interface evidence cropped from the supplied screenshot` : project.images?.[0]?.alt ?? project.title} unoptimized={draft} loading="eager" sizes="100vw" /><figcaption>{draft ? (project.slug === "connectapi" ? "Concept UI screenshot. Figures are sample interface data, not verified usage or business results. Authorship and display permission remain unverified." : "Supplied interface screenshot crop. Original artwork preserved; role, status and permissions require verification.") : project.images?.[0]?.caption}</figcaption></figure>}
    </div></header><div className="container case-body"><nav className="case-section-nav" aria-label="Case study sections"><a href="#case-overview">{draft ? "Evidence" : "Overview"}</a>{project.problem && <a href="#case-problem">Problem</a>}{project.process?.length ? <a href="#case-process">Process</a> : null}{project.solution && <a href="#case-solution">Solution</a>}{project.technologies?.length ? <a href="#case-technology">Technology</a> : null}{project.resultsVerified.length ? <a href="#case-results">Results</a> : null}{draft && <a href="#case-verification">Verification</a>}</nav><div className="case-prose">
      {!draft&&(relatedServices.length>0||credits.length>0)&&<aside className="case-context-links"><h2>Services and contribution</h2>{relatedServices.map(service=><p key={service.slug}><Link prefetch={false} href={`/services/${service.slug}`}>{service.title}</Link></p>)}{credits.map(({person,role})=><p key={person.slug}><Link prefetch={false} href={`/team/${person.slug}`}>{person.name}</Link> — {role}</p>)}</aside>}<section id="case-overview"><Eyebrow>{draft ? "Observed source evidence" : "Overview"}</Eyebrow><h2>{draft ? "What the screenshot shows." : "The project, in context."}</h2><p>{draft ? project.observation : project.summary}</p>{draft && <p className="case-source-reference">Source: supplied {project.evidenceFile}, page 1. Visual description only; no external deployment or repository is verified.</p>}</section>
      {project.problem && <section id="case-problem"><Eyebrow>Context</Eyebrow><h2>The problem.</h2><p>{project.problem}</p></section>}
      {project.process?.length ? <section id="case-process"><Eyebrow>Approach</Eyebrow><h2>The process.</h2><ol>{project.process.map((step) => <li key={step}>{step}</li>)}</ol></section> : null}
      {project.solution && <section id="case-solution"><Eyebrow>Implementation</Eyebrow><h2>The solution.</h2><p>{project.solution}</p></section>}
      {project.technologies?.length ? <section id="case-technology"><h2>Verified technology.</h2><ul className="case-tech-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></section> : null}
      {draft && <figure className="case-detail-evidence"><Image {...candidateImage(project.slug, "detail")} alt={`Additional ${project.title} interface detail from the supplied presentation`} unoptimized loading="lazy" sizes="(max-width: 767px) 100vw, 70vw" /><figcaption>{project.slug === "connectapi" ? "Design/concept presentation. Any numbers shown are interface sample data, not verified usage, uptime or business outcomes. Profile controls and comments outside the presentation are excluded." : "Additional source interface detail. The visual is not proof of a working feature or a result delivered by MOTEKRA."}</figcaption></figure>}
      {project.resultsVerified.length > 0 && <section id="case-results"><Eyebrow>Evidence-backed outcomes</Eyebrow><h2>Verified results.</h2><ul>{project.resultsVerified.map((result) => <li key={result}>{result}</li>)}</ul></section>}
      {draft && <section id="case-verification" className="case-verification"><Eyebrow>Before publication</Eyebrow><h2>The story still needs its facts.</h2><p>No project problem, process, solution, stack or result is inferred to fill this template. The following require confirmation:</p><ul>{project.verificationNotes.map((note) => <li key={note}><span aria-hidden="true">↗</span>{note}</li>)}</ul><p>Company engagements, founder-independent work and collaborations will retain distinct credit. This record is a draft until the necessary evidence and permission are approved.</p></section>}
    </div></div>{next && <section className="case-next"><div className="container"><Eyebrow>{draft ? "Continue the evidence review" : "Next project"}</Eyebrow><Link href={`/work/${next.slug}`} prefetch={false}><span>{next.title}</span><span aria-hidden="true">↗</span></Link><p>{draft ? "Draft — ownership and contribution unverified" : ownershipLabel(next)}</p></div></section>}<ContactCta /></WorkCinema>;
}


