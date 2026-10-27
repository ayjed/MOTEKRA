export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarSrc: string;
  projectSlug?: string;
}

export const testimonialsRow1: readonly Testimonial[] = [
  {
    id: "feedback-kemi",
    author: "Kemi Adebayo",
    role: "Product Lead",
    company: "Spotlight Contest",
    quote: "MOTEKRA engineered our contest platform into an ultra-responsive, resilient digital product. Page latency dropped significantly, and the platform maintained 100% uptime during peak voting periods.",
    rating: 5,
    avatarSrc: "/assets/testimonials/kemi.jpg",
    projectSlug: "spotlight-contest"
  },
  {
    id: "feedback-david",
    author: "David O'Connor",
    role: "VP of Engineering",
    company: "ConnectAPI",
    quote: "The depth of technical discipline MOTEKRA brought to ConnectAPI was extraordinary. Clean TypeScript architecture, scalable API integrations, and an uncompromising standard of UI performance.",
    rating: 5,
    avatarSrc: "/assets/testimonials/david.jpg",
    projectSlug: "connectapi"
  },
  {
    id: "feedback-tariq",
    author: "Tariq Al-Mansoor",
    role: "Director of Digital Mobility",
    company: "LAD Global Travels",
    quote: "From the booking flow to tour search, MOTEKRA elevated LAD Global Travels into a world-class platform. Our travelers immediately praised the speed and effortless navigation.",
    rating: 5,
    avatarSrc: "/assets/testimonials/tariq.jpg",
    projectSlug: "lad-global-travels"
  },
  {
    id: "feedback-elena",
    author: "Elena Rostova",
    role: "Design Systems Lead",
    company: "Stratum Technologies",
    quote: "MOTEKRA bridges design vision and frontend execution seamlessly. Micro-interactions feel natural, animations feel intentional, and the underlying code is remarkably maintainable.",
    rating: 5,
    avatarSrc: "/assets/testimonials/elena.jpg"
  }
];

export const testimonialsRow2: readonly Testimonial[] = [
  {
    id: "feedback-chidi",
    author: "Chidi Eze",
    role: "Managing Director",
    company: "TOG Africa",
    quote: "MOTEKRA understood our vision for a connected Africa from day one. The digital experience balances aesthetic sophistication with remarkable engineering speed across diverse network speeds.",
    rating: 5,
    avatarSrc: "/assets/testimonials/chidi.jpg",
    projectSlug: "tog-africa"
  },
  {
    id: "feedback-marcus",
    author: "Marcus Vance",
    role: "Founder & CEO",
    company: "Pulse Health Labs",
    quote: "The velocity and code quality delivered by MOTEKRA set a new benchmark for our team. Zero technical debt, responsive design that works flawlessly on every device, and genuine creative collaboration.",
    rating: 5,
    avatarSrc: "/assets/testimonials/marcus.jpg"
  },
  {
    id: "feedback-sophie",
    author: "Sophie Martin",
    role: "Head of Product",
    company: "Vantage Analytics",
    quote: "In an era of generic web templates, MOTEKRA stands apart. Every layout, typography decision, and interaction is bespoke, art-directed, and engineered for high-performance scale.",
    rating: 5,
    avatarSrc: "/assets/testimonials/sophie.jpg"
  },
  {
    id: "feedback-adeola",
    author: "Adeola Bakare",
    role: "Operations Director",
    company: "Nexus Cloud Infrastructure",
    quote: "MOTEKRA delivered our platform on schedule with zero compromises on quality. Their mastery of modern full-stack performance made them an invaluable technology partner.",
    rating: 5,
    avatarSrc: "/assets/testimonials/adeola.jpg"
  }
];
