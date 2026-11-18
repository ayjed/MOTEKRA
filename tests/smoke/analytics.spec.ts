import { expect, test } from "@playwright/test";

test.describe("MOTEKRA Google Analytics 4 Browser Integration", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("1. No GA4 network requests before consent", async ({ page }) => {
    const gaRequests: string[] = [];
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      gaRequests.push(route.request().url());
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    await page.goto("http://localhost:3000/");

    // Wait for hydration and banner appearance
    await expect(page.locator(".consent-banner-wrapper")).toBeVisible({ timeout: 10000 });

    // Verify zero network requests were made to Google
    expect(gaRequests).toHaveLength(0);

    // Verify gtag script is not injected in DOM
    const scriptCount = await page.locator("#ga4-script").count();
    expect(scriptCount).toBe(0);

    // Verify dataLayer is undefined or empty
    const dataLayerExists = await page.evaluate(() => Boolean(window.dataLayer && window.dataLayer.length > 0));
    expect(dataLayerExists).toBe(false);
  });

  test("2. Accept loads tracking exactly once", async ({ page }) => {
    const gaRequests: string[] = [];
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      gaRequests.push(route.request().url());
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    await page.goto("http://localhost:3000/");
    await expect(page.locator(".consent-banner-wrapper")).toBeVisible();

    // Click Accept Analytics
    const acceptBtn = page.getByRole("button", { name: "Accept Analytics" });
    await acceptBtn.click();

    // Verify banner closes
    await expect(page.locator(".consent-banner-wrapper")).not.toBeVisible();

    // Verify script tag is added
    await expect(page.locator("#ga4-script")).toHaveCount(1);
    const scriptSrc = await page.locator("#ga4-script").getAttribute("src");
    expect(scriptSrc).toContain("G-D521RGZ87P");

    // Verify network request to gtag.js occurred
    expect(gaRequests.some((url) => url.includes("googletagmanager.com/gtag/js"))).toBe(true);

    // Verify stored preference in localStorage
    const storedConsent = await page.evaluate(() => localStorage.getItem("motekra_analytics_consent"));
    expect(storedConsent).toBe("granted");

    // Verify dataLayer contains consent default, update, config, and initial page_view
    const dataLayerEvents = await page.evaluate(() => {
      return (window.dataLayer || []).map((args) => Array.from(args as unknown[]));
    });

    const hasConsentDefault = dataLayerEvents.some(
      (ev) => ev[0] === "consent" && ev[1] === "default"
    );
    const hasConsentUpdate = dataLayerEvents.some(
      (ev) => ev[0] === "consent" && ev[1] === "update" && (ev[2] as Record<string, string>)?.analytics_storage === "granted"
    );
    const hasPageView = dataLayerEvents.some(
      (ev) => ev[0] === "event" && ev[1] === "page_view"
    );

    expect(hasConsentDefault).toBe(true);
    expect(hasConsentUpdate).toBe(true);
    expect(hasPageView).toBe(true);
  });

  test("3. Decline prevents tracking and persists across reloads", async ({ page }) => {
    const gaRequests: string[] = [];
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      gaRequests.push(route.request().url());
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    await page.goto("http://localhost:3000/");
    await expect(page.locator(".consent-banner-wrapper")).toBeVisible();

    // Click Decline
    const declineBtn = page.getByRole("button", { name: "Decline" });
    await declineBtn.click();

    await expect(page.locator(".consent-banner-wrapper")).not.toBeVisible();

    // Verify zero requests to Google
    expect(gaRequests).toHaveLength(0);
    expect(await page.locator("#ga4-script").count()).toBe(0);

    // Reload page
    await page.reload();

    // Banner stays hidden and zero requests are made
    await expect(page.locator(".consent-banner-wrapper")).not.toBeVisible();
    expect(gaRequests).toHaveLength(0);
    expect(await page.locator("#ga4-script").count()).toBe(0);

    const storedConsent = await page.evaluate(() => localStorage.getItem("motekra_analytics_consent"));
    expect(storedConsent).toBe("denied");
  });

  test("4. Navigation produces one pageview per route", async ({ page }) => {
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    // Set consent to granted before navigating
    await page.addInitScript(() => {
      localStorage.setItem("motekra_analytics_consent", "granted");
    });

    await page.goto("http://localhost:3000/");
    await page.waitForTimeout(500);

    // Helper to get all page_view events from dataLayer
    const getPageViews = async () => {
      return page.evaluate(() => {
        return (window.dataLayer || [])
          .filter((args) => {
            const arr = Array.from(args as unknown[]);
            return arr[0] === "event" && arr[1] === "page_view";
          })
          .map((args) => {
            const arr = Array.from(args as unknown[]);
            return (arr[2] as Record<string, string>)?.page_path;
          });
      });
    };

    const initialViews = await getPageViews();
    expect(initialViews).toEqual(["/"]);

    // Navigate to /work via header navigation link
    await page.locator("header nav").getByRole("link", { name: "Work" }).click();
    await page.waitForURL("**/work");
    await page.waitForTimeout(500);

    const viewsAfterWork = await getPageViews();
    expect(viewsAfterWork).toEqual(["/", "/work"]);

    // Navigate to /about
    await page.locator("header nav").getByRole("link", { name: "About" }).click();
    await page.waitForURL("**/about");
    await page.waitForTimeout(500);

    const viewsAfterAbout = await getPageViews();
    expect(viewsAfterAbout).toEqual(["/", "/work", "/about"]);
  });

  test("5. Contact failures produce no generate_lead event", async ({ page }) => {
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    // Mock API failure
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({ json: { available: true } });
      }
      return route.fulfill({
        status: 500,
        json: { ok: false, message: "Delivery failed" },
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem("motekra_analytics_consent", "granted");
    });

    await page.goto("http://localhost:3000/contact");

    // Fill contact form
    await page.locator("#name").fill("Test Lead");
    await page.locator("#email").fill("test-lead@example.com");
    await page.locator("#projectType").selectOption("web-development");
    await page.locator("#message").fill("This is a failure test for lead tracking verification.");

    // Submit form
    await page.getByRole("button", { name: /Send Inquiry/i }).click();

    // Wait for error alert
    await expect(page.locator(".inquiry-result[role=alert]")).toBeVisible();

    // Verify generate_lead was NOT dispatched
    const hasLeadEvent = await page.evaluate(() => {
      return (window.dataLayer || []).some((args) => {
        const arr = Array.from(args as unknown[]);
        return arr[0] === "event" && arr[1] === "generate_lead";
      });
    });
    expect(hasLeadEvent).toBe(false);
  });

  test("6. Successful inquiries produce exactly one lead event without PII", async ({ page }) => {
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    // Mock API success
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({ json: { available: true } });
      }
      return route.fulfill({
        status: 200,
        json: { ok: true, message: "Inquiry received successfully", reference: "ref_lead_123" },
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem("motekra_analytics_consent", "granted");
    });

    await page.goto("http://localhost:3000/contact");

    await page.locator("#name").fill("Alice Lead");
    await page.locator("#email").fill("alice-lead@example.com");
    await page.locator("#projectType").selectOption("web-development");
    await page.locator("#message").fill("Legitimate inquiry for testing lead event generation.");

    await page.getByRole("button", { name: /Send Inquiry/i }).click();

    // Wait for success message
    await expect(page.locator(".inquiry-result")).toContainText("Inquiry received successfully");

    // Verify generate_lead event in dataLayer
    const leadEvents = await page.evaluate(() => {
      return (window.dataLayer || []).filter((args) => {
        const arr = Array.from(args as unknown[]);
        return arr[0] === "event" && arr[1] === "generate_lead";
      });
    });

    expect(leadEvents).toHaveLength(1);
    const leadParams = (leadEvents[0] as unknown[])[2] as Record<string, unknown>;
    expect(leadParams.event_category).toBe("engagement");
    expect(leadParams.event_label).toBe("contact_inquiry");

    // Zero PII in event payload
    expect(leadParams).not.toHaveProperty("name");
    expect(leadParams).not.toHaveProperty("email");
    expect(leadParams).not.toHaveProperty("message");
    expect(leadParams).not.toHaveProperty("reference");
  });

  test("7. Footer preferences dialog works by keyboard and traps focus", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("motekra_analytics_consent", "granted");
    });

    await page.goto("http://localhost:3000/");

    // Locate footer cookie preferences button
    const prefButton = page.locator(".footer-cookie-btn");
    await prefButton.scrollIntoViewIfNeeded();
    await prefButton.focus();

    // Press Enter to open preferences
    await page.keyboard.press("Enter");

    // Dialog should open
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Focus should be inside dialog
    const focusedInsideDialog = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal?.contains(document.activeElement) ?? false;
    });
    expect(focusedInsideDialog).toBe(true);

    // Test Tab wrap: press Tab multiple times to verify focus wraps within dialog
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("Tab");
      const stillInside = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        return modal?.contains(document.activeElement) ?? false;
      });
      expect(stillInside).toBe(true);
    }

    // Press Escape to close dialog
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("8. Focus returns correctly to trigger button when dialog closes", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("motekra_analytics_consent", "granted");
    });

    await page.goto("http://localhost:3000/");

    const prefButton = page.locator(".footer-cookie-btn");
    await prefButton.scrollIntoViewIfNeeded();
    await prefButton.focus();

    // Open via Enter key
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Close via close button click
    const closeBtn = page.getByRole("button", { name: "Close preferences dialog" });
    await closeBtn.click();

    await expect(dialog).not.toBeVisible();

    // Verify focus returned to the Cookie Preferences button
    const isFocusRestored = await page.evaluate(() => {
      const btn = document.querySelector(".footer-cookie-btn");
      return document.activeElement === btn;
    });
    expect(isFocusRestored).toBe(true);
  });

  test("9. Revoking consent stops further analytics", async ({ page }) => {
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    });

    await page.goto("http://localhost:3000/");

    // 1. Accept analytics first via banner
    const acceptBtn = page.getByRole("button", { name: "Accept Analytics" });
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();
    await page.waitForTimeout(300);

    const initialConsent = await page.evaluate(() => localStorage.getItem("motekra_analytics_consent"));
    expect(initialConsent).toBe("granted");

    // 2. Open preferences and revoke
    const prefButton = page.locator(".footer-cookie-btn");
    await prefButton.scrollIntoViewIfNeeded();
    await prefButton.click();

    const revokeBtn = page.getByRole("button", { name: "Revoke / Disable Analytics" });
    await expect(revokeBtn).toBeVisible();
    await revokeBtn.click();

    // 3. Wait for reload / state update
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    // 4. Verify ga-disable flag
    const isGaDisabled = await page.evaluate(() => {
      return (window as unknown as Record<string, boolean>)["ga-disable-G-D521RGZ87P"] === true;
    });
    expect(isGaDisabled).toBe(true);

    const storedConsent = await page.evaluate(() => localStorage.getItem("motekra_analytics_consent"));
    expect(storedConsent).toBe("denied");

    // 5. Navigate to /about
    await page.locator("header nav").getByRole("link", { name: "About" }).click();
    await page.waitForURL("**/about");
    await page.waitForTimeout(500);

    // 6. Verify NO new page_view events occurred for /about
    const aboutPageViews = await page.evaluate(() => {
      return (window.dataLayer || []).filter((args) => {
        const arr = Array.from(args as unknown[]);
        return (
          arr[0] === "event" &&
          arr[1] === "page_view" &&
          (arr[2] as Record<string, string>)?.page_path === "/about"
        );
      });
    });
    expect(aboutPageViews).toHaveLength(0);
  });

  test("10. Mobile banner does not obstruct navigation", async ({ page }) => {
    // Mobile viewport (iPhone 14 / modern standard mobile)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("http://localhost:3000/");

    const banner = page.locator(".consent-banner-wrapper");
    await expect(banner).toBeVisible();

    // Check no horizontal scroll overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Check that header logo/brand link is visible and clickable
    const brandLink = page.locator("header a.brand");
    await expect(brandLink).toBeVisible();

    // Verify banner card stays within viewport
    const bannerBox = await banner.boundingBox();
    expect(bannerBox).not.toBeNull();
    if (bannerBox) {
      expect(bannerBox.x).toBeGreaterThanOrEqual(0);
      expect(bannerBox.x + bannerBox.width).toBeLessThanOrEqual(390 + 2);
    }
  });
});
