import type { Founder } from "../models";

// Owner-approved founder identity, portrait, and professional profile.
export const team: readonly Founder[] = [{ slug: "akinwumi-ayomiposi", name: "Ayomiposi Akinwumi", title: "Software Developer & Creative Technologist", bio: "Software Developer & Creative Technologist at MOTEKRA.", publication: "approved" }];

export const founderProfiles = [
  ["LinkedIn", "https://www.linkedin.com/in/akinwumi-ayomiposi/"],
  ["GitHub", "https://github.com/ayjed"],
  ["Behance", "https://www.behance.net/akinwumayomipo/projects"],
  ["Dribbble", "https://dribbble.com/meekmesh"],
] as const;
