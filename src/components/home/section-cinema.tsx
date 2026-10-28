"use client";
import { useRef,type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";
export function HomeSectionCinema({kind,children}:{kind:'work'|'contact';children:ReactNode}){const ref=useRef<HTMLDivElement>(null);useGsapScope(ref,(gsap,ScrollTrigger,root)=>{const animations=gsap.context(()=>{},root),listeners:(()=>void)[]=[];
 if(kind==='work')root.querySelectorAll<HTMLElement>('[data-work-card]').forEach((card,index)=>{let tween:ReturnType<typeof gsap.fromTo>|undefined;const focus=()=>tween?.progress(1);card.addEventListener('focusin',focus);listeners.push(()=>card.removeEventListener('focusin',focus));ScrollTrigger.create({trigger:card,start:'top 95%',once:true,onEnter:()=>animations.add(()=>{if(card.contains(document.activeElement))return;tween=gsap.fromTo(card,{clipPath:'inset(8% 0% 0% 0% round 20px)',y:35,rotationY:index%2?-4:4,opacity:0.3},{clipPath:'inset(0% 0% 0% 0% round 20px)',y:0,rotationY:0,opacity:1,duration:0.75,ease:'power3.out',clearProps:'transform,clipPath,opacity'});})});});
  if(kind==='contact'){
    // Scoped entrance and pointer-responsive movement are managed inside ConceptCreationVisual
  }
 return()=>{listeners.forEach(remove=>remove());animations.revert();};});return <div ref={ref} className={`home-section-cinema section-cinema-${kind}`}>{children}</div>;}
