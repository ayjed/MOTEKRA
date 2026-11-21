# GA4 Production Verification

Related issue: #17

## Purpose

Provide a repeatable process for validating Google Analytics 4 tracking after MOTEKRA production deployments.

## Verification — November 21, 2026

### Initial results

- [x] Realtime visitors detected in GA4.
- [x] `page_view` events observed.
- [x] Analytics consent accepted during testing.

These results confirm that pageview data was received after consent. They do not establish that all analytics behavior is correct.

### Remaining checks

- [ ] Verify analytics behavior before consent is granted.
- [ ] Verify analytics behavior after consent is rejected.
- [ ] Check for duplicate pageviews during client-side navigation.
- [ ] Verify successful contact-form conversion tracking.
- [ ] Check for analytics-related browser console errors.
- [ ] Repeat verification on mobile.

## Testing procedure

1. Open the production website in a fresh browser session.
2. Inspect analytics requests before making a consent choice.
3. Accept analytics consent and open GA4 Realtime.
4. Navigate between the main website pages.
5. Compare recorded pageview events with expected navigation events.
6. Test contact-form conversion tracking.
7. Record the results and any reproducible defects.

## Follow-up

Complete the remaining checks before closing Issue #17. Document any defects separately with reproduction steps and expected behavior.
