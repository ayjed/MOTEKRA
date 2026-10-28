import Link from "next/link";
import { ContactCinema } from "@/components/contact/contact-cinema";
import { ContactArtwork } from "@/components/contact/contact-artwork";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { ContactFaq } from "@/components/contact/contact-faq";
import { LinkedInIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo/site";
import "@/styles/contact.css";

export const runtime = "nodejs";

export const metadata = pageMetadata(
  "Contact — Start a Digital Product Conversation",
  "Partner with MOTEKRA on your next web application, mobile product, or design system. Submit your project inquiry and explore our collaborative approach.",
  "/contact"
);

export default function Contact() {
  return (
    <ContactCinema>
      {/* Contact Hero */}
      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <div className="container contact-hero-grid">
          <div>
            <h1 id="contact-hero-title">
              {["Have Something", "in Mind?"].map((line) => (
                <span className="contact-line" key={line}>
                  {line.split(" ").map((word, j) => (
                    <span key={word}>
                      {j > 0 && " "}
                      <span data-contact-word>{word}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="lead">
              Tell us about your idea. Let’s explore what’s possible.
            </p>
            <Link prefetch={false} className="contact-scroll-link" href="#inquiry">
              <span>Start the conversation</span>
              <span aria-hidden="true">↓</span>
            </Link>
          </div>

          <ContactArtwork />
        </div>
      </section>

      {/* Inquiry Form & Aside Context */}
      <section className="section contact-inquiry" id="inquiry" aria-labelledby="inquiry-heading">
        <div className="container contact-form-grid">
          <div className="inquiry-panel" data-contact-reveal>
            <h2 id="inquiry-heading">
              Tell Us About Your Project.
            </h2>
            <p className="inquiry-lead">
              Share a few details about what you have in mind.
            </p>
            <InquiryForm />
          </div>

          <aside className="inquiry-aside" data-contact-reveal aria-label="Official Contact Channels">
            <h2>
              Let’s build<br />
              <span>something meaningful.</span>
            </h2>
            <p className="inquiry-aside-intro">
              Share your vision and we’ll explore the next steps together.
            </p>

            <div className="contact-channels-card">
              <h3 className="channels-heading">Connect with MOTEKRA</h3>
              <p className="channels-subtext">
                For company news, insights, and official updates, connect with our approved corporate channel.
              </p>

              <div className="official-channels-group">
                <a
                  href="https://www.linkedin.com/company/motekra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-btn linkedin-btn"
                  aria-label="Visit MOTEKRA on LinkedIn"
                >
                  <LinkedInIcon className="channel-icon" />
                  <span className="channel-btn-text">
                    <strong>MOTEKRA on LinkedIn</strong>
                    <span className="channel-btn-detail">Official Company Page</span>
                  </span>
                  <span className="channel-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ Section with Animated Accordion & Scroll-Following Headline */}
      <section className="section contact-faq" id="questions" aria-labelledby="faq-heading">
        <div className="container">
          <ContactFaq />
        </div>
      </section>
    </ContactCinema>
  );
}
