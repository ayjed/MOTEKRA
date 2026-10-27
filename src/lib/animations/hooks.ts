"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { profilingEnabled, trackMotionScope } from "./profiler";
import type { gsap as Gsap } from "gsap";
import type { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";

// Share each query/listener across tactile elements rather than creating a
// MediaQueryList on every external-store snapshot during hydration.
const mediaStores=new Map<string,{media:MediaQueryList;listeners:Set<()=>void>;notify:()=>void}>();
function mediaStore(query:string){let store=mediaStores.get(query);if(!store){const listeners=new Set<()=>void>();store={media:matchMedia(query),listeners,notify:()=>listeners.forEach(listener=>listener())};mediaStores.set(query,store);}return store;}
export function useMedia(query:string,fallback=false){
 const subscribe=useCallback((notify:()=>void)=>{const store=mediaStore(query);if(!store.listeners.size)store.media.addEventListener('change',store.notify);store.listeners.add(notify);return()=>{store.listeners.delete(notify);if(!store.listeners.size)store.media.removeEventListener('change',store.notify);};},[query]);
 const snapshot=useCallback(()=>mediaStore(query).media.matches,[query]);
 return useSyncExternalStore(subscribe,snapshot,()=>fallback);
}

function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

export function usePageVisible() {
  return useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
}

export function useInView(ref: RefObject<HTMLElement | null>, margin = "0px", enabled = true) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || !enabled) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { rootMargin: margin });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, margin, enabled]);
  return enabled && visible;
}

type Builder = (gsap: typeof Gsap, ScrollTrigger: typeof Trigger, root: HTMLElement) => void | (() => void);

// Several server-rendered reveal boundaries become ready in the same frame.
// Refresh the shared geometry once, while retaining per-owner cancellation.
const refreshRequests = new Map<symbol, () => void>();
let sharedRefreshFrame = 0;
function scheduleRefresh(refresh: () => void) {
  const owner = Symbol();
  refreshRequests.set(owner, refresh);
  if (!sharedRefreshFrame) sharedRefreshFrame = requestAnimationFrame(() => {
    sharedRefreshFrame = 0;
    const first = refreshRequests.values().next().value;
    refreshRequests.clear();
    first?.();
  });
  return () => {
    refreshRequests.delete(owner);
    if (!refreshRequests.size && sharedRefreshFrame) { cancelAnimationFrame(sharedRefreshFrame); sharedRefreshFrame = 0; }
  };
}

// Bound setup work per frame; offscreen scopes do not compete with hero hydration.
const setupQueue=new Map<symbol,()=>void>();let setupFrame=0;
function queueSetup(callback:()=>void){const key=Symbol();setupQueue.set(key,callback);const flush=()=>{setupFrame=0;const start=performance.now();for(const [owner,build] of setupQueue){setupQueue.delete(owner);build();if(performance.now()-start>6)break;}if(setupQueue.size)setupFrame=requestAnimationFrame(flush);};if(!setupFrame)setupFrame=requestAnimationFrame(flush);return()=>{setupQueue.delete(key);if(!setupQueue.size&&setupFrame){cancelAnimationFrame(setupFrame);setupFrame=0;}};}

// Initial server content is visible. Import/build only near a real viewport and
// only when motion is permitted. MatchMedia owns live preference cleanup.
export function useGsapScope(ref: RefObject<HTMLElement | null>, build: Builder, enabled = true) {
 const buildRef=useRef(build);useEffect(()=>{buildRef.current=build;},[build]);
 useEffect(()=>{
  if(!enabled||!ref.current)return;const root=ref.current,preference=matchMedia('(prefers-reduced-motion: reduce)');
  let cancelled=false,near=false,loading=false;let media:ReturnType<typeof Gsap.matchMedia>|undefined;let cancelRefresh=()=>{},cancelSetup=()=>{};
  const start=()=>{
   if(cancelled||loading||media||!near||preference.matches||document.hidden)return;loading=true;
   void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
    loading=false;if(cancelled||preference.matches)return;
    cancelSetup=queueSetup(()=>{
     if(cancelled||preference.matches||media)return;gsap.registerPlugin(ScrollTrigger);media=gsap.matchMedia();
     try{media.add('(prefers-reduced-motion: no-preference)',()=>{
      const profiling=profilingEnabled(),previous=profiling?new Set(ScrollTrigger.getAll()):null,began=performance.now();root.dataset.motionActive='true';let cleanup:void|(()=>void);
      const context=gsap.context(()=>{cleanup=buildRef.current(gsap,ScrollTrigger,root);},root);
      const profile=profiling?trackMotionScope(root,performance.now()-began,ScrollTrigger.getAll().filter(trigger=>!previous?.has(trigger)),()=>ScrollTrigger.getAll()):()=>{};
      const paused=new Set<gsap.core.Animation>();const visibility=()=>{if(document.hidden){root.dataset.motionHidden='true';for(const tween of context.getTweens()){let animation:gsap.core.Animation=tween;while(animation.parent&&animation.parent!==gsap.globalTimeline)animation=animation.parent;if(animation.isActive()){animation.pause();paused.add(animation);}}}else{delete root.dataset.motionHidden;paused.forEach(animation=>animation.resume());paused.clear();}};
      document.addEventListener('visibilitychange',visibility);visibility();
      return()=>{document.removeEventListener('visibilitychange',visibility);paused.clear();cleanup?.();context.revert();profile();delete root.dataset.motionActive;delete root.dataset.motionHidden;};
     },root);
     if(document.fonts.status!=='loaded')void document.fonts.ready.then(()=>{if(!cancelled)cancelRefresh=scheduleRefresh(()=>ScrollTrigger.refresh());});
     }catch{media.revert();delete root.dataset.motionActive;}
    });
   }).catch(()=>{loading=false;});
  };
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){near=true;observer.disconnect();start();}},{rootMargin:'300px'});observer.observe(root);
  preference.addEventListener('change',start);document.addEventListener('visibilitychange',start);
  return()=>{cancelled=true;observer.disconnect();preference.removeEventListener('change',start);document.removeEventListener('visibilitychange',start);cancelSetup();cancelRefresh();media?.revert();delete root.dataset.motionActive;};
 },[ref,enabled]);
}
