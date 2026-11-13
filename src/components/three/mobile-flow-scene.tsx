"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import { CanvasTexture, Group, LinearFilter, SRGBColorSpace } from "three";
import { useEffect, useMemo, useRef } from "react";

function useMobileScreen(detail: boolean, quality:"balanced"|"high") {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 480; canvas.height = 960;
    if(quality==="balanced"){canvas.width=320;canvas.height=640;}
    const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Prototype screen unavailable");
    ctx.scale(canvas.width/480,canvas.height/960);
    ctx.fillStyle = detail ? "#081b38" : "#f7fbff"; ctx.fillRect(0,0,480,960);
    ctx.fillStyle = detail ? "#8eeeff" : "#0562cb"; ctx.font = "bold 20px Arial"; ctx.fillText("MOTEKRA / CONCEPT",28,66);
    ctx.font = "bold 62px Arial"; ctx.fillStyle = detail ? "#ffffff" : "#08152b";
    ctx.fillText(detail ? "A closer" : "Find your",28,170); ctx.fillText(detail ? "look." : "perspective.",28,235);
    ctx.font = "22px Arial"; ctx.fillStyle = detail ? "#c7e8ff" : "#44617a"; ctx.fillText(detail ? "A selected interface state." : "Explore an interface journey.",28,292);
    [detail ? "Selected experience" : "Explore", detail ? "What happens next" : "A new direction", "Review the idea"].forEach((label,index) => {
      ctx.fillStyle = index === 0 ? "#0562cb" : detail ? "#173b60" : "#dceeff";
      ctx.beginPath();ctx.roundRect(28,350+index*152,424,130,22);ctx.fill();
      ctx.fillStyle = index === 0 || detail ? "#ffffff" : "#173b60";ctx.font="bold 25px Arial";ctx.fillText(label,48,401+index*152);
      ctx.fillStyle=index===0?"#8eeeff":"#80b5d8";ctx.fillRect(48,429+index*152,260-index*42,6);
    });
    ctx.fillStyle = detail ? "#8eeeff" : "#0562cb";ctx.font="20px Arial";ctx.fillText("Interface study / no live transaction",28,901);
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; result.generateMipmaps=false; result.minFilter=LinearFilter; result.magFilter=LinearFilter; return result;
  }, [detail,quality]);
  useEffect(() => () => texture.dispose(), [texture]); return texture;
}

function DeterministicCamera() {
  const { camera, size, invalidate } = useThree();
  const cameraRef = useRef(camera);
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    const cam = cameraRef.current;
    cam.position.set(0, 0.2, 9);
    cam.lookAt(0, 0, 0);
    if ("aspect" in cam && size.width > 0 && size.height > 0) {
      cam.aspect = size.width / size.height;
      cam.updateProjectionMatrix();
    }
    invalidate();
  }, [camera, size, invalidate]);

  useEffect(() => {
    const handleRestore = () => {
      const cam = cameraRef.current;
      cam.position.set(0, 0.2, 9);
      cam.lookAt(0, 0, 0);
      if ("aspect" in cam && size.width > 0 && size.height > 0) {
        cam.aspect = size.width / size.height;
        cam.updateProjectionMatrix();
      }
      invalidate();
    };
    window.addEventListener("motekra-tab-restored", handleRestore);
    window.addEventListener("focus", handleRestore);
    return () => {
      window.removeEventListener("motekra-tab-restored", handleRestore);
      window.removeEventListener("focus", handleRestore);
    };
  }, [camera, size, invalidate]);

  return null;
}

