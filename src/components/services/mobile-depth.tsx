"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SceneBoundary, useSceneQuality } from "@/components/three/scene-boundary";

export function MobileDepth({ poster }: { poster: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"overview" | "prototype">("overview");
  const quality = useSceneQuality();
  const eligible = quality !== "poster";
  useEffect(() => {
    const details = ref.current?.closest("[data-service-demo]")?.querySelector("details");
    if (!details) return;
    const update = () => setVariant(details.open ? "prototype" : "overview");
    details.addEventListener("toggle", update);
    return () => details.removeEventListener("toggle", update);
  }, []);
  function toggle() {
    const details = ref.current?.closest("[data-service-demo]")?.querySelector("details");
    setVariant(details?.open ? "prototype" : "overview");
    setEnabled((value) => !value);
  }
  return <div className="mobile-depth" ref={ref}>
    <SceneBoundary scene="mobile-flow" variant={variant} forcePoster={!enabled || !eligible} poster={poster} showStatus={false} />
    <div className="depth-choice"><button type="button" onClick={toggle} aria-pressed={enabled && eligible} disabled={!eligible}>{enabled && eligible ? "Use static visual" : "Enable 3D depth"}</button><span>{eligible ? "Optional depth / the interface works without it" : "Static visual / device and motion preferences respected"}</span></div>
  </div>;
}
