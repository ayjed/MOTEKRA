"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import { CanvasTexture, Group, InstancedMesh, Object3D, LinearFilter, SRGBColorSpace } from "three";
import { useEffect, useMemo, useRef } from "react";

function useInterfaceTexture(variant: "overview" | "prototype", phone = false, quality: "balanced"|"high" = "high") {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = phone ? 480 : 1280;
    canvas.height = phone ? 960 : 800;
    const authoredWidth = canvas.width, authoredHeight = canvas.height;
    if (quality === "balanced") {
      canvas.width = Math.round(authoredWidth * 0.75);
      canvas.height = Math.round(authoredHeight * 0.75);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Concept interface texture unavailable");
    ctx.scale(canvas.width / authoredWidth, canvas.height / authoredHeight);

    if (phone) {
      // Mobile Device Screen — Dark Navy Luxury SaaS UI
      ctx.fillStyle = "#08152b";
      ctx.fillRect(0, 0, authoredWidth, authoredHeight);

      // Status Bar
      ctx.fillStyle = "#12cde4";
      ctx.beginPath();
      ctx.arc(36, 44, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a8d9f8";
      ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("MOTEKRA MOBILE", 52, 49);
      ctx.fillStyle = "#537e9f";
      ctx.font = "13px monospace";
      ctx.fillText("v2.4", authoredWidth - 68, 49);

      // Hero Card
      const heroGrad = ctx.createLinearGradient(24, 76, authoredWidth - 24, 250);
      heroGrad.addColorStop(0, "#0e2a4a");
      heroGrad.addColorStop(1, "#0a1e36");
      ctx.fillStyle = heroGrad;
      ctx.beginPath();
      ctx.roundRect(24, 76, authoredWidth - 48, 170, 16);
      ctx.fill();
      ctx.strokeStyle = "#1b4b75";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#12cde4";
      ctx.font = "bold 12px -apple-system, sans-serif";
      ctx.fillText("DIGITAL PLATFORM", 44, 110);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px -apple-system, sans-serif";
      ctx.fillText("Your ideas.", 44, 146);
      ctx.fillStyle = "#8eeeff";
      ctx.fillText("Real solutions.", 44, 178);

      ctx.fillStyle = "#95b8d5";
      ctx.font = "13px -apple-system, sans-serif";
      ctx.fillText("Performance, design & engineering.", 44, 212);

      // Stat Widget 1: Velocity
      ctx.fillStyle = "#0c223c";
      ctx.beginPath();
      ctx.roundRect(24, 264, authoredWidth - 48, 110, 16);
      ctx.fill();
      ctx.strokeStyle = "#1b4468";
      ctx.stroke();

      ctx.fillStyle = "#79a3c4";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("SYSTEM VELOCITY", 44, 296);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px -apple-system, sans-serif";
      ctx.fillText("99.8%", 44, 336);
      ctx.fillStyle = "#12cde4";
      ctx.font = "bold 13px -apple-system, sans-serif";
      ctx.fillText("↑ +24.6% this cycle", 150, 334);

      // Mini Chart in widget
      const chartBars = [22, 38, 30, 48, 55, 42, 68, 85, 74, 92];
      chartBars.forEach((h, i) => {
        const bx = authoredWidth - 190 + i * 14;
        const by = 354 - (h * 0.42);
        ctx.fillStyle = i >= 7 ? "#12cde4" : "#1688f7";
        ctx.beginPath();
        ctx.roundRect(bx, by, 9, h * 0.42, 3);
        ctx.fill();
      });

      // Stat Widget 2: Active Deployments
      ctx.fillStyle = "#0c223c";
      ctx.beginPath();
      ctx.roundRect(24, 390, authoredWidth - 48, 220, 16);
      ctx.fill();
      ctx.strokeStyle = "#1b4468";
      ctx.stroke();

      ctx.fillStyle = "#79a3c4";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("CONNECTED DEPLOYMENTS", 44, 422);

      const projects = [
        { name: "Spotlight Contest", tag: "Production", active: true },
        { name: "LAD Global Travels", tag: "Verified", active: true },
        { name: "TOG Africa", tag: "Enterprise", active: true },
        { name: "ConnectAPI", tag: "Core API", active: true },
      ];

      projects.forEach((p, idx) => {
        const py = 450 + idx * 38;
        ctx.fillStyle = "#12cde4";
        ctx.beginPath();
        ctx.arc(46, py + 7, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px -apple-system, sans-serif";
        ctx.fillText(p.name, 62, py + 12);

        ctx.fillStyle = "#1688f7";
        ctx.beginPath();
        ctx.roundRect(authoredWidth - 130, py - 4, 86, 22, 999);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px -apple-system, sans-serif";
        ctx.fillText(p.tag, authoredWidth - 118, py + 11);
      });

      // Bottom Action Indicator
      ctx.fillStyle = "#12cde4";
      ctx.beginPath();
      ctx.roundRect(authoredWidth / 2 - 40, authoredHeight - 24, 80, 5, 3);
      ctx.fill();
    } else {
      // Laptop Screen — Clean, Ultra-Crisp Light & Blue SaaS Interface
      ctx.fillStyle = "#f8fbfe";
      ctx.fillRect(0, 0, authoredWidth, authoredHeight);

      // Top Browser Header Bar
      ctx.fillStyle = "#e9f2fa";
      ctx.fillRect(0, 0, authoredWidth, 48);
      ctx.strokeStyle = "#d2e3f1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 48);
      ctx.lineTo(authoredWidth, 48);
      ctx.stroke();

      // Window dots
      ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(24, 24, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(40, 24, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(56, 24, 5, 0, Math.PI * 2); ctx.fill();

      // URL pill
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(88, 10, 320, 28, 6);
      ctx.fill();
      ctx.strokeStyle = "#c8dceb";
      ctx.stroke();
      ctx.fillStyle = "#08152b";
      ctx.font = "bold 11px -apple-system, sans-serif";
      ctx.fillText("motekra.com/platform", 108, 28);

      // Navigation Links in header
      const navItems = ["Overview", "Work", "Services", "Architecture", "Status"];
      navItems.forEach((item, i) => {
        ctx.fillStyle = i === 0 ? "#1688f7" : "#4a6a88";
        ctx.font = (i === 0 ? "bold " : "") + "12px -apple-system, sans-serif";
        ctx.fillText(item, 450 + i * 95, 29);
      });

      // Live Status Tag
      ctx.fillStyle = "#12cde4";
      ctx.beginPath();
      ctx.roundRect(authoredWidth - 160, 12, 136, 24, 12);
      ctx.fill();
      ctx.fillStyle = "#08152b";
      ctx.font = "bold 11px -apple-system, sans-serif";
      ctx.fillText("● SYSTEM ONLINE", authoredWidth - 146, 28);

      // Main Content Area: Left Hero & Right Analytics Board
      // Left Hero Card
      ctx.fillStyle = "#12cde4";
      ctx.font = "bold 13px -apple-system, sans-serif";
      ctx.fillText("CREATIVE TECHNOLOGY STUDIO", 44, 94);

      ctx.fillStyle = "#08152b";
      ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Your ideas.", 44, 146);
      ctx.fillStyle = "#1688f7";
      ctx.fillText("Real solutions.", 44, 196);

      ctx.fillStyle = "#486581";
      ctx.font = "17px -apple-system, sans-serif";
      ctx.fillText("High-performance digital products engineered for scale.", 44, 238);

      // Metric Summary Cards
      const metrics = [
        { label: "Deployment Speed", val: "3.2x", sub: "Faster release cycle", color: "#1688f7" },
        { label: "Uptime Reliability", val: "99.98%", sub: "Production uptime", color: "#12cde4" },
        { label: "Interface Latency", val: "< 16ms", sub: "60fps frame budget", color: "#08152b" }
      ];

      metrics.forEach((m, i) => {
        const mx = 44 + i * 180;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(mx, 275, 165, 115, 12);
        ctx.fill();
        ctx.strokeStyle = "#d6e6f4";
        ctx.stroke();

        ctx.fillStyle = "#627d98";
        ctx.font = "11px -apple-system, sans-serif";
        ctx.fillText(m.label, mx + 16, 305);

        ctx.fillStyle = m.color;
        ctx.font = "bold 26px -apple-system, sans-serif";
        ctx.fillText(m.val, mx + 16, 345);

        ctx.fillStyle = "#829ab1";
        ctx.font = "11px -apple-system, sans-serif";
        ctx.fillText(m.sub, mx + 16, 372);
      });

      // Right Side: Analytical Performance Chart
      const chartX = 610, chartY = 74, chartW = authoredWidth - 654, chartH = 316;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(chartX, chartY, chartW, chartH, 14);
      ctx.fill();
      ctx.strokeStyle = "#cfe2f2";
      ctx.stroke();

      ctx.fillStyle = "#08152b";
      ctx.font = "bold 16px -apple-system, sans-serif";
      ctx.fillText("Platform Activity & Performance", chartX + 24, chartY + 36);

      ctx.fillStyle = "#627d98";
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("Real-time telemetry across active applications", chartX + 24, chartY + 58);

      // Grid lines
      for (let g = 0; g < 4; g++) {
        const gy = chartY + 95 + g * 50;
        ctx.strokeStyle = "#e9f2fa";
        ctx.beginPath();
        ctx.moveTo(chartX + 24, gy);
        ctx.lineTo(chartX + chartW - 24, gy);
        ctx.stroke();
      }

      // Smooth Area Curve
      const points = [
        { x: chartX + 30, y: chartY + 230 },
        { x: chartX + 90, y: chartY + 205 },
        { x: chartX + 160, y: chartY + 215 },
        { x: chartX + 230, y: chartY + 160 },
        { x: chartX + 300, y: chartY + 175 },
        { x: chartX + 370, y: chartY + 130 },
        { x: chartX + 440, y: chartY + 140 },
        { x: chartX + 510, y: chartY + 105 },
        { x: chartX + chartW - 30, y: chartY + 95 }
      ];

      const areaGrad = ctx.createLinearGradient(0, chartY + 90, 0, chartY + 260);
      areaGrad.addColorStop(0, "rgba(18, 205, 228, 0.35)");
      areaGrad.addColorStop(0.5, "rgba(22, 136, 247, 0.18)");
      areaGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      const firstPoint = points[0]!;
      const lastPoint = points[points.length - 1]!;

      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]!;
        const curr = points[i]!;
        const xc = (prev.x + curr.x) / 2;
        const yc = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
      }
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(chartX + chartW - 30, chartY + 260);
      ctx.lineTo(chartX + 30, chartY + 260);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Curve Line
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]!;
        const curr = points[i]!;
        const xc = (prev.x + curr.x) / 2;
        const yc = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
      }
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.strokeStyle = "#1688f7";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Lower Section: Priority Project Pipeline
      const pipelineY = 416, pipelineH = 350;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(44, pipelineY, authoredWidth - 88, pipelineH, 14);
      ctx.fill();
      ctx.strokeStyle = "#cfe2f2";
      ctx.stroke();

      ctx.fillStyle = "#08152b";
      ctx.font = "bold 18px -apple-system, sans-serif";
      ctx.fillText("Active Engineering Showcase", 72, pipelineY + 42);

      const showcaseProjects = [
        { title: "Spotlight Contest", type: "Web Application & Talent Platform", status: "Live Production", metric: "99.9% Uptime" },
        { title: "LAD Global Travels", type: "Travel Logistics & Booking Interface", status: "Verified Shipped", metric: "3.2k Bookings" },
        { title: "TOG Africa", type: "Connected Business Intelligence Hub", status: "Enterprise Scale", metric: "Multi-Region" },
        { title: "ConnectAPI", type: "High-Throughput Developer Integration", status: "Core Architecture", metric: "<12ms Response" }
      ];

      showcaseProjects.forEach((proj, idx) => {
        const px = 72 + idx * 285;
        const py = pipelineY + 70;
        ctx.fillStyle = "#f5f9fd";
        ctx.beginPath();
        ctx.roundRect(px, py, 265, 230, 10);
        ctx.fill();
        ctx.strokeStyle = "#d6e6f4";
        ctx.stroke();

        // Accent indicator
        ctx.fillStyle = idx === 0 ? "#12cde4" : idx === 1 ? "#1688f7" : idx === 2 ? "#08152b" : "#43a047";
        ctx.beginPath();
        ctx.roundRect(px + 18, py + 22, 40, 6, 3);
        ctx.fill();

        ctx.fillStyle = "#08152b";
        ctx.font = "bold 17px -apple-system, sans-serif";
        ctx.fillText(proj.title, px + 18, py + 56);

        ctx.fillStyle = "#627d98";
        ctx.font = "12px -apple-system, sans-serif";
        ctx.fillText(proj.type, px + 18, py + 84);

        // Status badge
        ctx.fillStyle = "#e0efff";
        ctx.beginPath();
        ctx.roundRect(px + 18, py + 120, 130, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#0562cb";
        ctx.font = "bold 11px -apple-system, sans-serif";
        ctx.fillText(proj.status, px + 30, py + 137);

        // Metric badge
        ctx.fillStyle = "#08152b";
        ctx.font = "bold 15px -apple-system, sans-serif";
        ctx.fillText(proj.metric, px + 18, py + 195);
      });
    }

    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.generateMipmaps = false;
    result.minFilter = LinearFilter;
    result.magFilter = LinearFilter;
    result.anisotropy = 2;
    return result;
  }, [phone, quality]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Keyboard() {
  const keys = useRef<InstancedMesh>(null);
  useEffect(() => {
    if (!keys.current) return;
    const key = new Object3D();
    for (let row = 0; row < 4; row++) for (let column = 0; column < 13; column++) {
      key.position.set((column - 6) * .29, -1.467, .42 + row * .21);
      key.updateMatrix(); keys.current.setMatrixAt(row * 13 + column, key.matrix);
    }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={keys} args={[undefined, undefined, 52]}><boxGeometry args={[.25, .018, .16]} /><meshStandardMaterial color="#243d53" metalness={.4} roughness={.4} /></instancedMesh>;
}

function DeterministicCamera() {
  const { camera, size, invalidate } = useThree();
  const cameraRef = useRef(camera);
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    const cam = cameraRef.current;
    cam.position.set(0, 0.45, 9.8);
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
      cam.position.set(0, 0.45, 9.8);
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

const REST_X = -0.15;
const REST_Y = 0.22;
const REST_ROT_X = 0.06;
const REST_ROT_Y = -0.18;
const REST_PHONE_X = 2.25;
const REST_PHONE_Y = -0.4;
const REST_PHONE_ROT_Y = -0.06;

function Devices({ active, variant, onReady, quality }: { active: boolean; variant: "overview" | "prototype"; onReady: () => void; quality: "balanced"|"high" }) {
  const group = useRef<Group>(null);
  const lid = useRef<Group>(null), base = useRef<Group>(null), handset = useRef<Group>(null);
  const screen = useInterfaceTexture(variant,false,quality);
  const phone = useInterfaceTexture(variant,true,quality);
  const { invalidate, gl } = useThree();
  const readyFrames = useRef(0);
  const pointerInside = useRef(true);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLeave = () => {
      pointerInside.current = false;
      invalidate();
    };
    const handleEnter = () => {
      pointerInside.current = true;
      invalidate();
    };
    canvas.addEventListener("pointerleave", handleLeave, { passive: true });
    canvas.addEventListener("pointerenter", handleEnter, { passive: true });
    return () => {
      canvas.removeEventListener("pointerleave", handleLeave);
      canvas.removeEventListener("pointerenter", handleEnter);
    };
  }, [gl, invalidate]);

  useEffect(() => { if (active) invalidate(); }, [active, variant, invalidate]);

  useFrame(({ pointer }, delta) => {
    // Verify that the scene has rendered complete frames before signaling ready
    if (readyFrames.current < 2) {
      if (++readyFrames.current === 2) onReady();
      invalidate();
    }
    if (!active || !group.current) return;

    // Clamped pointer coordinates; smoothly return to 0 when cursor exits canvas
    const isInside = pointerInside.current;
    const px = (isInside && Number.isFinite(pointer.x)) ? Math.max(-1, Math.min(1, pointer.x)) : 0;
    const py = (isInside && Number.isFinite(pointer.y)) ? Math.max(-1, Math.min(1, pointer.y)) : 0;

    // Directional translation: Left/Right (±20px), Up/Down (±12px)
    const targetX = REST_X + px * 0.22;
    const targetY = REST_Y + py * 0.12;

    // Controlled 3D rotation: ±3 degrees (±0.052 rad)
    const targetRotY = REST_ROT_Y + px * 0.052;
    const targetRotX = REST_ROT_X - py * 0.045;

    const safeDelta = Math.min(Math.max(delta, 0), 0.05);
    const amount = Math.min(1, safeDelta * 6.5);

    group.current.position.x += (targetX - group.current.position.x) * amount;
    group.current.position.y += (targetY - group.current.position.y) * amount;
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * amount;
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * amount;

    // Smartphone independent parallax for natural depth
    if (handset.current) {
      const targetPhoneX = REST_PHONE_X + px * 0.08;
      const targetPhoneY = REST_PHONE_Y + py * 0.05;
      const targetPhoneRotY = REST_PHONE_ROT_Y + px * 0.025;
      handset.current.position.x += (targetPhoneX - handset.current.position.x) * amount;
      handset.current.position.y += (targetPhoneY - handset.current.position.y) * amount;
      handset.current.rotation.y += (targetPhoneRotY - handset.current.rotation.y) * amount;
    }

    const motionDelta = Math.abs(targetX - group.current.position.x) +
                        Math.abs(targetY - group.current.position.y) +
                        Math.abs(targetRotY - group.current.rotation.y) +
                        Math.abs(targetRotX - group.current.rotation.x);
    if (motionDelta > 0.0002) invalidate();
  });

  return <group ref={group} rotation={[REST_ROT_X, REST_ROT_Y, .025]} position={[REST_X, REST_Y, 0]} scale={1.16}>
    <group ref={lid}>
      <RoundedBox args={[4.6, 2.95, .16]} radius={.12} smoothness={quality==="high"?3:2}>
        <meshPhysicalMaterial color="#0b1e36" metalness={.72} roughness={.2} clearcoat={.9} clearcoatRoughness={.15} />
      </RoundedBox>
      <mesh position={[0, .02, .091]}>
        <planeGeometry args={[4.28, 2.62]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <RoundedBox args={[4.25, .025, .02]} radius={.009} smoothness={2} position={[0, -1.42, .09]}>
        <meshBasicMaterial color="#12cde4" />
      </RoundedBox>
    </group>
    <group ref={base}>
      <RoundedBox args={[4.95, .14, 2.6]} radius={.06} smoothness={quality==="high"?3:2} position={[0, -1.55, 1.18]}>
        <meshStandardMaterial color="#c5d8eb" metalness={.82} roughness={.22} />
      </RoundedBox>
      <Keyboard />
      <RoundedBox args={[1.5, .018, .16]} radius={.025} smoothness={2} position={[0, -1.467, 1.25]}>
        <meshStandardMaterial color="#243d53" metalness={.4} roughness={.4} />
      </RoundedBox>
      <RoundedBox args={[1.35, .012, .78]} radius={.04} smoothness={2} position={[0, -1.47, 1.72]}>
        <meshStandardMaterial color="#88a8c7" metalness={.65} roughness={.35} />
      </RoundedBox>
    </group>
    <group ref={handset} position={[REST_PHONE_X, REST_PHONE_Y, 1.8]} rotation={[0, REST_PHONE_ROT_Y, -.12]}>
      <RoundedBox args={[1.16, 2.3, .16]} radius={.13} smoothness={quality==="high"?3:2}>
        <meshPhysicalMaterial color="#08182d" metalness={.65} roughness={.18} clearcoat={1} clearcoatRoughness={.1} />
      </RoundedBox>
      <mesh position={[0, 0, .09]}>
        <planeGeometry args={[1, 2.04]} />
        <meshBasicMaterial map={phone} toneMapped={false} />
      </mesh>
      <RoundedBox args={[.35, .06, .02]} radius={.02} smoothness={2} position={[0, 1.02, .11]}>
        <meshBasicMaterial color="#08152b" />
      </RoundedBox>
    </group>
  </group>;
}

function ContextMonitor({ onFailure, onReady }: { onFailure: () => void; onReady: () => void }) {
  const { gl, invalidate, performance } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    let restoreTimeout: ReturnType<typeof setTimeout> | undefined;

    const lost = (event: Event) => {
      event.preventDefault(); // Permit browser to restore WebGL context
      restoreTimeout = setTimeout(() => {
        // Fallback to static poster if WebGL cannot be restored after 3.5s
        onFailure();
      }, 3500);
    };

    const restored = () => {
      if (restoreTimeout) clearTimeout(restoreTimeout);
      invalidate();
      onReady();
    };

    const move = () => { performance.regress(); invalidate(); };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerleave", move, { passive: true });

    const handleTabRestore = () => {
      const ctx = gl.getContext();
      if (ctx && "isContextLost" in ctx && (ctx as WebGLRenderingContext).isContextLost()) {
        return;
      }
      invalidate();
    };
    window.addEventListener("motekra-tab-restored", handleTabRestore);
    window.addEventListener("focus", handleTabRestore);

    return () => {
      if (restoreTimeout) clearTimeout(restoreTimeout);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", move);
      window.removeEventListener("motekra-tab-restored", handleTabRestore);
      window.removeEventListener("focus", handleTabRestore);
    };
  }, [gl, invalidate, performance, onFailure, onReady]);
  return null;
}

export default function DeviceScene({ active, quality, variant, onReady, onFailure }: { active: boolean; quality: "balanced" | "high"; variant: "overview" | "prototype"; cinematic?: boolean; onReady: () => void; onFailure: () => void }) {
  return <Canvas frameloop={active ? "demand" : "never"} dpr={quality === "high" ? 1.25 : 1} camera={{ position: [0, .45, 9.8], fov: 37 }} gl={{ antialias: quality === "high", alpha: true, powerPreference: "low-power" }} performance={{ min: .65 }} fallback={null}>
    <ambientLight intensity={1.8} /><directionalLight position={[3, 5, 6]} intensity={3} color="#ddf5ff" /><directionalLight position={[-5, 0, 3]} intensity={2} color="#1688f7" />
    <DeterministicCamera />
    <Devices active={active} variant={variant} quality={quality} onReady={onReady} />
    <AdaptiveDpr />
    <ContextMonitor onFailure={onFailure} onReady={onReady} />
  </Canvas>;
}
