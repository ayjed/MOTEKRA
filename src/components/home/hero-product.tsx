"use client";

import type { ReactNode } from "react";
import { SceneBoundary } from "@/components/three/scene-boundary";

export function HeroProduct({ poster }: { poster: ReactNode }) {
  return <SceneBoundary poster={poster} cinematic showStatus={false} />;
}