function Phones({ active, variant, onReady, quality }: { active: boolean; variant: "overview" | "prototype"; onReady: () => void; quality:"balanced"|"high" }) {
  const root = useRef<Group>(null), front = useRef<Group>(null);
  const readyFrames = useRef(0);
  const first = useMobileScreen(false,quality), second = useMobileScreen(true,quality);
  const { invalidate } = useThree();
  useEffect(() => { if (active) invalidate(); }, [active, variant, invalidate]);
  useFrame(({ pointer }, delta) => {
    if (readyFrames.current < 3) { if (++readyFrames.current === 3) onReady(); invalidate(); }
    if (!active || !root.current || !front.current) return;
    const selected = variant === "prototype";
    const x = selected ? .86 : 1.12, z = selected ? .55 : -.25;
    const px = Number.isFinite(pointer.x) ? Math.max(-1, Math.min(1, pointer.x)) : 0;
    const py = Number.isFinite(pointer.y) ? Math.max(-1, Math.min(1, pointer.y)) : 0;
    const ry = -.18 + px * .12, rx = .08 - py * .07;
    const safeDelta = Math.min(Math.max(delta, 0), 0.05);
    const amount = Math.min(1, safeDelta * 8);
    root.current.rotation.y += (ry-root.current.rotation.y)*amount;root.current.rotation.x += (rx-root.current.rotation.x)*amount;
    front.current.position.x += (x-front.current.position.x)*amount;front.current.position.z += (z-front.current.position.z)*amount;
    front.current.rotation.z += ((selected ? -.035 : -.13)-front.current.rotation.z)*amount;
    if (Math.abs(ry-root.current.rotation.y)+Math.abs(rx-root.current.rotation.x)+Math.abs(x-front.current.position.x)+Math.abs(z-front.current.position.z)>.0008) invalidate();
  });
  return <group ref={root} rotation={[.08,-.18,0]}>
    <group position={[-1.05,.18,0]} rotation={[0,.1,.12]}><RoundedBox args={[1.9,3.8,.19]} radius={.19} smoothness={quality==="high"?3:2}><meshPhysicalMaterial color="#a5d5f8" metalness={.55} roughness={.23} clearcoat={.9} /></RoundedBox><mesh position={[0,0,.105]}><planeGeometry args={[1.68,3.47]} /><meshBasicMaterial map={first} toneMapped={false} /></mesh><RoundedBox args={[.48,.08,.025]} position={[0,1.72,.13]} radius={.03} smoothness={2}><meshBasicMaterial color="#143658" /></RoundedBox></group>
    <group ref={front} position={[1.12,-.12,-.25]} rotation={[0,-.08,-.13]}><RoundedBox args={[1.9,3.8,.19]} radius={.19} smoothness={quality==="high"?3:2}><meshPhysicalMaterial color="#081b38" metalness={.5} roughness={.2} clearcoat={1} /></RoundedBox><mesh position={[0,0,.105]}><planeGeometry args={[1.68,3.47]} /><meshBasicMaterial map={second} toneMapped={false} /></mesh><RoundedBox args={[.48,.08,.025]} position={[0,1.72,.13]} radius={.03} smoothness={2}><meshBasicMaterial color="#071326" /></RoundedBox></group>
  </group>;
}
function Events({ onFailure, onReady }: { onFailure: () => void; onReady: () => void }) {
  const { gl, invalidate, performance } = useThree();
  useEffect(() => {
    const canvas=gl.domElement;
    let restoreTimeout: ReturnType<typeof setTimeout> | undefined;
    const move=()=>{performance.regress();invalidate();};
    const lost=(event:Event)=>{
      event.preventDefault();
      restoreTimeout = setTimeout(() => {
        onFailure();
      }, 3500);
    };
    const restored=()=>{
      if (restoreTimeout) clearTimeout(restoreTimeout);
      invalidate();
      onReady();
    };
    canvas.addEventListener("pointermove",move,{passive:true});
    canvas.addEventListener("pointerleave",move,{passive:true});
    canvas.addEventListener("webglcontextlost",lost);
    canvas.addEventListener("webglcontextrestored",restored);

    const handleTabRestore = () => {
      const ctx = gl.getContext();
      if (ctx && "isContextLost" in ctx && (ctx as WebGLRenderingContext).isContextLost()) return;
      invalidate();
    };
    window.addEventListener("motekra-tab-restored", handleTabRestore);
    window.addEventListener("focus", handleTabRestore);

    return()=>{
      if (restoreTimeout) clearTimeout(restoreTimeout);
      canvas.removeEventListener("pointermove",move);
      canvas.removeEventListener("pointerleave",move);
      canvas.removeEventListener("webglcontextlost",lost);
      canvas.removeEventListener("webglcontextrestored",restored);
      window.removeEventListener("motekra-tab-restored", handleTabRestore);
      window.removeEventListener("focus", handleTabRestore);
    };
  },[gl,invalidate,performance,onFailure,onReady]);return null;
}
export default function MobileFlowScene({ active, quality, variant, onReady, onFailure }: { active:boolean;quality:"balanced"|"high";variant:"overview"|"prototype";cinematic?:boolean;onReady:()=>void;onFailure:()=>void }) {
  return <Canvas frameloop={active?"demand":"never"} dpr={quality==="high"?1.25:1} camera={{position:[0,.2,9],fov:36}} gl={{antialias:quality==="high",alpha:true,powerPreference:"low-power"}} performance={{min:.65}}>
    <ambientLight intensity={1.9} /><directionalLight position={[4,5,6]} intensity={3} color="#e8f8ff" /><directionalLight position={[-4,0,3]} intensity={2} color="#1688f7" />
    <DeterministicCamera />
    <Phones active={active} variant={variant} quality={quality} onReady={onReady} />
    <AdaptiveDpr pixelated />
    <Events onFailure={onFailure} onReady={onReady} />
  </Canvas>;
}
