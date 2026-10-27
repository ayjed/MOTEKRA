import { publishableArticles } from "@/lib/data/articles";
import Link from "next/link";
import { Brand } from "./brand";
import { services } from "@/content/services";
import { ScrollTop } from "../motion/scroll-top";
import { founderProfiles } from "@/content/team";

export function Footer() {
  return <footer className="site-footer" data-home-section="footer"><div className="container">
    <div className="footer-top"><div><Brand /><p className="footer-description">Digital products.<br />A considered point of view.</p><p className="eyebrow footer-profile-label">Founder profiles</p><div className="footer-profile-links">{founderProfiles.map(([label, href]) => <a href={href} key={label} aria-label={`Founder on ${label}`}>{label} ↗</a>)}</div></div>
      <nav aria-label="Company links"><p className="eyebrow">Explore</p>{[["/work", "Work"], ["/services", "Services"], ["/about", "About"], ["/team/akinwumi-ayomiposi", "Founder profile"], ["/contact", "Contact"]].map(([href, label]) => <Link prefetch={false} href={href!} key={href}>{label}</Link>)}{publishableArticles().length>0&&<Link prefetch={false} href="/insights">Insights</Link>}</nav>
      <nav aria-label="Draft service links"><p className="eyebrow">Services · proposed scope</p>{services.map((service) => <Link prefetch={false} key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}</nav>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} MOTEKRA.</p><p>Portfolio content under review</p><ScrollTop /></div>
  </div></footer>;
}
