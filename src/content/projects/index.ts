import type { Project } from "../models";

// TODO: import only owner-verified, permission-cleared project content.
// The four candidate source records stay in docs/PROJECT_INVENTORY.json.
// candidates.ts supports gated local evidence review; it never joins this collection.
export const projects: readonly Project[] = [];
