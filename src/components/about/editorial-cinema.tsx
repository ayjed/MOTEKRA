"use client";
import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";

export function EditorialCinema({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapScope(ref, (gsap, ScrollTrigger, root) => {
    const lines=root.querySelectorAll('[data-editorial-line]');
    if(lines.length) gsap.fromTo(lines,{yPercent:110,rotation:2},{yPercent:0,rotation:0,duration:1,stagger:.12,ease:'power4.out',clearProps:'transform'});
    const entrances=gsap.context(()=>{},root);
    root.querySelectorAll<HTMLElement>('[data-portrait]').forEach((portrait)=>{
      ScrollTrigger.create({trigger:portrait,start:'top 95%',invalidateOnRefresh:true,once:true,onEnter:()=>entrances.add(()=>{
        const timeline=gsap.timeline({defaults:{ease:'power3.inOut'}});
        timeline.fromTo(portrait.querySelector('[data-portrait-frame]'),{clipPath:'inset(0% 0% 100% 0% round 20px)'},{clipPath:'inset(0% 0% 0% 0% round 20px)',duration:1.2,clearProps:'clipPath'},0)
          .fromTo(portrait.querySelector('[data-portrait-plane]'),{scale:1.1},{scale:1,duration:1.4,clearProps:'transform'},0)
          .fromTo(portrait.querySelectorAll('.portrait-caption > span'),{x:18},{x:0,duration:.7,stagger:.1,clearProps:'transform'},.5);
      })});
    });
    root.querySelectorAll<HTMLElement>('[data-editorial-stagger]').forEach((group)=>{
      ScrollTrigger.create({trigger:group,start:'top 95%',invalidateOnRefresh:true,once:true,onEnter:()=>entrances.add(()=>gsap.fromTo(group.querySelectorAll('[data-editorial-item]'),{x:-26,rotationY:-6},{x:0,rotationY:0,duration:.85,stagger:.1,ease:'power3.out',clearProps:'transform'}))});
    });
    root.querySelectorAll<HTMLElement>('.editorial-bio p').forEach((paragraph)=>{
      ScrollTrigger.create({trigger:paragraph,start:'top 95%',invalidateOnRefresh:true,once:true,onEnter:()=>entrances.add(()=>gsap.fromTo(paragraph.querySelectorAll('.bio-word'),{y:16,rotationX:35},{y:0,rotationX:0,duration:.65,stagger:.018,ease:'power3.out',clearProps:'transform'}))});
    });
    const values=root.querySelector<HTMLElement>('.editorial-values');
    if(values) {
      gsap.fromTo(values.querySelector('[data-values-rail]'),{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:values,start:'top 55%',end:'bottom 60%',scrub:.4}});
      gsap.fromTo(values,{ '--value-glow':'0%' },{ '--value-glow':'100%',ease:'none',scrollTrigger:{trigger:values,start:'top bottom',end:'bottom top',scrub:.5}});
    }
    const desktop=gsap.matchMedia();
    desktop.add('(min-width: 768px)',()=>{
      root.querySelectorAll<HTMLElement>('[data-portrait]').forEach((portrait)=>gsap.fromTo(portrait.querySelector('[data-portrait-plane]'),{yPercent:-3},{yPercent:3,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:.6}}));
      root.querySelectorAll<HTMLElement>('[data-interface-depth]').forEach((visual)=>gsap.fromTo(visual,{rotationY:-12,rotationX:8,y:35},{rotationY:0,rotationX:0,y:0,ease:'none',scrollTrigger:{trigger:visual,start:'top 90%',end:'top 25%',scrub:.6}}));
    });
    return()=>{desktop.revert();entrances.revert();};
  });
  return <div className="editorial-cinema" ref={ref}>{children}</div>;
}
