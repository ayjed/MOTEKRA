import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { Founder } from "@/content/models";
import { founderDetails } from "@/content/team/profile";
import { ContactCta } from "@/components/sections/shared";
import { Eyebrow } from "@/components/ui/primitives";
import { EditorialCinema } from "./editorial-cinema";
import { FounderPortrait } from "./portrait";
import { Skills, SocialLinks } from "./profile-sections";
import "@/styles/about.css";

export function FounderPage({ person }: { person: Founder }) {
  const details = founderDetails[person.slug]!;
  return (
    <EditorialCinema>
      <section className="editorial-hero founder-hero">
        <div className="container editorial-hero-grid">
          <div>
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: person.name, path: `/team/${person.slug}` },
              ]}
            />
            <Eyebrow>Software Developer & Creative Technologist / MOTEKRA</Eyebrow>
            <h1>
              {person.name.split(" ").map((word, i) => (
                <span className="editorial-line-mask" key={word}>
                  <span data-editorial-line className={i ? "blue-text" : ""}>
                    {word}
                    {i === 0 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>
            <p className="lead">{person.title}</p>
            <SocialLinks />
          </div>
          <FounderPortrait person={person} priority />
        </div>
      </section>

      <section className="section editorial-bio">
        <div className="container editorial-two-column">
          <div>
            <Eyebrow>Biography</Eyebrow>
            <h2>
              Engineering ideas.<br />
              <span>Shaping experiences.</span>
            </h2>
          </div>
          <div className="editorial-copy" data-editorial-stagger>
            {details.biography.map((text) => (
              <p className="lead" data-editorial-item key={text}>
                {text.split(" ").map((word, i) => (
                  <span className="bio-word" key={i}>
                    {word}{" "}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Skills />
      <ContactCta />
    </EditorialCinema>
  );
}
