"use client";

import { useRef, useState, type FormEvent } from "react";
import { services } from "@/content/services";
import { validateInquiry, type FieldErrors } from "@/lib/contact/schema";
import type { ContactResult } from "@/lib/contact/handler";

export function InquiryForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);

  const errors: FieldErrors = result?.errors ?? {};

  const show = (value: ContactResult) => {
    setResult(value);
    requestAnimationFrame(() => summary.current?.focus());
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const values = Object.fromEntries(new FormData(event.currentTarget));
    const check = validateInquiry(values);

    if (Object.keys(check.errors).length) {
      show({
        ok: false,
        message: "Please review the highlighted fields before sending.",
        errors: check.errors,
      });
      return;
    }

    inFlight.current = true;
    setPending(true);
    setResult(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(25000),
      });

      const payload: unknown = await response.json();
      if (
        !payload ||
        typeof payload !== "object" ||
        !("ok" in payload) ||
        !("message" in payload) ||
        typeof payload.message !== "string" ||
        typeof payload.ok !== "boolean" ||
        (payload.ok && !response.ok)
      ) {
        throw new Error("Invalid status");
      }

      show(payload as ContactResult);
    } catch {
      show({
        ok: false,
        message:
          "We could not confirm delivery at this moment. Your message is preserved below. Please try again shortly or connect with us directly via LinkedIn.",
      });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  const described = (field: keyof FieldErrors) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <form
      className="inquiry-form"
      action="/api/contact"
      method="post"
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      {/* Honeypot anti-spam protection */}
      <div className="contact-honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {result && (
        <div
          className={`inquiry-result ${result.ok ? "is-success" : "is-error"}`}
          ref={summary}
          tabIndex={-1}
          role={result.ok ? "status" : "alert"}
        >
          <h3>{result.ok ? "Inquiry Received" : "Please Review Your Inquiry"}</h3>
          <p>{result.message}</p>
          {result.errors && (
            <ul>
              {Object.entries(result.errors).map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(field)?.focus();
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {result.reference && (
            <p className="inquiry-reference">Reference: {result.reference}</p>
          )}
        </div>
      )}

      <fieldset disabled={pending || Boolean(result?.ok)}>
        <legend className="sr-only">Project inquiry details</legend>

        <div className="inquiry-pair">
          <label className="field" htmlFor="name" style={{ "--field-index": 1 } as React.CSSProperties}>
            <span>Your name</span> <span className="field-req">(required)</span>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="e.g. Alex Morgan"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={described("name")}
            />
            {errors.name && (
              <span className="field-error" id="name-error">
                {errors.name}
              </span>
            )}
          </label>

          <label className="field" htmlFor="email" style={{ "--field-index": 2 } as React.CSSProperties}>
            <span>Your email</span> <span className="field-req">(required)</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              placeholder="e.g. alex@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={described("email")}
            />
            {errors.email && (
              <span className="field-error" id="email-error">
                {errors.email}
              </span>
            )}
          </label>
        </div>

        <label className="field" htmlFor="projectType" style={{ "--field-index": 3 } as React.CSSProperties}>
          <span>Project type</span> <span className="field-req">(required)</span>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={described("projectType")}
          >
            <option value="">Select project type</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
            <option value="not-sure">Not sure yet — let’s explore</option>
          </select>
          {errors.projectType && (
            <span className="field-error" id="projectType-error">
              {errors.projectType}
            </span>
          )}
        </label>

        <label className="field" htmlFor="message" style={{ "--field-index": 4 } as React.CSSProperties}>
          <span>Tell us about your project</span> <span className="field-req">(required)</span>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            minLength={20}
            maxLength={5000}
            placeholder="Share your goals, product vision, timeline, or references."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={described("message")}
          />
          {errors.message && (
            <span className="field-error" id="message-error">
              {errors.message}
            </span>
          )}
        </label>

        <p className="inquiry-privacy-note">
          We respect your privacy. Details shared are used solely to evaluate your project inquiry.
        </p>

        <button
          type="submit"
          className="button button-primary contact-submit-btn"
          disabled={pending || Boolean(result?.ok)}
        >
          <span>{pending ? "Sending inquiry…" : result?.ok ? "Inquiry Sent ✓" : "Send Inquiry"}</span>
          <span className="btn-arrow" aria-hidden="true">↗</span>
        </button>
      </fieldset>

      <noscript>
        <p>The form works without JavaScript. Submission opens a simple status page with validation feedback.</p>
      </noscript>
    </form>
  );
}
