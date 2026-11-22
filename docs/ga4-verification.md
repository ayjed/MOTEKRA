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
- [x] Check GA4 collect requests after consent rejection in Chrome (November 22; no matching requests observed).
- [ ] Check for duplicate pageviews during client-side navigation.
- [ ] Verify successful contact-form conversion tracking.
- [ ] Check for analytics-related browser console errors.
- [ ] Repeat verification on mobile.

## Verification — November 22, 2026

### Consent rejection test

**Environment**
- Website: MOTEKRA production
- Browser: Google Chrome (Incognito)
- Page: `/contact`
- Tool: Chrome DevTools → Network
- Request filter: `collect`
- Preserve log: Enabled

**Actions performed**
1. Opened the website in an incognito session.
2. Selected **Decline** on the analytics consent banner.
3. Navigated through the website to the Contact page.
4. Filtered network requests using `collect`.
5. Refreshed the Contact page and inspected the filtered requests.

**Observed results**
- [x] Analytics consent was declined.
- [x] No requests matching `collect` were observed during the recorded navigation.
- [x] No requests matching `collect` were observed after refreshing the Contact page.

**Assessment**

The test found no GA4 collection requests matching the selected filter after analytics consent was declined.

This supports the expected consent-rejection behavior in the tested Chrome session. It does not establish that all analytics requests are blocked across every endpoint, browser, or device.

**Further verification**
- [ ] Inspect additional GA4 and Google Tag request endpoints.
- [ ] Confirm analytics storage behavior after consent rejection.
- [ ] Repeat the test on mobile.
- [ ] Verify that accepting consent enables the expected tracking behavior.

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
