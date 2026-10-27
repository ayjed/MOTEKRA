"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useInView, usePageVisible } from "@/lib/animations/hooks";
import { sceneQuality } from "@/lib/animations/policy";

const DeviceScene = dynamic(() => import("./device-scene"), { ssr: false, loading: () => null });
const MobileFlowScene = dynamic(() => import("./mobile-flow-scene"), { ssr: false, loading: () => null });
const ContactScene = dynamic(() => import("./contact-scene"), { ssr: false, loading: () => null });

type Connection = EventTarget & { saveData?: boolean };
type NavigatorCapabilities = Navigator & { deviceMemory?: number; connection?: Connection };

function subscribeCapabilities(notify: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as NavigatorCapabilities).connection;
  window.addEventListener("resize", notify); media.addEventListener("change", notify); connection?.addEventListener("change", notify);
  return () => { window.removeEventListener("resize", notify); media.removeEventListener("change", notify); connection?.removeEventListener("change", notify); };
}
function snapshot() {
  const capabilities = navigator as NavigatorCapabilities;
  return sceneQuality({ width: innerWidth, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: Boolean(capabilities.connection?.saveData), memory: capabilities.deviceMemory, cores: navigator.hardwareConcurrency });
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function useSceneQuality() { return useSyncExternalStore(subscribeCapabilities, snapshot, () => "poster" as const); }

export function SceneBoundary({ poster, variant = "overview", forcePoster = false, cinematic = false, showStatus = true, scene = "devices" }: { poster: ReactNode; variant?: "overview" | "prototype"; forcePoster?: boolean; cinematic?: boolean; showStatus?: boolean; scene?: "devices" | "mobile-flow" | "contact" }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, "160px");
  const visible = useInView(ref);
  const pageVisible = usePageVisible();
  const quality = useSceneQuality();
  const [requested, setRequested] = useState(false);
  const instance = useMemo(() => ({ quality, forcePoster, scene }), [quality, forcePoster, scene]);
  const [readyInstance, setReadyInstance] = useState<object | null>(null);
  const ready = readyInstance === instance;
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReadyInstance(instance), [instance]);
  const onFailure = useCallback(() => setFailed(true), []);
  const allowed = quality !== "poster" && !forcePoster && !failed;
  const active = allowed && visible && pageVisible;
  useEffect(() => {
    if (!near || !allowed || requested || !pageVisible) return;
    let cancelled=false,firstFrame=0,secondFrame=0,idle=0,timer:ReturnType<typeof setTimeout>|undefined;
    const probe=()=>{if(cancelled)return;
      // Probe only once, only on eligible devices. Release the temporary context
      // before mounting R3F; unsupported WebGL never downloads the scene chunk.
      try {
        const probe = document.createElement("canvas");
        const context = probe.getContext("webgl2");
        if (!context) { setFailed(true); return; }
        context.getExtension("WEBGL_lose_context")?.loseContext();
        setRequested(true);
      } catch { setFailed(true); }
    };
    // Let the static poster/text paint before downloading and compiling WebGL.
    firstFrame=requestAnimationFrame(()=>{secondFrame=requestAnimationFrame(()=>{
      if(typeof requestIdleCallback==='function')idle=requestIdleCallback(probe,{timeout:1600});
      else timer=setTimeout(probe,80);
    });});
    return()=>{cancelled=true;cancelAnimationFrame(firstFrame);cancelAnimationFrame(secondFrame);if(idle)cancelIdleCallback(idle);if(timer)clearTimeout(timer);};
  }, [near, allowed, requested, pageVisible]);

  const state = failed ? "error" : !allowed ? "poster" : !requested || !ready ? "loading" : active ? "ready" : "paused";
  const Scene = scene === "contact" ? ContactScene : scene === "mobile-flow" ? MobileFlowScene : DeviceScene;
  return <div ref={ref} className="scene-boundary" data-scene-state={state} data-scene-quality={quality} data-scene-kind={scene} data-scene-variant={variant}>
    <div className="scene-poster" aria-hidden={ready ? "true" : undefined} style={{ opacity: allowed && requested && ready ? 0 : 1, pointerEvents: ready ? "none" : "auto" }}>{poster}</div>
    {allowed && requested && <SceneErrorBoundary onFailure={onFailure}><div className="webgl-layer" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }}><Scene key={`${scene}-${quality}`} active={active} quality={quality === "high" ? "high" : "balanced"} variant={variant} cinematic={cinematic} onReady={onReady} onFailure={onFailure} /></div></SceneErrorBoundary>}
    {showStatus && <p className="scene-status">{failed ? "3D unavailable · static visual retained" : quality === "poster" || forcePoster ? "Static visual · motion and device preferences respected" : active && ready ? "Interactive 3D · concept interface" : "Concept visual · 3D pauses when out of view"}</p>}
  </div>;
}
