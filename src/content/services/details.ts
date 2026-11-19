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
    focus: "Thoughtful interface design engineered for clarity, usability, and user engagement.",
    intent: "User-centered digital interfaces, responsive design systems, and interactive prototypes built to solve real problems and clarify user workflows.",
    overview: "Effective digital products begin with a clear understanding of user needs and product requirements. We design cohesive, accessible interfaces that transform complex workflows into intuitive, structured experiences across desktop, tablet, and mobile devices.",
    highlights: [
      "Structured design systems in Figma with standardized design tokens and reusable component variants",
      "Interactive high-fidelity prototypes demonstrating user flows, state transitions, and responsive behavior",
      "Accessibility-conscious interface design aligned with WCAG principles, color contrast, and keyboard navigation",
      "Practical developer handoff documentation including responsive layout specifications and design tokens"
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
        description: "Structured workflow diagrams and information architecture mapping core user pathways to reduce interface friction."
      },
      {
        title: "High-Fidelity Wireframes",
        description: "Responsive screen layouts balancing clear visual hierarchy, content structure, and modern interface aesthetics."
      },
      {
        title: "Interactive Prototypes",
        description: "Clickable Figma prototypes simulating user journeys, component states, and responsive layout behavior."
      },
      {
        title: "Component Design Systems",
        description: "Organized Figma libraries with scalable typography scales, color roles, and reusable UI components."
      }
    ],
    approach: [
      ["Discover & Map", "Review product goals, target user journeys, and key functional requirements to establish a clear architectural starting point."],
      ["Design & Iterate", "Create wireframes and interactive prototypes, refining layouts, responsive states, and interface details through structured feedback."],
      ["Systematize & Hand Off", "Structure components into reusable design tokens and organized Figma files with practical developer handoff notes."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Discover & Map",
        description: "Review product goals, target user journeys, and key functional requirements to establish a clear architectural starting point."
      },
      {
        step: "02",
        title: "Design & Iterate",
        description: "Create wireframes and interactive prototypes, refining layouts, responsive states, and interface details through structured feedback."
      },
      {
        step: "03",
        title: "Systematize & Hand Off",
        description: "Structure components into reusable design tokens and organized Figma files with practical developer handoff notes."
      }
    ],
    questions: [
      ["What tools do you use for UI/UX design?", "We primarily design in Figma, utilizing modern auto-layout, components, and design variables to ensure design consistency and streamlined engineering handoff."],
      ["Can you design within an existing design system or brand guidelines?", "Yes. We frequently work within established brand guidelines and existing component libraries, standardizing patterns while preserving brand coherence."],
      ["What is included in the design handoff?", "Deliverables typically include structured Figma files, responsive layout specifications, component states, and exported assets agreed upon during project scoping."]
    ],
    faqs: [
      {
        question: "What tools do you use for UI/UX design?",
        answer: "We primarily design in Figma, utilizing modern auto-layout, components, and design variables to ensure design consistency and streamlined engineering handoff."
      },
      {
        question: "Can you design within an existing design system or brand guidelines?",
        answer: "Yes. We frequently work within established brand guidelines and existing component libraries, standardizing patterns while preserving brand coherence."
      },
      {
        question: "What is included in the design handoff?",
        answer: "Deliverables typically include structured Figma files, responsive layout specifications, component states, and exported assets agreed upon during project scoping."
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
    focus: "Full-stack web engineering built for reliability, performance, and maintainability.",
    intent: "Modern websites and web applications engineered with Next.js, React, TypeScript, PHP, and Laravel REST APIs.",
    overview: "We architect and build production-grade web applications that pair responsive front-end interfaces with secure, reliable back-end engineering. From modern Next.js client experiences to robust Laravel REST APIs, our code is modular, type-safe, and structured for long-term maintainability.",
    highlights: [
      "Production-grade Next.js App Router, React, and TypeScript web application engineering",
      "Robust backend engineering with PHP and Laravel for secure REST APIs, authentication, and data modeling",
      "Performance-conscious engineering with server-side rendering, efficient asset delivery, and responsive layouts",
      "Clean API client integrations connecting web interfaces with databases, headless services, and third-party platforms"
    ],
    deliverables: [
      "Next.js & React web applications",
      "Laravel backend & REST APIs",
      "Modular UI component systems",
      "Performance & technical SEO foundations"
    ],
    deliverableItems: [
      {
        title: "Next.js & React Web Applications",
        description: "Responsive, component-driven web applications built with TypeScript, modern state management, and clean architecture."
      },
      {
        title: "Laravel Backend & REST APIs",
        description: "Structured back-end services, secure database models, and RESTful API endpoints built with PHP and Laravel."
      },
      {
        title: "Modular UI Component Systems",
        description: "Maintainable, accessible interface components styled with modern CSS and Tailwind for consistent presentation across viewports."
      },
      {
        title: "Performance & Technical SEO Foundations",
        description: "Semantic HTML markup, optimized asset loading, dynamic metadata configuration, and search-friendly page structure."
      }
    ],
    approach: [
      ["Requirements & Stack Architecture", "Evaluate technical requirements, data models, and deployment targets to select the optimal frontend and backend structure."],
      ["Full-Stack Engineering", "Develop modular frontend components in Next.js alongside secure Laravel REST APIs, maintaining clear separation of concerns."],
      ["Testing, Optimization & Deployment", "Conduct cross-browser verification, test API endpoints, optimize asset loading, and configure production deployment pipelines."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Requirements & Stack Architecture",
        description: "Evaluate technical requirements, data models, and deployment targets to select the optimal frontend and backend structure."
      },
      {
        step: "02",
        title: "Full-Stack Engineering",
        description: "Develop modular frontend components in Next.js alongside secure Laravel REST APIs, maintaining clear separation of concerns."
      },
      {
        step: "03",
        title: "Testing, Optimization & Deployment",
        description: "Conduct cross-browser verification, test API endpoints, optimize asset loading, and configure production deployment pipelines."
      }
    ],
    questions: [
      ["What technologies do you use for web development?", "Our core stack includes TypeScript, React, and Next.js for frontend development, and PHP with Laravel for backend services and REST APIs, paired with modern database solutions."],
      ["Can you build both the frontend and backend of a web application?", "Yes. We deliver full-stack solutions combining Next.js user interfaces with Laravel API services, or integrate frontend applications with your existing backend infrastructure."],
      ["How do you approach performance and search visibility?", "We build with semantic HTML, server rendering where appropriate, optimized images, structured metadata, and clean routing to establish strong technical foundations."]
    ],
    faqs: [
      {
        question: "What technologies do you use for web development?",
        answer: "Our core stack includes TypeScript, React, and Next.js for frontend development, and PHP with Laravel for backend services and REST APIs, paired with modern database solutions."
      },
      {
        question: "Can you build both the frontend and backend of a web application?",
        answer: "Yes. We deliver full-stack solutions combining Next.js user interfaces with Laravel API services, or integrate frontend applications with your existing backend infrastructure."
      },
      {
        question: "How do you approach performance and search visibility?",
        answer: "We build with semantic HTML, server rendering where appropriate, optimized images, structured metadata, and clean routing to establish strong technical foundations."
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
    focus: "Cross-platform mobile applications engineered with Flutter and Dart.",
    intent: "Multi-platform iOS and Android applications built with Flutter and Dart, combining touch-optimized interfaces with clean architecture.",
    overview: "A well-crafted mobile application feels natural, responsive, and intuitive in daily use. We develop cross-platform mobile experiences with Flutter, delivering unified codebases for iOS and Android with consistent typography, fluid navigation, and reliable state management.",
    highlights: [
      "Cross-platform mobile engineering with Flutter and Dart from a single, maintainable codebase",
      "Touch-optimized user interfaces, responsive layouts, and platform-adaptive navigation patterns",
      "Structured state management, secure REST API integrations, and practical local caching capabilities",
      "Release-ready mobile build configuration, platform assets, and store submission packaging"
    ],
    deliverables: [
      "Cross-platform Flutter mobile applications",
      "Touch-optimized UI & navigation flows",
      "REST API integration & local data caching",
      "Store-ready build configuration bundles"
    ],
    deliverableItems: [
      {
        title: "Cross-Platform Flutter Applications",
        description: "Multi-platform mobile applications built with Flutter and Dart, delivering shared logic and native performance across iOS and Android."
      },
      {
        title: "Touch-Optimized UI & Navigation",
        description: "Mobile screen layouts, navigation transitions, bottom sheets, and custom UI components tailored for natural ergonomics."
      },
      {
        title: "REST API Integration & Local Caching",
        description: "Secure connectivity to backend services, structured client-side state management, and local storage configured to project specifications."
      },
      {
        title: "Store-Ready Build Configuration",
        description: "Platform configurations, application icons, splash screens, and production release bundles prepared for client store submission."
      }
    ],
    approach: [
      ["Platform Strategy & Flow Definition", "Map mobile user tasks to platform conventions, defining screen hierarchies, navigation flows, and required permissions."],
      ["Flutter Implementation & Integration", "Build modular, reusable UI widgets and application state management in Flutter, connecting screens to backend REST APIs."],
      ["Device Verification & Build Packaging", "Test across physical iOS and Android devices, refine UI responsiveness, and assemble release bundles for store deployment."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Platform Strategy & Flow Definition",
        description: "Map mobile user tasks to platform conventions, defining screen hierarchies, navigation flows, and required permissions."
      },
      {
        step: "02",
        title: "Flutter Implementation & Integration",
        description: "Build modular, reusable UI widgets and application state management in Flutter, connecting screens to backend REST APIs."
      },
      {
        step: "03",
        title: "Device Verification & Build Packaging",
        description: "Test across physical iOS and Android devices, refine UI responsiveness, and assemble release bundles for store deployment."
      }
    ],
    questions: [
      ["Why do you use Flutter for mobile app development?", "Flutter and Dart enable us to build high-performance applications for both iOS and Android from a single codebase, reducing development time while maintaining visual and functional consistency."],
      ["Can the mobile application function with limited connectivity?", "Where required by project scope, we implement local data persistence and caching strategies so users can access key information during intermittent network availability."],
      ["Do you handle App Store and Google Play submissions?", "We prepare release-ready application packages, generate required metadata assets, and guide your team through the store submission process using your developer accounts."]
    ],
    faqs: [
      {
        question: "Why do you use Flutter for mobile app development?",
        answer: "Flutter and Dart enable us to build high-performance applications for both iOS and Android from a single codebase, reducing development time while maintaining visual and functional consistency."
      },
      {
        question: "Can the mobile application function with limited connectivity?",
        answer: "Where required by project scope, we implement local data persistence and caching strategies so users can access key information during intermittent network availability."
      },
      {
        question: "Do you handle App Store and Google Play submissions?",
        answer: "We prepare release-ready application packages, generate required metadata assets, and guide your team through the store submission process using your developer accounts."
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
    intent: "Structured product discovery, feature prioritization, and roadmap planning to define clear, feasible paths from concept to delivery.",
    overview: "Every successful digital product begins with focused strategic intent. We help founders and teams clarify product requirements, evaluate technical feasibility, and prioritize feature sets so design and engineering proceed with clarity and confidence.",
    highlights: [
      "Structured product discovery and requirement analysis aligned with business objectives",
      "Systematic feature prioritization separating essential MVP scope from future enhancements",
      "Technical feasibility assessments identifying architectural considerations early in the process",
      "Staged delivery roadmaps connecting product milestones to practical development phases"
    ],
    deliverables: [
      "Product scope & requirements brief",
      "Feature prioritization matrix",
      "User flow & opportunity architecture",
      "Phased release milestone roadmap"
    ],
    deliverableItems: [
      {
        title: "Product Scope & Requirements Brief",
        description: "A structured document detailing core user journeys, technical assumptions, and primary functional requirements."
      },
      {
        title: "Feature Prioritization Matrix",
        description: "An objective evaluation separating essential launch features (MVP) from subsequent phase enhancements."
      },
      {
        title: "User Flow & Opportunity Architecture",
        description: "Diagrams mapping primary user pathways and highlighting critical interface interaction points."
      },
      {
        title: "Phased Release Milestone Roadmap",
        description: "A staged milestone plan connecting initial delivery priorities to scalable engineering iterations."
      }
    ],
    approach: [
      ["Discover & Clarify", "Review project goals, technical constraints, and available audience insights to define the problem space and core objectives."],
      ["Evaluate & Prioritize", "Assess feature concepts against user value and technical feasibility, defining a focused, achievable launch scope."],
      ["Synthesize & Roadmap", "Synthesize findings into an actionable requirements brief and phased delivery roadmap ready to guide design and engineering."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Discover & Clarify",
        description: "Review project goals, technical constraints, and available audience insights to define the problem space and core objectives."
      },
      {
        step: "02",
        title: "Evaluate & Prioritize",
        description: "Assess feature concepts against user value and technical feasibility, defining a focused, achievable launch scope."
      },
      {
        step: "03",
        title: "Synthesize & Roadmap",
        description: "Synthesize findings into an actionable requirements brief and phased delivery roadmap ready to guide design and engineering."
      }
    ],
    questions: [
      ["When should a team engage in product strategy?", "Product strategy is most effective before design or engineering begins, helping prevent scope creep and aligning technical priorities early."],
      ["How long does a product strategy engagement typically take?", "Engagement duration depends on project scope, domain complexity, and existing documentation. Strategic scoping is tailored during initial consultations to match your timeline."],
      ["How do strategy deliverables inform design and development?", "Strategy deliverables establish the functional requirements, user flows, and technical parameters that directly guide Figma wireframing and sprint backlogs."]
    ],
    faqs: [
      {
        question: "When should a team engage in product strategy?",
        answer: "Product strategy is most effective before design or engineering begins, helping prevent scope creep and aligning technical priorities early."
      },
      {
        question: "How long does a product strategy engagement typically take?",
        answer: "Engagement duration depends on project scope, domain complexity, and existing documentation. Strategic scoping is tailored during initial consultations to match your timeline."
      },
      {
        question: "How do strategy deliverables inform design and development?",
        answer: "Strategy deliverables establish the functional requirements, user flows, and technical parameters that directly guide Figma wireframing and sprint backlogs."
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
    focus: "A cohesive visual identity system built for clarity, consistency, and digital recognition.",
    intent: "Practical brand identity systems, typography guidelines, and digital visual assets tailored for websites and applications.",
    overview: "A strong visual identity brings coherence to digital products. We develop practical visual systems—aligning typography, color roles, spacing principles, and interface assets—that establish professional credibility across digital platforms.",
    highlights: [
      "Digital-first color palettes with accessible contrast pairings and interface theme roles",
      "Calibrated typographic hierarchies optimized for legibility across web and mobile viewports",
      "Consistent visual identity guidelines bridging brand expression with interface design tokens",
      "Production-ready vector marks, icon assets, and digital brand templates"
    ],
    deliverables: [
      "Brand identity guidelines & rules",
      "Digital color palette & system tokens",
      "Typographic hierarchy specifications",
      "Digital asset & vector icon library"
    ],
    deliverableItems: [
      {
        title: "Brand Identity Guidelines",
        description: "Core identity rules defining logo usage, clear space, brand marks, and visual consistency principles across touchpoints."
      },
      {
        title: "Digital Color Palette & System Tokens",
        description: "Structured color architectures including primary shades, neutral backgrounds, accent colors, and contrast rules."
      },
      {
        title: "Typographic Hierarchy Specifications",
        description: "Curated web and mobile font pairings, weight scales, line heights, and responsive type rules."
      },
      {
        title: "Digital Asset & Vector Icon Library",
        description: "Production-ready SVG brand marks, favicon assets, social preview graphics, and essential interface icons."
      }
    ],
    approach: [
      ["Identity Audit & Visual Direction", "Review brand positioning, audience expectations, and digital touchpoints to explore appropriate visual directions."],
      ["System Design & Interface Application", "Develop typography scales, color roles, and graphic marks, testing their legibility across realistic interface contexts."],
      ["Documentation & Asset Delivery", "Document identity usage rules and compile master vector source assets and design tokens for engineering handoff."]
    ],
    approachSteps: [
      {
        step: "01",
        title: "Identity Audit & Visual Direction",
        description: "Review brand positioning, audience expectations, and digital touchpoints to explore appropriate visual directions."
      },
      {
        step: "02",
        title: "System Design & Interface Application",
        description: "Develop typography scales, color roles, and graphic marks, testing their legibility across realistic interface contexts."
      },
      {
        step: "03",
        title: "Documentation & Asset Delivery",
        description: "Document identity usage rules and compile master vector source assets and design tokens for engineering handoff."
      }
    ],
    questions: [
      ["Do you design new brand identities or refine existing ones?", "We can design new digital brand identities from foundational principles or modernize and systematize existing assets for web and mobile applications."],
      ["Do you offer specialized print production and physical color matching?", "Our focus is digital product design and digital-first branding. While we provide standard color values (such as HEX and RGB) and export formats suitable for digital use, specialized physical print production and Pantone ink matching are outside our core scope."],
      ["How are brand assets prepared for development?", "We supply clean vector SVG files, export-ready graphics, and documented CSS variables/design tokens so engineering teams can implement brand styles directly in code."]
    ],
    faqs: [
      {
        question: "Do you design new brand identities or refine existing ones?",
        answer: "We can design new digital brand identities from foundational principles or modernize and systematize existing assets for web and mobile applications."
      },
      {
        question: "Do you offer specialized print production and physical color matching?",
        answer: "Our focus is digital product design and digital-first branding. While we provide standard color values (such as HEX and RGB) and export formats suitable for digital use, specialized physical print production and Pantone ink matching are outside our core scope."
      },
      {
        question: "How are brand assets prepared for development?",
        answer: "We supply clean vector SVG files, export-ready graphics, and documented CSS variables/design tokens so engineering teams can implement brand styles directly in code."
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
