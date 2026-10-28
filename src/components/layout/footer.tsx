import { publishableArticles } from "@/lib/data/articles";
import Link from "next/link";
import { Brand } from "./brand";
import { services } from "@/content/services";
import { ScrollTop } from "../motion/scroll-top";

export function Footer() {
  return (
    <footer className="site-footer" data-home-section="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p className="footer-description">
              Digital products.<br />
              A considered point of view.
            </p>
            <div className="footer-company-channels">
              <p className="eyebrow footer-channel-label">Official Channel</p>
              <div className="footer-channel-links">
                <a
                  href="https://www.linkedin.com/company/motekra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-channel-link"
                  aria-label="MOTEKRA on LinkedIn"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          <nav aria-label="Company links">
            <p className="eyebrow">Explore</p>
            {[
              ["/work", "Work"],
              ["/services", "Services"],
              ["/about", "About"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link prefetch={false} href={href!} key={href}>
                {label}
              </Link>
            ))}
            {publishableArticles().length > 0 && (
              <Link prefetch={false} href="/insights">
                Insights
              </Link>
            )}
          </nav>

          <nav aria-label="Service capabilities">
            <p className="eyebrow">Services</p>
            {services.map((service) => (
              <Link
                prefetch={false}
                key={service.slug}
                href={`/services/${service.slug}`}
              >
                {service.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MOTEKRA. All rights reserved.</p>
          <ScrollTop />
        </div>
      </div>
    </footer>
  );
}
