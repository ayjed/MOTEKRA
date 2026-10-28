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
                <span className="contact-line-mask" key={line}>
                  <span data-contact-title-line>
                    {line.split(" ").map((word, j) => (
                      <span key={word}>
                        {j > 0 && " "}
                        <span data-contact-word>{word}</span>
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>
            <p className="lead" data-contact-hero-lead>
              Tell us about your idea. Let’s explore what’s possible.
            </p>
            <Link prefetch={false} className="contact-scroll-link" href="#inquiry" data-contact-hero-cta>
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
              <span className="contact-line-mask"><span data-inquiry-heading-line>Tell Us About Your Project.</span></span>
            </h2>
            <p className="inquiry-lead" data-inquiry-lead>
              Share a few details about what you have in mind.
            </p>
            <InquiryForm />
          </div>

          <aside className="inquiry-aside" data-contact-reveal aria-label="Official Contact Channels">
            <h2 aria-label="Let’s build something meaningful.">
              <span className="contact-line-mask"><span data-aside-heading-line>Let’s build</span></span>
              <span className="contact-line-mask"><span data-aside-heading-line className="blue-text">something meaningful.</span></span>
            </h2>
            <p className="inquiry-aside-intro" data-aside-lead>
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
