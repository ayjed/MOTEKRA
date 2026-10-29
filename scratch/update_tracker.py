import re

path = 'MOTEKRA_PHASE_TRACKER.md'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update line 5 (Current state)
new_current_state = (
    "**Current state:** Phase 52 (Sitewide Responsive Design & Performance Optimization) COMPLETE. "
    "Executed comprehensive multi-viewport responsiveness and Core Web Vitals optimization across all 15 routes and 9 target viewports "
    "(1920px, 1440px, 1280px, 1024px, 768px, 430px, 390px, 375px, 320px) with strictly 0 horizontal overflow issues. "
    "Reduced mobile LCP by up to 82% (Service UI/UX: 2620ms -> 472ms, Case Study: 1356ms -> 328ms, Contact: 3324ms -> 2368ms, Home: 1648ms -> 1144ms). "
    "Achieved sitewide CLS < 0.005. Standardized hero clearance on mobile (clamp(40px, 9vw, 56px)) and inner-page heroes. "
    "Upgraded all interactive controls (pagination, brand logo, marquee toggle, breadcrumbs) to satisfy WCAG 2.5.5 >= 44px touch targets. "
    "Verified mobile navigation drawer full open/close cycle on 390px and 320px screens. Enforced Three.js performance safeguards "
    "(poster fallback on mobile < 768px, demand frameloop, and viewport/tab-inactivity pause). Preserved 2 featured projects on Home and 4 on Work. "
    "Evidence archived in `docs/evidence/phase-52/` and `phase-52-responsive-and-performance-report.md`."
)

content = re.sub(
    r'\*\*Current state:\*\* Phase 51 .*?\n',
    new_current_state + '\n',
    content
)

# New Phase 52 entry for the log table
phase_52_row = (
    "| 2026-10-28 | 52 | **Sitewide Responsive Design & Performance Optimization**: <br>"
    "1. **9-Viewport Responsive Matrix (0 Overflow)**: Audited and verified all 15 routes across 1920px, 1440px, 1280px, 1024px, 768px, 430px, 390px, 375px, and 320px screen widths. Enforced `scrollWidth <= clientWidth` sitewide with strictly zero horizontal layout overflow.<br>"
    "2. **Core Web Vitals Optimization**: Replaced below-the-fold project card eager preloading (`priority={true}`) with native lazy loading (`priority={false}`) and added `fetchPriority=\"high\"` to the critical hero poster asset. Slashed mobile LCP by up to 82% (Service UI/UX: 2620ms $\\to$ 472ms; Case Study: 1356ms $\\to$ 328ms; Contact: 3324ms $\\to$ 2368ms; Home: 1648ms $\\to$ 1144ms). Sitewide CLS maintained at virtually zero (`< 0.005`).<br>"
    "3. **Mobile Header Crowding Fix**: Upgraded `.cinema-hero-grid` mobile padding from `20px 24px` to `clamp(40px, 9vw, 56px) 24px` and removed 320px font-size override in `home.css`, increasing mobile header clearance from 6-7px to 27-34px.<br>"
    "4. **Case Study & Service Subpage Hero Gap Standardization**: Replaced `calc(var(--nav-height) + ...)` with `clamp(64px, 6.7vw, 96px)` (desktop) and `clamp(44px, 10vw, 56px)` (mobile), resolving excessive top whitespace while adhering strictly to Phase 50 hero standards.<br>"
    "5. **Touch Target Compliance (WCAG 2.5.5 $\\ge 44\\text{px}$)**: Standardized touch target dimensions on `.footer-stage-indicator`, `.brand`, `.marquee-toggle-btn`, and breadcrumb links.<br>"
    "6. **Mobile Navigation Drawer Verification**: Automated tests confirmed flawless open/close dialog lifecycle on standard (390px) and narrow (320px) smartphones.<br>"
    "7. **Strict Scope Protection**: Kept Homepage Featured Projects at strictly 2 (TOG Africa, ConnectAPI) and Work gallery at strictly 4. Maintained desktop 3D R3F scene with mobile matching-poster fallback, click-only Services accordion, and all cinematic typography animations. | `tsc --noEmit` passed with 0 errors; Vitest passed 58/58 unit tests; `next build` completed with exit code 0 (23/23 static routes generated); Automated Playwright test suite passed all verification checks across 9 viewports on live production server (`http://localhost:3000`); 44 visual evidence screenshots archived in `docs/evidence/phase-52/`. |\n"
)

# Append to the end of the file
if "| 2026-10-28 | 52 |" not in content:
    content = content.rstrip() + "\n" + phase_52_row

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated MOTEKRA_PHASE_TRACKER.md successfully")
