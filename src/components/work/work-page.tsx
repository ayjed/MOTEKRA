import Link from "next/link";
import { ContactCta } from "@/components/sections/shared";
import { ButtonLink, Eyebrow } from "@/components/ui/primitives";
import { filterWork, getWorkItems, workCategories } from "@/lib/data/work";
import { WorkFilters } from "./work-filters";
import { WorkCard } from "./work-card";
import { WorkCinema } from "./work-cinema";
import "@/styles/work.css";

const emptyCopy = {
  all: "Approved entries will appear here with their precise contribution and status.",
  company: "No company engagement is currently cleared for publication. Delivery under MOTEKRA, contribution and display permission must be established first.",
  founder: "Founder-independent and collaborative work will appear with Akinwumi Ayomiposi’s precise contribution. No candidate has that attribution approved yet.",
  concept: "Concepts appear with explicit non-production labels and verified attribution.",
  development: "Experiments are labelled as work in progress, without implied delivery or client results.",
  draft: "Candidate project cases are withheld outside the local draft review. No unverified work is represented as a completed client engagement.",
};

export function WorkPage() {
  const all = getWorkItems(true);
  const counts = Object.fromEntries(workCategories.map(([key]) => [key, filterWork(all, key).length]));
  return <WorkCinema><section className="work-hero"><div className="container"><Eyebrow>Work / a considered collection</Eyebrow><div className="work-hero-grid"><h1 aria-label="Real Ideas. Real Impact."><span className="work-title-mask" aria-hidden="true"><span data-work-line>Real Ideas.</span></span><span className="work-title-mask accent" aria-hidden="true"><span data-work-line>Real Impact.</span></span></h1><div className="work-hero-copy"><p className="lead">One portfolio.<br />Every contribution in context.</p><p>Company engagements, founder work, concepts and experiments belong in one place—with a clear account of who did what and where each project stands.</p><ButtonLink href="#work-collection" secondary>Explore the collection</ButtonLink></div></div><div className="work-hero-baseline"><span>DESIGN / DEVELOPMENT / EXPLORATION</span><span>Evidence before claims <span aria-hidden="true">↘</span></span></div></div></section>
    <section className="work-collection section" id="work-collection" aria-labelledby="collection-title"><div className="container"><div className="work-collection-heading"><Eyebrow>Selected perspectives</Eyebrow><h2 id="collection-title" className="sr-only">Work collection</h2><p>Explore by attribution and stage.</p></div><WorkFilters counts={counts}><WorkCinema gallery><div className="work-editorial-grid">{all.map((item,index)=><WorkCard item={item} index={index} key={item.id}/>)}</div></WorkCinema>{workCategories.filter(([key])=>key!=='draft'&&!counts[key]).map(([key])=><div className="work-empty" data-empty-category={key} key={key}><span aria-hidden="true">↗</span><h2>{key==='company'?'Company work, with proof.':key==='founder'?'The contribution comes first.':'A clear place for what’s next.'}</h2><p>{emptyCopy[key]}</p><Link prefetch={false} className="text-link" href="/work#work-collection">View the available explorations ↗</Link></div>)}</WorkFilters>
    </div></section>
    <section className="work-attribution-section"><div className="container"><Eyebrow>One website / clear credit</Eyebrow><div className="work-attribution-grid">{[["Company & shipped", "Delivery under MOTEKRA must be confirmed. A screenshot alone does not establish an engagement."], ["Founder & collaborative", "Independent and team projects credit the founder’s exact role, separately from company work."], ["Concepts & in development", "Explorations and unfinished work keep their status visible. Interface data never becomes a business result."]].map(([title, description]) => <div key={title}><h2>{title}</h2><p>{description}</p></div>)}</div><div className="work-editorial-strip" aria-hidden="true">IDEAS WITH DEPTH. / CREDIT WITH CLARITY.</div></div></section><ContactCta /></WorkCinema>;
}

