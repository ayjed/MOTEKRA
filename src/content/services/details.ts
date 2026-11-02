export interface DeliverableItem {
  title: string;
  description: string;
}

export interface ApproachStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetailCopy {
  focus: string;
  intent: string;
  overview: string;
  highlights: readonly string[];
  deliverables: readonly string[];
  deliverableItems: readonly DeliverableItem[];
  approach: readonly (readonly [string, string])[];
  approachSteps: readonly ApproachStep[];
  questions: readonly (readonly [string, string])[];
  faqs: readonly ServiceFaq[];
  image: {
    src: string;
    alt: string;
    tag?: string;
  };
  control: string;
  outcome: string;
}

export const serviceDetails: Readonly<Record<string, ServiceDetailCopy>> = {
  "ui-ux-design": {
    focus: "Intuitive product design engineered for clarity, usability, and conversion.",
    intent: "User-centred digital interfaces, responsive design systems, and interactive prototypes built to solve real problems and elevate user engagement.",
    overview: "Great digital products begin with a deep understanding of user behavior and business objectives. We design cohesive, accessible interfaces that transform complex workflows into frictionless, intuitive experiences across desktop, tablet, and mobile devices.",
    highlights: [
      "End-to-end design systems in Figma with standardized design tokens and variables",
      "Interactive high-fidelity prototypes demonstrating real transitions and microinteractions",
      "WCAG AA accessibility compliance with deliberate color contrast and keyboard navigation",
      "Comprehensive developer handoff documentation with responsive layout specifications"
    ],
    deliverables: [
      "User journey mapping & task flows",
      "High-fidelity wireframes & layouts",
      "Interactive Figma prototypes",
      "Component design systems & tokens"
    ],
    deliverableItems: [
      {
        title: "User Journey & Task Flows",
        description: "Detailed workflow diagrams and information architecture mapping every core user journey to eliminate friction."
      },
      {
        title: "High-Fidelity Wireframes",
        description: "Responsive screen layouts balancing visual hierarchy, usability standards, and modern interface aesthetics."
      },
      {
        title: "Interactive Prototypes",
        description: "Clickable prototypes simulating real product interactions, state transitions, and responsive mobile behavior."
      },
      {
        title: "Component Design Systems",
        description: "Comprehensive Figma libraries with scalable typography tokens, color roles, and reusable UI components."
      }
    ],
    approach: [
      ["Discover & Map", "We analyze your product vision, target audience, and key user tasks to establish a clear architectural foundation."],
      ["Design & Iterate", "We build wireframes and interactive prototypes, refining layouts and motion through continuous collaboration."],
      ["Systematize & Hand Off", "We organize components into a scalable design system with comprehensive documentation for engineering handoff."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Discover & Map",
        description: "We analyze your product vision, target audience, and key user tasks to establish a clear architectural foundation."
      },
      {
        step: "02",
        title: "Design & Iterate",
        description: "We build wireframes and interactive prototypes, refining layouts and motion through continuous collaboration."
      },
      {
        step: "03",
        title: "Systematize & Hand Off",
        description: "We organize components into a scalable design system with comprehensive documentation for engineering handoff."
      }
    ],
    questions: [
      ["What tools do you use for UI/UX design?", "We primarily design in Figma, utilizing modern auto-layout, variables, and component properties for seamless team collaboration and developer handoff."],
      ["Can you design for existing applications or brand guidelines?", "Yes. We frequently integrate with established brand guidelines and legacy design systems, modernizing patterns while maintaining brand consistency."],
      ["Do you provide developer-ready assets and design specifications?", "Every UI/UX engagement includes complete design tokens, responsive layout rules, interaction notes, and asset exports ready for development."]
    ],
    faqs: [
      {
        question: "What tools do you use for UI/UX design?",
        answer: "We primarily design in Figma, utilizing modern auto-layout, variables, and component properties for seamless team collaboration and developer handoff."
      },
      {
        question: "Can you design for existing applications or brand guidelines?",
        answer: "Yes. We frequently integrate with established brand guidelines and legacy design systems, modernizing patterns while maintaining brand consistency."
      },
      {
        question: "Do you provide developer-ready assets and design specifications?",
        answer: "Every UI/UX engagement includes complete design tokens, responsive layout rules, interaction notes, and asset exports ready for development."
      }
    ],
    image: {
      src: "/assets/services/ui-ux-design.webp",
      alt: "Responsive laptop and smartphone mockup displaying modern e-commerce dashboard and mobile shopping interface on a clean white background",
      tag: "FIGMA WORKSPACE & DESIGN SYSTEM"
    },
    control: "Transform the interface",
    outcome: "Wireframe → composed interface. High-fidelity responsive design system."
  },

  "web-development": {
    focus: "Modern web engineering built for speed, scalability, and resilience.",
    intent: "High-performance websites and web applications engineered with Next.js, modern TypeScript, and scalable cloud architectures.",
    overview: "We architect and build production-grade web applications that pair fluid front-end experiences with secure, robust back-end integrations. From fast marketing platforms to data-dense dashboards, our code is modular, type-safe, and optimized for performance.",
    highlights: [
      "Production-grade Next.js App Router, React 19, and TypeScript architectures",
      "Sub-second Core Web Vitals with optimized server-side rendering and edge caching",
      "Responsive, accessible HTML structures following modern web accessibility standards",
      "Clean API integrations with headless CMS platforms, databases, and third-party services"
    ],
    deliverables: [
      "Production-ready Next.js web applications",
      "Modular Tailwind CSS component systems",
      "Secure API & database integrations",
      "Core Web Vitals & SEO optimization"
    ],
    deliverableItems: [
      {
        title: "Production-Ready Web Applications",
        description: "Fully responsive, cross-browser web applications built with type-safe modern frameworks and clean architecture."
      },
      {
        title: "Design System Implementation",
        description: "Modular, accessible component libraries utilizing Tailwind CSS and CSS custom properties for effortless scale."
      },
      {
        title: "API & Database Integrations",
        description: "Secure RESTful and GraphQL endpoints connected to scalable databases, authentication providers, and services."
      },
      {
        title: "Performance & SEO Optimization",
        description: "Fast page load speeds, semantic HTML structure, dynamic Open Graph metadata, and automated build pipelines."
      }
    ],
    approach: [
      ["Architecture & Stack Selection", "We evaluate technical requirements, data models, and deployment targets to select the optimal stack."],
      ["Component Engineering", "We develop modular, testable UI components with fluid responsive behavior and accessible interaction states."],
      ["Testing, Deployment & Handoff", "We conduct cross-browser QA, optimize performance metrics, configure CI/CD pipelines, and provide complete documentation."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Architecture & Stack Selection",
        description: "We evaluate technical requirements, data models, and deployment targets to select the optimal stack."
      },
      {
        step: "02",
        title: "Component Engineering",
        description: "We develop modular, testable UI components with fluid responsive behavior and accessible interaction states."
      },
      {
        step: "03",
        title: "Testing, Deployment & Handoff",
        description: "We conduct cross-browser QA, optimize performance metrics, configure CI/CD pipelines, and provide complete documentation."
      }
    ],
    questions: [
      ["What tech stack do you recommend for modern web development?", "We specialize in Next.js, React, TypeScript, and modern CSS/Tailwind, deployed on edge infrastructure like Vercel, AWS, or custom cloud providers."],
      ["How do you ensure web accessibility and performance?", "We adhere strictly to semantic HTML, keyboard navigation standards, ARIA specifications, and Core Web Vitals optimization for instant loading."],
      ["Can you connect to our existing back-end APIs or headless CMS?", "Yes. We build clean API client abstractions that integrate seamlessly with REST APIs, GraphQL services, headless CMS platforms, and databases."]
    ],
    faqs: [
      {
        question: "What tech stack do you recommend for modern web development?",
        answer: "We specialize in Next.js, React, TypeScript, and modern CSS/Tailwind, deployed on edge infrastructure like Vercel, AWS, or custom cloud providers."
      },
      {
        question: "How do you ensure web accessibility and performance?",
        answer: "We adhere strictly to semantic HTML, keyboard navigation standards, ARIA specifications, and Core Web Vitals optimization for instant loading."
      },
      {
        question: "Can you connect to our existing back-end APIs or headless CMS?",
        answer: "Yes. We build clean API client abstractions that integrate seamlessly with REST APIs, GraphQL services, headless CMS platforms, and databases."
      }
    ],
    image: {
      src: "/assets/services/web-development.webp",
      alt: "Responsive laptop and smartphone mockup displaying Nexora website interface and mobile application on a clean white background",
      tag: "NEXT.JS & CLOUD ARCHITECTURE"
    },
    control: "Reframe the app windows",
    outcome: "Wide application → compact workspace. Responsive composition."
  },

  "mobile-app-development": {
    focus: "Native and cross-platform mobile products tailored for modern mobility.",
    intent: "Intuitive iOS and Android applications engineered for fluid performance, touch-optimized interactions, and reliable offline capabilities.",
    overview: "A successful mobile application must feel immediate and natural in the palm of a hand. We build responsive mobile experiences with crisp typography, smooth gesture navigation, and robust state management that keep users connected anywhere.",
    highlights: [
      "Cross-platform engineering with Flutter and React Native for unified iOS and Android codebases",
      "Fluid 60fps animations, native gesture handling, and responsive haptic feedback",
      "Offline data synchronization, secure local storage, and reliable background processing",
      "Complete app store readiness with automated build artifacts and signing configurations"
    ],
    deliverables: [
      "Cross-platform iOS & Android mobile apps",
      "Touch-optimized UI & motion systems",
      "Offline data caching & sync pipelines",
      "App Store & Google Play release bundles"
    ],
    deliverableItems: [
      {
        title: "Cross-Platform Mobile Apps",
        description: "Native-compiled iOS and Android applications delivering high-performance touch experiences from a single codebase."
      },
      {
        title: "Interactive UI & Motion Systems",
        description: "Platform-specific navigation flows, bottom sheets, microinteractions, and gesture-driven animations."
      },
      {
        title: "Offline & Sync Architecture",
        description: "Resilient client-side caching, local data persistence, and automatic server synchronization when online."
      },
      {
        title: "App Store Readiness Checklist",
        description: "Complete build configurations, privacy manifests, signing certificates, and release-ready store bundles."
      }
    ],
    approach: [
      ["Platform Strategy & Flow Definition", "We map core user tasks to native mobile ergonomics, defining navigation hierarchies and permission requirements."],
      ["Cross-Platform Implementation", "We engineer modular, reusable UI components backed by robust state management and type safety."],
      ["Device Testing & Release Preparation", "We test across physical iOS and Android devices, fine-tune performance, and configure production builds for store deployment."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Platform Strategy & Flow Definition",
        description: "We map core user tasks to native mobile ergonomics, defining navigation hierarchies and permission requirements."
      },
      {
        step: "02",
        title: "Cross-Platform Implementation",
        description: "We engineer modular, reusable UI components backed by robust state management and type safety."
      },
      {
        step: "03",
        title: "Device Testing & Release Preparation",
        description: "We test across physical iOS and Android devices, fine-tune performance, and configure production builds for store deployment."
      }
    ],
    questions: [
      ["Do you build native or cross-platform mobile apps?", "We primarily build with modern cross-platform frameworks like Flutter or React Native to deliver 60fps native performance from a single maintainable codebase."],
      ["Can the mobile app work offline?", "Yes. We implement robust local data stores and sync adapters that allow users to view content and queue actions when network connectivity is lost."],
      ["Do you handle App Store and Google Play submissions?", "We prepare release bundles, configure store assets, write release notes, and guide you through the developer account submission guidelines."]
    ],
    faqs: [
      {
        question: "Do you build native or cross-platform mobile apps?",
        answer: "We primarily build with modern cross-platform frameworks like Flutter or React Native to deliver 60fps native performance from a single maintainable codebase."
      },
      {
        question: "Can the mobile app work offline?",
        answer: "Yes. We implement robust local data stores and sync adapters that allow users to view content and queue actions when network connectivity is lost."
      },
      {
        question: "Do you handle App Store and Google Play submissions?",
        answer: "We prepare release bundles, configure store assets, write release notes, and guide you through the developer account submission guidelines."
      }
    ],
    image: {
      src: "/assets/services/mobile-app-development.webp",
      alt: "Realistic smartphone mockups displaying modern mobile application analytics and user transactions",
      tag: "IOS & ANDROID APPLICATION"
    },
    control: "Explore the mobile flow",
    outcome: "Explore → detail. Mobile screen flow."
  },

  "product-strategy": {
    focus: "Clear product definition and actionable decision paths before engineering.",
    intent: "Strategic product definition, user research synthesis, and roadmap planning to turn ambitious concepts into validated digital solutions.",
    overview: "Every successful digital product begins with focused strategic intent. We help visionary founders and executive teams dissect complex problem spaces, prioritize high-impact feature sets, and align technical architecture with long-term business goals.",
    highlights: [
      "Systematic feature prioritization using impact-vs-effort matrices and MVP roadmaps",
      "User journey mapping and opportunity identification based on authentic user feedback",
      "Technical feasibility assessments and staging recommendations to minimize launch risk",
      "Clear milestone roadmaps connecting business goals with practical development sprints"
    ],
    deliverables: [
      "Product requirements & scope brief",
      "Feature prioritization matrix",
      "User journey & opportunity maps",
      "Phased release milestone roadmap"
    ],
    deliverableItems: [
      {
        title: "Product Requirements & Scope Brief",
        description: "A concise, actionable specification defining target user personas, core capabilities, and success metrics."
      },
      {
        title: "Feature Prioritization Matrix",
        description: "Clear separation of MVP core requirements (P0), immediate enhancements (P1), and future roadmap candidates."
      },
      {
        title: "User Journey & Opportunity Maps",
        description: "Visual mapping of user pain points, emotional highs, and strategic interface intervention points."
      },
      {
        title: "Phased Release Roadmap",
        description: "A structured milestone plan connecting early validation milestones to scalable engineering delivery."
      }
    ],
    approach: [
      ["Frame & Discover", "We analyze your market context, user feedback, and technical constraints to surface critical assumptions and opportunities."],
      ["Evaluate & Prioritize", "We assess feature concepts against business value and technical feasibility, establishing a razor-sharp MVP definition."],
      ["Synthesize & Blueprint", "We deliver a comprehensive product strategy roadmap and execution brief ready to guide design and engineering."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Frame & Discover",
        description: "We analyze your market context, user feedback, and technical constraints to surface critical assumptions and opportunities."
      },
      {
        step: "02",
        title: "Evaluate & Prioritize",
        description: "We assess feature concepts against business value and technical feasibility, establishing a razor-sharp MVP definition."
      },
      {
        step: "03",
        title: "Synthesize & Blueprint",
        description: "We deliver a comprehensive product strategy roadmap and execution brief ready to guide design and engineering."
      }
    ],
    questions: [
      ["Can product strategy be conducted before design or development begins?", "Yes. Strategic scoping prior to implementation prevents costly revisions, ensures team alignment, and accelerates time-to-market."],
      ["What is the typical timeline for a product strategy engagement?", "Most strategy sprints run between one to three weeks, depending on the complexity of the domain and the depth of user research required."],
      ["How does the strategy deliverable translate into design and engineering?", "We provide structured feature matrices, user stories, and technical requirements that directly feed into Figma wireframes and development sprint backlogs."]
    ],
    faqs: [
      {
        question: "Can product strategy be conducted before design or development begins?",
        answer: "Yes. Strategic scoping prior to implementation prevents costly revisions, ensures team alignment, and accelerates time-to-market."
      },
      {
        question: "What is the typical timeline for a product strategy engagement?",
        answer: "Most strategy sprints run between one to three weeks, depending on the complexity of the domain and the depth of user research required."
      },
      {
        question: "How does the strategy deliverable translate into design and engineering?",
        answer: "We provide structured feature matrices, user stories, and technical requirements that directly feed into Figma wireframes and development sprint backlogs."
      }
    ],
    image: {
      src: "/assets/services/product-strategy.webp",
      alt: "Product strategy and analytics dashboard showing metrics, charts, and planning workflow",
      tag: "DISCOVERY & PRODUCT DEFINITION"
    },
    control: "Organize the roadmap",
    outcome: "Open questions → staged priorities. Strategic roadmap."
  },

  "brand-visual-design": {
    focus: "A unified visual language that builds trust, recognition, and product authority.",
    intent: "Distinctive brand identities, scalable design systems, and cohesive visual languages tailored for modern digital products.",
    overview: "Brand identity extends far beyond a standalone logo. We craft comprehensive visual systems—harmonizing typography, color palettes, spacing principles, and interface components—that communicate craft, authority, and purpose across every touchpoint.",
    highlights: [
      "Cohesive color palettes with accessible contrast ratios and dynamic light/dark support",
      "Typographic hierarchies calibrated for readability across web and mobile viewports",
      "Scalable design tokens and component guidelines that bridge brand and software engineering",
      "Production-ready digital stationery, social templates, and vector iconography"
    ],
    deliverables: [
      "Brand identity guidelines & system rules",
      "Color palette & design system tokens",
      "Typographic hierarchy specifications",
      "Digital asset & vector icon library"
    ],
    deliverableItems: [
      {
        title: "Brand Identity Guidelines",
        description: "Comprehensive guidelines defining logo usage, clear space, brand voice, and visual do's and don'ts."
      },
      {
        title: "Color Palette & System Tokens",
        description: "Systematic color architectures including primary brand shades, neutral surfaces, accents, and accessible pairings."
      },
      {
        title: "Typographic Hierarchy Spec",
        description: "Carefully curated web and app font pairings, weight scales, line heights, and responsive type rules."
      },
      {
        title: "Digital Asset & Icon Library",
        description: "Vector brand marks, iconography sets, social preview templates, and production-ready SVG assets."
      }
    ],
    approach: [
      ["Identity Audit & Direction", "We review your brand position, market differentiation, and audience expectations to explore visual directions."],
      ["System Design & Testing", "We establish typographic scales, color roles, and graphic elements, testing them across real digital interface contexts."],
      ["Documentation & Asset Handoff", "We compile the complete brand system into an accessible digital guide with master vector source assets."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Identity Audit & Direction",
        description: "We review your brand position, market differentiation, and audience expectations to explore visual directions."
      },
      {
        step: "02",
        title: "System Design & Testing",
        description: "We establish typographic scales, color roles, and graphic elements, testing them across real digital interface contexts."
      },
      {
        step: "03",
        title: "Documentation & Asset Handoff",
        description: "We compile the complete brand system into an accessible digital guide with master vector source assets."
      }
    ],
    questions: [
      ["Do you create new brand identities or refine existing ones?", "We do both. We can design a brand identity from the ground up or modernize and systematize an existing identity for digital applications."],
      ["Will the brand guidelines work across both print and digital platforms?", "Yes. While our primary focus is high-performance digital products, our guidelines specify color conversions (RGB, CMYK, Pantone) and print rules."],
      ["How do you ensure brand consistency across our engineering team?", "We deliver brand specifications directly as design tokens (CSS variables, Figma styles, JSON exports) that developers can consume directly in code."]
    ],
    faqs: [
      {
        question: "Do you create new brand identities or refine existing ones?",
        answer: "We do both. We can design a brand identity from the ground up or modernize and systematize an existing identity for digital applications."
      },
      {
        question: "Will the brand guidelines work across both print and digital platforms?",
        answer: "Yes. While our primary focus is high-performance digital products, our guidelines specify color conversions (RGB, CMYK, Pantone) and print rules."
      },
      {
        question: "How do you ensure brand consistency across our engineering team?",
        answer: "We deliver brand specifications directly as design tokens (CSS variables, Figma styles, JSON exports) that developers can consume directly in code."
      }
    ],
    image: {
      src: "/assets/services/brand-visual-design.webp",
      alt: "Brand identity design system showcase with color palette, typography specimens, and digital stationery",
      tag: "VISUAL SYSTEM & DESIGN TOKENS"
    },
    control: "Compose the brand system",
    outcome: "Separate elements → one visual system. MOTEKRA brand identity."
  }
};
