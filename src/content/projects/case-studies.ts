export interface CaseStudyCapability {
  title: string;
  description: string;
}

export interface CaseStudyImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  bg: string;
}

export interface CaseStudyItem {
  slug: string;
  title: string;
  category: string;
  badge: string;
  type: string;
  focus: string;
  lead: string;
  overview: string;
  scopeNote?: string;
  capabilitiesTitle: string;
  capabilities: readonly CaseStudyCapability[];
  heroImage: CaseStudyImage;
  detailImage: CaseStudyImage;
  galleryHeading: string;
  galleryDescription: string;
}

export const caseStudies: Readonly<Record<string, CaseStudyItem>> = {
  "spotlight-contest": {
    slug: "spotlight-contest",
    title: "Spotlight Contest",
    category: "Web Application",
    badge: "Web Application",
    type: "Interactive Platform",
    focus: "Talent & Competition Discovery",
    lead: "A digital competition and talent discovery platform designed to connect creators, voters, and event organizers through an engaging interactive interface.",
    overview: "Spotlight Contest provides an intuitive digital stage for creative talent competitions. The platform architecture prioritizes clear contest discovery, transparent public voting, and streamlined submission flows, enabling participants to showcase their work while giving event organizers full control over competition administration.",
    capabilitiesTitle: "Platform Capabilities",
    capabilities: [
      {
        title: "Contest Discovery & Filtering",
        description: "Browse active, upcoming, and past competitions with category-based filtering and status tracking.",
      },
      {
        title: "Participant Submission Workflows",
        description: "Streamlined multi-step entry submission process allowing creators to submit profiles, media, and entry descriptions.",
      },
      {
        title: "Public Engagement & Voting",
        description: "Direct voting interfaces engineered to ensure transparent participation, verified entries, and live vote counting.",
      },
      {
        title: "Organizer Portal & Administration",
        description: "Dedicated management interfaces for contest rules, submission deadlines, judging criteria, and participant moderation.",
      },
    ],
    heroImage: {
      src: "/assets/work/spotlight-contest-hero.webp",
      width: 1400,
      height: 867,
      alt: "Spotlight Contest platform landing screen showing active contests, participation steps, and featured competitions",
      caption: "Landing interface: contest discovery, active categories, and entry participation guidelines.",
      bg: "#08152b",
    },
    detailImage: {
      src: "/assets/work/spotlight-contest-detail.webp",
      width: 1400,
      height: 841,
      alt: "Spotlight Contest voting interface and participant submission cards",
      caption: "Contest directory view: participant listings, category navigation, and voting actions.",
      bg: "#08152b",
    },
    galleryHeading: "Contest Directory & Voting Experience",
    galleryDescription: "The secondary interface view showcases the participant exploration grid, where voters can inspect contestant submissions, explore categories, and submit votes.",
  },

  "lad-global-travels": {
    slug: "lad-global-travels",
    title: "LAD Global Travels",
    category: "Travel & Mobility",
    badge: "Travel & Mobility",
    type: "Flight & Tour Services",
    focus: "Global Mobility & Holiday Bookings",
    lead: "A full-service travel and mobility platform engineered to simplify international flight bookings, curated holiday packages, and visa advisory services.",
    overview: "LAD Global Travels combines high-impact visual destination storytelling with practical travel coordination tools. The interface is tailored for both holidaymakers and corporate travelers, presenting flight schedules, custom tour itineraries, and visa consultancy services within a clean, trustworthy digital environment.",
    capabilitiesTitle: "Service Offerings",
    capabilities: [
      {
        title: "Curated Holiday & Tour Packages",
        description: "Explore tailored travel itineraries across popular international destinations with transparent pricing and itinerary highlights.",
      },
      {
        title: "Flight Search & Reservation Inquiries",
        description: "Interactive flight route exploration connecting major domestic and international hubs with direct inquiry workflows.",
      },
      {
        title: "Visa Advisory & Support",
        description: "Structured visa consultation portal providing country-specific requirements, document checklists, and submission guidance.",
      },
      {
        title: "Responsive Mobile Experience",
        description: "Fully responsive interface enabling travelers on the move to browse itineraries and contact travel consultants seamlessly.",
      },
    ],
    heroImage: {
      src: "/assets/work/lad-global-travels-hero.webp",
      width: 1400,
      height: 725,
      alt: "LAD Global Travels website hero with aircraft imagery and flight reservation booking interface",
      caption: "Homepage hero: aircraft visual direction, destination highlights, and quick travel consultation entry.",
      bg: "#0a182e",
    },
    detailImage: {
      src: "/assets/work/lad-global-travels-detail.webp",
      width: 1400,
      height: 852,
      alt: "LAD Global Travels tour packages, mobility service cards, and visa inquiry interface",
      caption: "Service catalog view: curated holiday packages, mobility options, and dedicated visa advisory contact modules.",
      bg: "#0a182e",
    },
    galleryHeading: "Curated Packages & Visa Advisory",
    galleryDescription: "The service directory organizes complex international itineraries and visa assistance modules into legible, confidence-inspiring cards.",
  },

  "tog-africa": {
    slug: "tog-africa",
    title: "TOG Africa",
    category: "Corporate Platform",
    badge: "Corporate Platform",
    type: "Enterprise Technology",
    focus: "Digital Transformation & IT Consulting",
    lead: "An enterprise corporate platform showcasing comprehensive IT infrastructure, software solutions, and strategic technology consulting across Africa.",
    overview: "TOG Africa delivers enterprise-grade technology services to forward-thinking organizations. The platform establishes an authoritative corporate presence, presenting specialized consulting capabilities, enterprise software solutions, and direct appointment scheduling for technology audits and business partnerships.",
    capabilitiesTitle: "Enterprise Capabilities",
    capabilities: [
      {
        title: "Technology Solutions Catalog",
        description: "Structured presentation of enterprise software, cloud infrastructure, and bespoke digital transformation services.",
      },
      {
        title: "Consultancy & Strategic Advisory",
        description: "In-depth overview of advisory practices helping businesses modernize legacy systems and adopt scalable architectures.",
      },
      {
        title: "Direct Consultation Scheduling",
        description: "Integrated appointment booking module allowing corporate leaders to schedule exploratory technology audits.",
      },
      {
        title: "Corporate Authority & Brand Identity",
        description: "Clean corporate layout utilizing high-contrast typography, restrained styling, and authoritative enterprise presentation.",
      },
    ],
    heroImage: {
      src: "/assets/work/tog-africa-hero.webp",
      width: 1400,
      height: 930,
      alt: "TOG Africa corporate IT services platform header and enterprise capabilities overview",
      caption: "Corporate platform hero: enterprise brand presentation, core value proposition, and technology consulting focus.",
      bg: "#ffffff",
    },
    detailImage: {
      src: "/assets/work/tog-africa-detail.webp",
      width: 1400,
      height: 1088,
      alt: "TOG Africa services grid, enterprise capabilities, and consultation appointment form",
      caption: "Enterprise services overview: detailed technology capability grid and consultation appointment interface.",
      bg: "#ffffff",
    },
    galleryHeading: "Service Grid & Consultation Architecture",
    galleryDescription: "The service section presents multifaceted enterprise IT offerings with clarity, guiding decision-makers toward structured consultation bookings.",
  },

  "connectapi": {
    slug: "connectapi",
    title: "ConnectAPI",
    category: "UI/UX Concept",
    badge: "UI/UX Concept",
    type: "Developer Tool Concept",
    focus: "API Management & Webhook Gateway",
    lead: "A developer-focused API gateway and integration dashboard concept engineered for seamless key provisioning, webhook routing, and real-time observability.",
    overview: "ConnectAPI explores an ergonomic developer experience for managing complex API ecosystems. Conceptualized as an all-in-one control center, the interface streamlines secret key generation, endpoint monitoring, webhook delivery logs, and request payload debugging in a high-density, low-friction dark interface.",
    scopeNote: "Concept Work: ConnectAPI is documented as a product design concept. All metrics and usage figures displayed in the interface are illustrative sample data.",
    capabilitiesTitle: "Concept Features",
    capabilities: [
      {
        title: "API Key Generation & Provisioning",
        description: "Fast cryptographic key creation with scoped permissions, expiration rules, and granular environment controls.",
      },
      {
        title: "Real-Time Webhook Routing & Logs",
        description: "Interactive webhook event tracking displaying delivery attempts, response latency, payload inspection, and retry triggers.",
      },
      {
        title: "Endpoint Health & Telemetry",
        description: "At-a-glance monitoring of API throughput, uptime metrics, status code distributions, and latency percentiles.",
      },
      {
        title: "Developer-Centric Dark Mode UI",
        description: "High-contrast, syntax-friendly dark interface optimized for prolonged engineering sessions and dense telemetry data.",
      },
    ],
    heroImage: {
      src: "/assets/work/connectapi-hero.webp",
      width: 1241,
      height: 748,
      alt: "ConnectAPI dashboard concept header showing API gateway status, key controls, and endpoint metrics",
      caption: "Concept dashboard view: gateway overview, cryptographic key generation, and endpoint status controls.",
      bg: "#08152b",
    },
    detailImage: {
      src: "/assets/work/connectapi-detail.webp",
      width: 1241,
      height: 1304,
      alt: "ConnectAPI webhook logs, payload debugging inspector, and real-time activity stream",
      caption: "Telemetry & webhook view: event payload inspector, delivery status logs, and latency monitoring.",
      bg: "#08152b",
    },
    galleryHeading: "Telemetry & Webhook Event Logs",
    galleryDescription: "The detailed monitoring screen illustrates how engineers inspect incoming webhook payloads, track delivery status codes, and test API endpoints in real time.",
  },
};

