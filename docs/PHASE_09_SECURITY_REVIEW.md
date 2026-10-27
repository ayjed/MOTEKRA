# Phase 09 security review

2026-10-26. This records a scoped source/dependency review, not a penetration-test certification.

- Dependency advisory evidence: `evidence/phase-09/dependency-audit-before.json`. At capture, pnpm reported zero known advisories in every severity category. Re-run before release; an empty advisory list does not establish absence of vulnerabilities.
- Contact receipt derivation no longer includes the private recipient. A public, known-payload hash must not provide an oracle for guessing a private Gmail address. The regression test checks that changing only the recipient does not change the public reference.
- Recipient, provider key, sender and origin remain server configuration. No personal recipient was inferred from browser/profile data. No actual delivery is claimed. Existing fixture tests cover provider acceptance/rejection, validation, origin, honeypot, body limits, timeout, network errors and quotas.
- The only request-time feature remains the minimal contact email endpoint. No database, authentication, dashboard, CMS, analytics service or paid dependency was introduced.
- Current response headers include nosniff, frame denial, restricted camera/microphone/geolocation and strict-origin referrer policy. Contact responses are no-store/noindex. The native form response has its own restrictive CSP and escaped content.
- Remaining deployment work: a tested site-wide CSP compatible with Next/GSAP/Three, trusted-proxy configuration, host-level abuse controls, TLS/domain configuration, privacy/legal review and genuine inbox delivery. Per-process memory quotas reset and do not coordinate serverless instances. They are not a distributed rate-limit guarantee.
- Public profile/service/project/article schema still follows approval gates. Preview remains noindex, with no invented production origin, phone, address, client outcomes or portrait.

Do not treat these checks as approval to launch or enable a paid service.
