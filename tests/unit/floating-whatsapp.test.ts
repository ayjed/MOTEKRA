import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FloatingWhatsApp } from "@/components/team/floating-whatsapp";

describe("FloatingWhatsApp - Accessibility and Component Semantics", () => {
  it("renders a container landmark with an informative accessible label", () => {
    const html = renderToStaticMarkup(createElement(FloatingWhatsApp));

    expect(html).toContain('<aside class="founder-floating-whatsapp-container"');
    expect(html).toContain('aria-label="Direct WhatsApp contact with Ayomiposi"');
  });

  it("provides an accessible name on the action link via aria-label", () => {
    const html = renderToStaticMarkup(createElement(FloatingWhatsApp));

    expect(html).toContain('aria-label="Chat with Ayomiposi on WhatsApp"');
    expect(html).toContain('id="founder-floating-whatsapp"');
  });

  it("includes security attributes for external new-tab navigation", () => {
    const html = renderToStaticMarkup(createElement(FloatingWhatsApp));

    expect(html).toContain('href="https://wa.me/447403605289"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("renders decorative visual tooltip with aria-hidden and without conflicting role='tooltip'", () => {
    const html = renderToStaticMarkup(createElement(FloatingWhatsApp));

    // Tooltip span must have aria-hidden to prevent redundant announcements
    expect(html).toContain('class="founder-floating-whatsapp-tooltip"');
    expect(html).toContain('aria-hidden="true"');

    // Conflicting role="tooltip" must NOT be present on aria-hidden decorative element
    expect(html).not.toContain('role="tooltip"');

    // Visual tooltip text remains present for sighted users
    expect(html).toContain("Chat with Ayomiposi");
  });

  it("dynamically formats custom personName and phoneNumber props", () => {
    const html = renderToStaticMarkup(
      createElement(FloatingWhatsApp, {
        personName: "Jane Doe",
        phoneNumber: "1234567890",
      })
    );

    expect(html).toContain('href="https://wa.me/1234567890"');
    expect(html).toContain('aria-label="Direct WhatsApp contact with Jane Doe"');
    expect(html).toContain('aria-label="Chat with Jane Doe on WhatsApp"');
    expect(html).toContain("Chat with Jane Doe");
    expect(html).not.toContain('role="tooltip"');
  });
});
