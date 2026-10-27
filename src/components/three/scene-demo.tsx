"use client";

import { useState, type ReactNode } from "react";
import { SceneBoundary } from "./scene-boundary";

export function SceneDemo({ poster }: { poster: ReactNode }) {
  const [variant, setVariant] = useState<"overview" | "prototype">("overview");
  const [posterOnly, setPosterOnly] = useState(false);
  return <div><SceneBoundary poster={poster} variant={variant} forcePoster={posterOnly} /><div className="scene-controls" aria-label="Concept scene controls"><button type="button" aria-pressed={variant === "prototype"} onClick={() => setVariant((v) => v === "overview" ? "prototype" : "overview")}>Change interface state</button><button type="button" aria-pressed={posterOnly} onClick={() => setPosterOnly((value) => !value)}>Use static visual</button></div><p className="scene-control-note">The scene is decorative. These keyboard-accessible controls explore concept UI states; they do not change page content.</p></div>;
}
