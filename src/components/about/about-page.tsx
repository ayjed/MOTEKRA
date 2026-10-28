import { team } from "@/content/team";
import { companyDirection, founderDetails } from "@/content/team/profile";
import { ContactCta } from "@/components/sections/shared";
import { ButtonLink } from "@/components/ui/primitives";
import { EditorialCinema } from "./editorial-cinema";
import { FounderPortrait } from "./portrait";
import { CreditedWork, InterfaceComposition, SocialLinks } from "./profile-sections";
import "@/styles/about.css";

export default function AboutPage() {
  const person = team[0]!;
  return (
    <EditorialCinema>
      <section className="editorial-hero">
        <div className="container editorial-hero-grid">
          <div>
            <h1>
              {["A Studio for", "What’s Next."].map((line, i) => (
                <span className="editorial-line-mask" key={line}>
                  <span data-editorial-line className={i ? "blue-text" : ""}>
                    {line}{i === 0 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>
            <p className="lead">Where design intelligence and rigorous software engineering meet.</p>
            <ButtonLink href="#perspective">Meet the studio</ButtonLink>
          </div>
          <InterfaceComposition />
        </div>
      </section>

      <section className="section editorial-perspective" id="perspective">
        <div className="container editorial-two-column">
          <div>
            <h2>
              Design and<br />
              engineering.<br />
              <span>In conversation.</span>
            </h2>
          </div>
          <div className="editorial-copy" data-editorial-stagger>
            {companyDirection.description.map((text) => (
              <p className="lead" data-editorial-item key={text}>{text}</p>
            ))}
            <p data-editorial-item>{companyDirection.mission}</p>
          </div>
        </div>
      </section>

      <section className="section editorial-founder">
        <div className="container editorial-two-column">
          <FounderPortrait person={person} />
          <div className="editorial-copy">
            <h2>{person.name}</h2>
            <p className="editorial-role">{person.title} · MOTEKRA</p>
            <p className="lead">{founderDetails[person.slug]!.biography[0]}</p>
            <ButtonLink href={`/team/${person.slug}`}>Meet Akinwumi</ButtonLink>
            <SocialLinks />
          </div>
        </div>
      </section>

      <section className="section editorial-values dark" id="values">
        <div className="container">
          <h2>
            Built on Curiosity.<br />
            Driven by <span>Intent.</span>
          </h2>
          <div className="values-stack" data-editorial-stagger>
            <span className="values-rail" data-values-rail aria-hidden="true" />
            {companyDirection.proposedValues.map(([title, description]) => (
              <details open key={title} data-editorial-item>
                <summary>
                  <span>◆</span>
                  <h3>{title}</h3>
                  <b aria-hidden="true">↗</b>
                </summary>
                <p>{description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>
            Clear thinking.<br />
            <span>Considered making.</span>
          </h2>
          <div className="editorial-principles" data-editorial-stagger>
            {companyDirection.principles.map(([title, description]) => (
              <article key={title} data-editorial-item>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CreditedWork />
      <ContactCta />
    </EditorialCinema>
  );
}
