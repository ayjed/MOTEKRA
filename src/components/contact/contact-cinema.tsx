"use client";
import { useRef, type ReactNode } from "react";
import { useGsapScope } from "@/lib/animations/hooks";
export function ContactCinema({children}:{children:ReactNode}) {
 const ref=useRef<HTMLDivElement>(null);
 useGsapScope(ref,(gsap,ScrollTrigger,root)=>{
  gsap.timeline({defaults:{ease:'power4.out'}}).fromTo(root.querySelectorAll('[data-contact-word]'),{yPercent:115,rotationX:-35},{yPercent:0,rotationX:0,stagger:.1,duration:.95,clearProps:'transform'},0).fromTo(root.querySelector('.contact-artwork'),{rotationY:-20,rotationZ:-5,y:50},{rotationY:0,rotationZ:0,y:0,duration:1.3,clearProps:'transform'},.1);
  const media=gsap.matchMedia();media.add('(min-width:768px)',()=>{gsap.timeline({scrollTrigger:{trigger:root.querySelector('.contact-hero'),start:'top top',end:'bottom 10%',scrub:.6}}).to(root.querySelector('.contact-artwork'),{y:90,rotationY:16,rotationZ:4,scale:.86,ease:'none'},0).to(root.querySelector('.contact-hero'),{'--contact-illumination':1,ease:'none'},0);});
  const entries=gsap.context(()=>{},root);root.querySelectorAll<HTMLElement>('[data-contact-reveal]').forEach(element=>ScrollTrigger.create({trigger:element,start:'top 95%',invalidateOnRefresh:true,once:true,onEnter:()=>entries.add(()=>gsap.fromTo(element,{clipPath:'inset(0% 0% 12% 0% round 20px)',y:28},{clipPath:'inset(0% 0% 0% 0% round 20px)',y:0,duration:.9,ease:'power3.out',clearProps:'transform,clipPath'}))}));
  const focus=(event:FocusEvent)=>{const active=event.type==='focusin';entries.add(()=>gsap.to(root.querySelector('.inquiry-panel'),{'--form-focus':active?1:0,duration:.35,overwrite:'auto'}));};const form=root.querySelector('form');form?.addEventListener('focusin',focus as EventListener);form?.addEventListener('focusout',focus as EventListener);
  return()=>{form?.removeEventListener('focusin',focus as EventListener);form?.removeEventListener('focusout',focus as EventListener);entries.revert();media.revert();};
 });return <div className="contact-cinema" ref={ref}>{children}</div>;
}
