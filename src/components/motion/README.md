# Motion ownership boundary

Phase 02 owns GSAP/ScrollTrigger choreography, Motion microinteractions and route enhancement. Server content starts visible. Do not add opacity-zero CSS as an initial state.

- `typography.tsx`: server-owned split-line markup, no duplicate accessible text.
- `reveal.tsx`: scoped line, perspective image-mask and directional stagger timelines.
- `handoff.tsx`: native-scroll desktop visual handoff; no pinning or wheel interception.
- `tactile.tsx`: bounded pointer tilt, magnetic links and equivalent hover/focus previews.
- `route-transition.tsx`: a brief incoming surface treatment; Next retains navigation and back/scroll behavior. New routes receive main focus without scrolling; titles are politely announced.
- `scroll-top.tsx`: native anchor fallback plus reduced-motion-aware scroll and focus restoration.
- `lab-diagnostics.tsx`: lifecycle probe mounted only in the environment-gated demo.

Use `useGsapScope` for GSAP work. Its async import guard, owned context, nested matchMedia cleanup, font-refresh cancellation and visibility listener are reversed on teardown. Builders must create animations synchronously inside the supplied context or return cleanup for their own external resources. Rebuild a wrapper with a stable key when its animation structure changes.

Do not assign GSAP and Motion to the same transform property on the same node. Current tilt is an inner wrapper and scroll handoff is an outer wrapper. Reduced motion reverts GSAP and renders content immediately. Pointer-only effects require fine pointer and hover; keyboard focus never moves its target away.
