import type { Publication } from "../models";

export interface FounderProfileContent {
  detailsPublication: Publication;
  portrait: { src: string; width: number; height: number; alt: string } | null;
  plannedPortraitSrc: string;
  biography: readonly string[];
  skills: readonly string[];
  experience: readonly { role: string; organization: string; period: string | null; description: string | null }[];
}

// Identity, portrait, biography and skills are owner-approved.
export const founderDetails: Readonly<Record<string, FounderProfileContent>> = {
  "akinwumi-ayomiposi": {
    detailsPublication: "approved",
    portrait: {
      src: "/assets/team/ayomiposi.webp",
      width: 834,
      height: 1024,
      alt: "Akinwumi Ayomiposi — Software Developer & Creative Technologist",
    },
    plannedPortraitSrc: "/assets/team/ayomiposi.webp",
    biography: [
      "Akinwumi Ayomiposi is a Software Developer & Creative Technologist specializing in web and mobile application development, backend engineering, and UI/UX design.",
      "His work combines software engineering, user-centered design, and creative problem-solving to build functional, intuitive, and reliable digital products.",
      "Through MOTEKRA, he brings together technical development and creative thinking to create digital experiences that address real-world challenges.",
    ],
    skills: [
      "PHP",
      "Laravel",
      "REST API Development",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Flutter",
      "Dart",
      "UI/UX Design",
      "Figma",
      "Interface Design",
      "Git",
      "GitHub",
      "AI-Assisted Development",
    ],
    experience: [],
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
  {
    title: "Backend Development",
    skills: ["PHP", "Laravel", "REST API Development"],
  },
  {
    title: "Web Development",
    skills: ["JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    title: "Mobile Development",
    skills: ["Flutter", "Dart"],
  },
  {
    title: "UI/UX Design",
    skills: ["UI/UX Design", "Figma", "Interface Design"],
  },
  {
    title: "Development Workflow",
    skills: ["Git", "GitHub", "AI-Assisted Development"],
  },
] as const;
