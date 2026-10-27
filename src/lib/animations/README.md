# Animation contracts

GSAP: hero, logo masks, typography, hero/work handoff and process narrative.
R3F/Three/Drei: lazy product devices, optional mobile-flow prototype and contact sculpture, each with server-rendered poster fallback.
Motion: tactile UI and route enhancement without duplicating GSAP ownership.
The shared systems support the implemented Home, Work, Services, About and Contact narratives. `/motion-lab` stays build-gated. All page copy remains server-rendered.

Native scrolling is retained. Lenis/Rive are not dependencies: no demonstrated need justifies another scrolling or state-machine runtime. ScrollTrigger handles its native scroll/resize lifecycle; font readiness requests one guarded refresh. No global `killAll` is used because that could affect unrelated components.

`policy.ts` contains pure, unit-tested capability and pointer bounds. `hooks.ts` owns media-query subscriptions, document visibility, intersection observers and GSAP lifecycles. Offscreen and hidden WebGL runs with `frameloop="never"`; visible scenes use demand rendering and bounded settling, not a continuous ambient loop.

Phase 09: scopes initialize within a 300px viewport margin and share a frame-budgeted setup queue. One scope cannot be preempted mid-build; local initialization timings must still be checked. MediaQueryList subscriptions are shared. Hidden owned timelines pause; live reduced motion reverts their contexts. Home sections have separate owners, and the stable supporting paragraph is excluded from hero movement. GSAP coordinates compositor-based glyph/word keyframes. No global trigger teardown is used.

Motion's `domAnimation` features load asynchronously through the shared provider. Tactile spring controllers mount only near fine-pointer elements; coarse-pointer and reduced-motion visitors allocate none. Stable native wrappers keep links and content mounted throughout preference changes. The drawer has a native close timeout in addition to its animation completion handler. Next's built-in route announcement is retained without a duplicate live region.

High scene DPR is 1.25, balanced is 1. UI textures have linear filtering, no mip chain and smaller balanced variants; rounded geometry also scales with quality. See `docs/PERFORMANCE_BUDGETS.md` and Phase 09 evidence for measured costs and unresolved limits. `?__motekra_profile=1` enables loopback-only scope snapshots; production visitors do not run trigger inventory scans.
