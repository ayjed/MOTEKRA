import type { Service } from "../models";

// Approved commercial service offerings with bespoke client scoping.
export const services: readonly Service[] = [
  { slug: "ui-ux-design", title: "UI/UX Design", publication: "approved", visual: "design",
    description: "From first sketch to a clear, considered interface. Explore product flows, prototypes and visual systems." },
  { slug: "web-development", title: "Web Development", publication: "approved", visual: "web",
    description: "Thoughtful interfaces, brought to the browser. Explore accessible websites and purposeful web applications." },
  { slug: "mobile-app-development", title: "Mobile App Development", publication: "approved", visual: "mobile",
    description: "Digital experiences designed around the way people move. Explore mobile interfaces and application development." },
  { slug: "product-strategy", title: "Product Strategy", publication: "approved", visual: "strategy",
    description: "Give an idea a clear direction. Explore discovery, product definition and a considered path to delivery." },
  { slug: "brand-visual-design", title: "Brand & Visual Design", publication: "approved", visual: "brand",
    description: "A connected visual language across the product. Explore identity, typography and interface expression." },
];
