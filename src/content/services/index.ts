import type { Service } from "../models";

// Editorial descriptions of proposed scope, not confirmed commercial promises.
export const services: readonly Service[] = [
  { slug: "ui-ux-design", title: "UI/UX Design", publication: "draft", visual: "design",
    description: "From first sketch to a clear, considered interface. Explore product flows, prototypes and visual systems." },
  { slug: "web-development", title: "Web Development", publication: "draft", visual: "web",
    description: "Thoughtful interfaces, brought to the browser. Explore accessible websites and purposeful web applications." },
  { slug: "mobile-app-development", title: "Mobile App Development", publication: "draft", visual: "mobile",
    description: "Digital experiences designed around the way people move. Explore mobile interfaces and application development." },
  { slug: "product-strategy", title: "Product Strategy", publication: "draft", visual: "strategy",
    description: "Give an idea a clear direction. Explore discovery, product definition and a considered path to delivery." },
  { slug: "brand-visual-design", title: "Brand & Visual Design", publication: "draft", visual: "brand",
    description: "A connected visual language across the product. Explore identity, typography and interface expression." },
];
