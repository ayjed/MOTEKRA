import { afterEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error No type declarations for production-build.mjs
import * as prodBuild from "../../scripts/production-build.mjs";

const {
  buildProductionEnv,
  getProductionVariables,
  parseWranglerVars,
  validateProductionVars,
} = prodBuild;

describe("Production Build Workflow Hardening (Issue 07 PR #16)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("1. Correct production configuration reads and validates wrangler.jsonc without silent fallbacks", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "");

    const prodVars = getProductionVariables();
    expect(prodVars.SITE_URL).toBe("https://www.motekra.com");
    expect(prodVars.SITE_INDEXABLE).toBe("true");

    const env = buildProductionEnv();
    expect(env.SITE_URL).toBe("https://www.motekra.com");
    expect(env.SITE_INDEXABLE).toBe("true");
    expect(env.NODE_ENV).toBe("production");
  });

  it("2. Missing production SITE_INDEXABLE fails production build with a clear error", () => {
    // Missing SITE_INDEXABLE
    expect(() => {
      validateProductionVars({
        SITE_URL: "https://www.motekra.com",
      });
    }).toThrowError(/SITE_INDEXABLE.*missing/i);

    // Empty SITE_INDEXABLE
    expect(() => {
      validateProductionVars({
        SITE_URL: "https://www.motekra.com",
        SITE_INDEXABLE: "",
      });
    }).toThrowError(/SITE_INDEXABLE.*missing/i);

    // Invalid non-boolean SITE_INDEXABLE
    expect(() => {
      validateProductionVars({
        SITE_URL: "https://www.motekra.com",
        SITE_INDEXABLE: "invalid-value",
      });
    }).toThrowError(/SITE_INDEXABLE.*must be 'true' or 'false'/i);
  });

  it("3. Missing production SITE_URL fails production build with a clear error", () => {
    // Missing SITE_URL
    expect(() => {
      validateProductionVars({
        SITE_INDEXABLE: "true",
      });
    }).toThrowError(/SITE_URL.*missing or empty/i);

    // Empty SITE_URL
    expect(() => {
      validateProductionVars({
        SITE_URL: "   ",
        SITE_INDEXABLE: "true",
      });
    }).toThrowError(/SITE_URL.*missing or empty/i);

    // Invalid URL string
    expect(() => {
      validateProductionVars({
        SITE_URL: "not-a-valid-url",
        SITE_INDEXABLE: "true",
      });
    }).toThrowError(/SITE_URL.*not a valid URL/i);

    // Non-HTTPS protocol
    expect(() => {
      validateProductionVars({
        SITE_URL: "http://www.motekra.com",
        SITE_INDEXABLE: "true",
      });
    }).toThrowError(/SITE_URL.*must use HTTPS/i);
  });

  it("4. Staging URL override without an explicit indexing flag defaults safely to non-indexable", () => {
    // Caller overrides origin to staging, but omits SITE_INDEXABLE
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "");

    const env = buildProductionEnv({
      SITE_URL: "https://staging.motekra.com",
      // SITE_INDEXABLE omitted intentionally
    });

    expect(env.SITE_URL).toBe("https://staging.motekra.com");
    // MUST NOT inherit SITE_INDEXABLE=true from wrangler.jsonc!
    expect(env.SITE_INDEXABLE).toBe("false");
  });

  it("5. Staging URL with SITE_INDEXABLE=false preserves staging origin and explicit non-indexable setting", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("SITE_INDEXABLE", "");

    const env = buildProductionEnv({
      SITE_URL: "https://staging.motekra.com",
      SITE_INDEXABLE: "false",
    });

    expect(env.SITE_URL).toBe("https://staging.motekra.com");
    expect(env.SITE_INDEXABLE).toBe("false");
  });

  it("parses JSONC configuration with comments without error", () => {
    const rawSample = `
    {
      // Comment line
      "name": "motekra",
      // Another comment
      "vars": {
        "SITE_URL": "https://www.motekra.com",
        "SITE_INDEXABLE": "true"
      }
    }
    `;
    const vars = parseWranglerVars(rawSample);
    expect(vars.SITE_URL).toBe("https://www.motekra.com");
    expect(vars.SITE_INDEXABLE).toBe("true");
  });
});
