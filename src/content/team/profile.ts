import type { Publication } from "../models";
import { team } from ".";

export interface FounderProfileContent {
  detailsPublication: Publication;
  portrait: { src: string; width: number; height: number; alt: string } | null;
  plannedPortraitSrc: string;
  biography: readonly string[];
  skills: readonly string[];
  experience: readonly { role: string; organization: string; period: string | null; description: string | null }[];
}

// Identity is approved; biography and skills are owner-supplied website copy.
// Final profile review, original portrait and dated history remain pending.
export const founderDetails: Readonly<Record<string, FounderProfileContent>> = {
  "akinwumi-ayomiposi": {
    detailsPublication: "draft",
    portrait: {
      src: "/assets/team/ayomiposi.webp",
      width: 834,
      height: 1024,
      alt: "Akinwumi Ayomiposi — Software Developer & Creative Technologist",
    },
    plannedPortraitSrc: "/assets/team/ayomiposi.webp",
    biography: [
      "Akinwumi Ayomiposi is a software developer, UI/UX designer, and creative technologist with experience building digital products, web applications, mobile experiences, and business technology solutions.",
      "His work combines software engineering, user-centered design, and creative problem-solving to transform complex ideas into functional, intuitive, and scalable digital products.",
      "At MOTEKRA, he brings together technical development and creative direction to help businesses build meaningful digital experiences.",
    ],
    skills: ["Full-Stack Web Development", "PHP & Laravel", "JavaScript & TypeScript", "React & Next.js", "Node.js", "REST API Development", "Database Design and Integration", "React Native", "Expo", "Cross-Platform Mobile Applications", "UI/UX Design", "Figma", "Adobe Photoshop", "Brand Identity", "Product Strategy", "Creative Direction", "WordPress Development", "Payment Gateway Integration", "Cloud Hosting and Deployment", "AI-Assisted Development"],
    experience: [{ role: team[0]!.title, organization: "MOTEKRA", period: null, description: null }],
  },
};

export const companyDirection = {
  mission: "Bring clear thinking, considered design and purposeful technology to digital products.",
  positioning: "A creative technology and digital products company. One place for company capabilities and the founder’s professional perspective.",
  confirmedValues: [] as readonly string[],
  description: ["MOTEKRA is a creative technology company focused on designing and developing high-performance websites, web applications, mobile applications, and digital products.", "We combine software engineering, thoughtful design, and product strategy to help businesses transform ideas into functional, scalable digital solutions."],
  proposedValues: [
    ["Innovation", "We explore new technologies and creative approaches to solve meaningful problems."],
    ["Quality", "We prioritize reliable engineering, thoughtful design, and attention to detail."],
    ["Collaboration", "We work closely with clients to understand their challenges, goals, and expectations."],
    ["User-Centered Thinking", "We build products that are intuitive, accessible, and designed around real human needs."],
    ["Continuous Improvement", "We believe excellent digital products evolve through testing, feedback, and refinement."],
  ] as const,
  principles: [
    ["Clarity", "Make room for the questions that define a useful product."],
    ["Craft", "Consider the interface and the engineering as parts of one experience."],
    ["Honest context", "Give every project its real contribution, ownership and status."],
  ] as const,
};

export const founderSkillGroups = [
  { title: "Software Engineering", skills: ["Full-Stack Web Development", "PHP & Laravel", "JavaScript & TypeScript", "React & Next.js", "Node.js", "REST API Development", "Database Design and Integration"] },
  { title: "Mobile Development", skills: ["React Native", "Expo", "Cross-Platform Mobile Applications"] },
  { title: "Creative & Product Design", skills: ["UI/UX Design", "Figma", "Adobe Photoshop", "Brand Identity", "Product Strategy", "Creative Direction"] },
  { title: "Additional Experience", skills: ["WordPress Development", "Payment Gateway Integration", "Cloud Hosting and Deployment", "AI-Assisted Development"] },
] as const;
