import type { Project } from "../models";
import evidenceAssets from "../../../docs/WORK_EVIDENCE_ASSETS.json";

export interface CandidateProject extends Project {
  evidenceFile: string;
  observation: string;
  verificationNotes: readonly string[];
}

const awaiting = ["Problem and project brief", "Founder/company contribution and ownership", "Design and development process", "Production functionality and completion", "Technology stack", "Results and display permission"] as const;

// Source observations are not delivery claims. This collection is review-only.
export const candidates: readonly CandidateProject[] = [
  { slug: "spotlight-contest", title: "Spotlight Contest", category: "Web application / screenshot evidence", evidenceFile: "1836ab98-1426-4fca-b9fa-adb23268b2fd.pdf", observation: "The supplied screenshot shows a contest-platform landing page with contest listings, participation steps and organizer-facing interface descriptions.", publication: "draft", status: null, ownership: null, role: null, displayPermission: false, summary: "Contest-platform interface shown in a supplied screenshot. Attribution and delivery status await verification.", resultsVerified: [], verificationNotes: awaiting },
  { slug: "lad-global-travels", title: "LAD Global Travels", category: "Travel website / screenshot evidence", evidenceFile: "205d73c3-66c4-4918-9643-b0eadfcb3032.pdf", observation: "The supplied screenshot shows travel and mobility service cards, tour-package listings and an inquiry-oriented website layout.", publication: "draft", status: null, ownership: null, role: null, displayPermission: false, summary: "Travel and mobility website shown in a supplied screenshot. Role and deployment status await verification.", resultsVerified: [], verificationNotes: awaiting },
  { slug: "tog-africa", title: "TOG Africa", category: "Corporate website / screenshot evidence", evidenceFile: "18f8400e-473b-45df-b71d-216ad14f4e9b.pdf", observation: "The supplied screenshot shows a corporate IT-services website, an appointment form and a grid of service descriptions.", publication: "draft", status: null, ownership: null, role: null, displayPermission: false, summary: "Corporate IT-services website shown in a supplied screenshot. Ownership and precise contribution await verification.", resultsVerified: [], verificationNotes: awaiting },
  { slug: "connectapi", title: "ConnectAPI", category: "UI/UX dashboard concept", evidenceFile: "eb4d75b3-7a73-4ba7-bfc6-876fba4f6315.pdf", observation: "The supplied presentation identifies an API-integration dashboard as a personal project and concept. It shows integration, API-key, webhook, log and activity interface areas. This describes the presentation, not verified backend functionality.", publication: "draft", status: "concept", ownership: null, role: null, displayPermission: false, summary: "API-dashboard design presentation. Treated as concept work; authorship, contribution and permission remain unverified. UI figures are sample data, not verified results.", resultsVerified: [], verificationNotes: ["Exact authorship and independent/company attribution", "Design contribution and process", "Implemented versus illustrative features", "Production status, technology and display permission"] },
];

export function isCandidate(project: Project): project is CandidateProject { return "evidenceFile" in project; }
export function candidateImage(slug: string, view: "hero" | "detail") {
  const asset = evidenceAssets.find((image) => image.slug === slug && image.kind === view);
  if (!asset) throw new Error("Missing reviewed evidence export");
  return { src: `/assets/work/${slug}-${view}.webp`, width: asset.width, height: asset.height };
}

