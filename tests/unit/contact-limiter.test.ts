import { describe, expect, it } from "vitest";
import { createContactLimiter, contactLimiter } from "@/lib/contact/rate-limit";

describe("Rate Limiter - Basic request limits", () => {
  it("accepts the first request within a fresh quota", () => {
    const limiter = createContactLimiter();
    const result = limiter.take([{ key: "ip:127.0.0.1", limit: 3, windowMs: 60_000 }], 1_000_000);
    expect(result).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("accepts all requests up to the exact configured limit", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "ip:127.0.0.1", limit: 3, windowMs: 60_000 }];
    const now = 1_000_000;

    expect(limiter.take(quota, now)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, now + 100)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, now + 200)).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("rejects the first request exceeding the limit", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "ip:127.0.0.1", limit: 2, windowMs: 60_000 }];
    const now = 1_000_000;

    expect(limiter.take(quota, now)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, now + 500)).toEqual({ allowed: true, retryAfter: 0 });

    const rejected = limiter.take(quota, now + 1000);
    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfter).toBe(59); // ceil((1_060_000 - 1_001_000) / 1000) = 59
  });

  it("continues to reject subsequent requests while inside the active window", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "user:test", limit: 1, windowMs: 30_000 }];
    const now = 500_000;

    expect(limiter.take(quota, now).allowed).toBe(true);

    const res2 = limiter.take(quota, now + 5000);
    expect(res2.allowed).toBe(false);
    expect(res2.retryAfter).toBe(25);

    const res3 = limiter.take(quota, now + 10_000);
    expect(res3.allowed).toBe(false);
    expect(res3.retryAfter).toBe(20);

    const res4 = limiter.take(quota, now + 29_000);
    expect(res4.allowed).toBe(false);
    expect(res4.retryAfter).toBe(1);
  });

  it("returns allowed: true and retryAfter: 0 for every accepted request", () => {
    const limiter = createContactLimiter();
    for (let i = 0; i < 5; i++) {
      const res = limiter.take([{ key: "batch:test", limit: 10, windowMs: 10_000 }], 1000 + i * 100);
      expect(res.allowed).toBe(true);
      expect(res.retryAfter).toBe(0);
    }
  });
});

describe("Rate Limiter - Time-window behavior", () => {
  it("counts requests within the current fixed window", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "window:test", limit: 3, windowMs: 10_000 }];
    const start = 100_000;

    expect(limiter.take(quota, start).allowed).toBe(true);
    expect(limiter.take(quota, start + 3000).allowed).toBe(true);
    expect(limiter.take(quota, start + 7000).allowed).toBe(true);
    expect(limiter.take(quota, start + 8000).allowed).toBe(false);
  });

  it("rejects immediately before window expiration (expires - 1ms)", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "window:boundary", limit: 1, windowMs: 10_000 }];
    const start = 100_000;

    expect(limiter.take(quota, start).allowed).toBe(true);

    // 1ms before expiration: now = 109_999 (expires is 110_000)
    const rejected = limiter.take(quota, start + 9999);
    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfter).toBe(1); // ceil(1 / 1000) = 1
  });

  it("accepts a request at the exact expiration timestamp (expires)", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "window:boundary", limit: 1, windowMs: 10_000 }];
    const start = 100_000;

    expect(limiter.take(quota, start).allowed).toBe(true);

    // Exactly at expiration: now = 110_000 (bucket.expires <= now is true)
    const accepted = limiter.take(quota, start + 10_000);
    expect(accepted).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("accepts requests well after expiration and resets the quota count", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "window:reset", limit: 2, windowMs: 5000 }];
    const start = 200_000;

    expect(limiter.take(quota, start).allowed).toBe(true);
    expect(limiter.take(quota, start + 1000).allowed).toBe(true);
    expect(limiter.take(quota, start + 2000).allowed).toBe(false);

    // After expiration at start + 20_000
    expect(limiter.take(quota, start + 20_000)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, start + 21_000)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, start + 22_000).allowed).toBe(false);
  });

  it("initializes the next fixed window based on the timestamp of the new request", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "window:reinit", limit: 1, windowMs: 10_000 }];
    const start = 100_000;

    expect(limiter.take(quota, start).allowed).toBe(true); // expires at 110_000

    // Request arrives at 125_000 (15s after first window expired)
    const newReq = limiter.take(quota, 125_000);
    expect(newReq.allowed).toBe(true); // new window expires at 135_000

    // At 134_000, rejected because new window hasn't expired yet
    const inBetween = limiter.take(quota, 134_000);
    expect(inBetween.allowed).toBe(false);
    expect(inBetween.retryAfter).toBe(1); // ceil((135_000 - 134_000) / 1000) = 1

    // At 135_000, new window expires
    expect(limiter.take(quota, 135_000).allowed).toBe(true);
  });

  it("confirms the window is fixed and does not slide forward on intermediate requests", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "window:fixed", limit: 3, windowMs: 10_000 }];
    const start = 100_000;

    // Window begins at 100_000; expires at 110_000
    expect(limiter.take(quota, start).allowed).toBe(true);
    expect(limiter.take(quota, start + 4000).allowed).toBe(true);
    expect(limiter.take(quota, start + 8000).allowed).toBe(true);

    // Limit reached; rejected at start + 9000
    expect(limiter.take(quota, start + 9000).allowed).toBe(false);

    // In a sliding window with windowMs=10_000, a request at start+8000 would not expire until start+18_000.
    // In this fixed window implementation, the bucket expires at start+10_000.
    const atFixedExpiry = limiter.take(quota, start + 10_000);
    expect(atFixedExpiry.allowed).toBe(true);
  });
});

describe("Rate Limiter - Retry-After calculations", () => {
  it("rounds partial seconds up to the nearest integer with Math.ceil", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "retry:ceil", limit: 1, windowMs: 10_000 }];
    const start = 50_000; // expires at 60_000

    limiter.take(quota, start);

    // Remaining: 60_000 - 55_800 = 4200ms -> ceil(4.2) = 5
    expect(limiter.take(quota, 55_800).retryAfter).toBe(5);

    // Remaining: 60_000 - 55_001 = 4999ms -> ceil(4.999) = 5
    expect(limiter.take(quota, 55_001).retryAfter).toBe(5);

    // Remaining: 60_000 - 56_999 = 3001ms -> ceil(3.001) = 4
    expect(limiter.take(quota, 56_999).retryAfter).toBe(4);
  });

  it("handles exact integer seconds cleanly without rounding up an extra second", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "retry:exact", limit: 1, windowMs: 10_000 }];
    const start = 50_000; // expires at 60_000

    limiter.take(quota, start);

    // Remaining: 60_000 - 56_000 = 4000ms -> 4
    expect(limiter.take(quota, 56_000).retryAfter).toBe(4);

    // Remaining: 60_000 - 59_000 = 1000ms -> 1
    expect(limiter.take(quota, 59_000).retryAfter).toBe(1);
  });

  it("enforces minimum Retry-After of 1 second for sub-second remaining durations", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "retry:subsecond", limit: 1, windowMs: 10_000 }];
    const start = 100_000; // expires at 110_000

    limiter.take(quota, start);

    // 500ms remaining -> ceil(0.5) = 1
    expect(limiter.take(quota, 109_500).retryAfter).toBe(1);

    // 100ms remaining -> ceil(0.1) = 1
    expect(limiter.take(quota, 109_900).retryAfter).toBe(1);

    // 1ms remaining -> ceil(0.001) = 1
    expect(limiter.take(quota, 109_999).retryAfter).toBe(1);
  });

  it("never returns a retryAfter value below 1 when request is rejected", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "retry:min", limit: 1, windowMs: 1000 }];
    const start = 10_000; // expires at 11_000

    limiter.take(quota, start);

    for (const offset of [100, 500, 800, 950, 999]) {
      const res = limiter.take(quota, start + offset);
      expect(res.allowed).toBe(false);
      expect(res.retryAfter).toBeGreaterThanOrEqual(1);
    }
  });

  it("produces deterministic retryAfter values across known chronological steps", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "retry:timeline", limit: 1, windowMs: 60_000 }];
    const start = 1_000_000; // expires at 1_060_000

    limiter.take(quota, start);

    const timeline = [
      { now: 1_010_000, expected: 50 }, // 50,000ms left -> 50s
      { now: 1_025_500, expected: 35 }, // 34,500ms left -> 35s
      { now: 1_045_001, expected: 15 }, // 14,999ms left -> 15s
      { now: 1_058_200, expected: 2 },  // 1,800ms left  -> 2s
      { now: 1_059_999, expected: 1 },  // 1ms left      -> 1s
    ];

    for (const step of timeline) {
      const res = limiter.take(quota, step.now);
      expect(res.allowed).toBe(false);
      expect(res.retryAfter).toBe(step.expected);
    }
  });
});

describe("Rate Limiter - Multiple simultaneous quotas", () => {
  it("accepts request when all quotas have available capacity", () => {
    const limiter = createContactLimiter();
    const quotas = [
      { key: "ip:192.168.1.1", limit: 5, windowMs: 60_000 },
      { key: "email:user@test.org", limit: 3, windowMs: 60_000 },
    ];
    const now = 100_000;

    expect(limiter.take(quotas, now)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quotas, now + 100)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quotas, now + 200)).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("rejects request if any single quota in the list is exhausted", () => {
    const limiter = createContactLimiter();
    const quotas = [
      { key: "ip:192.168.1.1", limit: 5, windowMs: 60_000 },
      { key: "email:user@test.org", limit: 2, windowMs: 60_000 },
    ];
    const now = 100_000;

    expect(limiter.take(quotas, now).allowed).toBe(true);
    expect(limiter.take(quotas, now + 100).allowed).toBe(true);

    const rejected = limiter.take(quotas, now + 200);
    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfter).toBeGreaterThanOrEqual(1);
  });

  it("does not increment counters of unexhausted quotas when another quota in the call fails", () => {
    const limiter = createContactLimiter();
    const sharedIp = { key: "ip:shared", limit: 3, windowMs: 60_000 };
    const emailA = { key: "email:a@test.org", limit: 1, windowMs: 60_000 };
    const emailB = { key: "email:b@test.org", limit: 5, windowMs: 60_000 };
    const now = 100_000;

    // Call 1: IP + EmailA -> both at count 1
    expect(limiter.take([sharedIp, emailA], now).allowed).toBe(true);

    // Call 2: IP + EmailA -> EmailA is exhausted (count 1 >= limit 1)
    // Pass 2 checks all limits before Pass 3 increments anything -> sharedIp must NOT increment to 2
    const failed = limiter.take([sharedIp, emailA], now + 500);
    expect(failed.allowed).toBe(false);

    // Call 3: IP + EmailB -> sharedIp count must still be 1, so it allows call 3
    expect(limiter.take([sharedIp, emailB], now + 1000).allowed).toBe(true); // sharedIp count now 2

    // Call 4: IP + EmailB -> sharedIp count becomes 3 (limit reached)
    expect(limiter.take([sharedIp, emailB], now + 1500).allowed).toBe(true);

    // Call 5: IP + EmailB -> sharedIp now exhausted
    expect(limiter.take([sharedIp, emailB], now + 2000).allowed).toBe(false);
  });

  it("tracks multiple independent quota keys without cross-talk", () => {
    const limiter = createContactLimiter();
    const quotaA = [{ key: "client:alpha", limit: 1, windowMs: 10_000 }];
    const quotaB = [{ key: "client:beta", limit: 1, windowMs: 10_000 }];
    const now = 100_000;

    expect(limiter.take(quotaA, now).allowed).toBe(true);
    expect(limiter.take(quotaB, now).allowed).toBe(true);

    expect(limiter.take(quotaA, now + 100).allowed).toBe(false);
    expect(limiter.take(quotaB, now + 100).allowed).toBe(false);
  });

  it("does not let expiration of one quota prematurely reset another active quota", () => {
    const limiter = createContactLimiter();
    const shortQuota = { key: "short", limit: 1, windowMs: 5000 };
    const longQuota = { key: "long", limit: 2, windowMs: 20_000 };
    const now = 100_000;

    expect(limiter.take([shortQuota, longQuota], now).allowed).toBe(true);

    // At 106_000: shortQuota has expired (100_000 + 5000 <= 106_000), but longQuota (expires 120_000) has NOT
    expect(limiter.take([shortQuota], now + 6000).allowed).toBe(true);

    // longQuota already has count 1 from the first request; second request reaches limit 2
    expect(limiter.take([longQuota], now + 7000).allowed).toBe(true);

    // Third request for longQuota is rejected
    expect(limiter.take([longQuota], now + 8000).allowed).toBe(false);
  });

  it("simulates Motekra contact form multi-tier quota hierarchy", () => {
    const limiter = createContactLimiter();
    const globalQuota = { key: "global", limit: 30, windowMs: 3_600_000 }; // 30/hr
    const ipQuota = { key: "ip:203.0.113.1", limit: 5, windowMs: 900_000 }; // 5/15m
    const emailQuota = { key: "email:lead@client.com", limit: 3, windowMs: 3_600_000 }; // 3/hr
    const now = 10_000;

    // First 3 requests from same email & IP pass all tiers
    for (let i = 0; i < 3; i++) {
      expect(limiter.take([globalQuota, ipQuota, emailQuota], now + i * 1000).allowed).toBe(true);
    }

    // 4th request from same email is rejected by emailQuota tier
    const emailExhausted = limiter.take([globalQuota, ipQuota, emailQuota], now + 4000);
    expect(emailExhausted.allowed).toBe(false);

    // Different email from same IP still has 2 requests remaining in ipQuota (takes 4 and 5)
    const email2Quota = { key: "email:partner@client.com", limit: 3, windowMs: 3_600_000 };
    expect(limiter.take([globalQuota, ipQuota, email2Quota], now + 5000).allowed).toBe(true);
    expect(limiter.take([globalQuota, ipQuota, email2Quota], now + 6000).allowed).toBe(true);

    // 6th request from same IP is rejected by ipQuota tier
    const email3Quota = { key: "email:other@client.com", limit: 3, windowMs: 3_600_000 };
    const ipExhausted = limiter.take([globalQuota, ipQuota, email3Quota], now + 7000);
    expect(ipExhausted.allowed).toBe(false);
  });
});

describe("Rate Limiter - Instance isolation", () => {
  it("creates completely independent limiter instances", () => {
    const limiterA = createContactLimiter();
    const limiterB = createContactLimiter();
    const quota = [{ key: "test:key", limit: 1, windowMs: 10_000 }];
    const now = 100_000;

    expect(limiterA.take(quota, now).allowed).toBe(true);
    expect(limiterA.take(quota, now + 100).allowed).toBe(false);

    expect(limiterB.take(quota, now + 200).allowed).toBe(true);
  });

  it("ensures rejections on one instance do not affect another instance", () => {
    const limiterA = createContactLimiter();
    const limiterB = createContactLimiter();
    const quota = [{ key: "isolated", limit: 2, windowMs: 10_000 }];
    const now = 100_000;

    limiterA.take(quota, now);
    limiterA.take(quota, now + 100);
    expect(limiterA.take(quota, now + 200).allowed).toBe(false);

    expect(limiterB.take(quota, now + 300).allowed).toBe(true);
    expect(limiterB.take(quota, now + 400).allowed).toBe(true);
    expect(limiterB.take(quota, now + 500).allowed).toBe(false);
  });

  it("verifies exported contactLimiter has distinct state from newly created instances", () => {
    const customLimiter = createContactLimiter();
    const uniqueKey = `shared-test-${Date.now()}-${Math.random()}`;
    const quota = [{ key: uniqueKey, limit: 1, windowMs: 60_000 }];
    const now = 1_000_000;

    expect(contactLimiter.take(quota, now).allowed).toBe(true);
    expect(contactLimiter.take(quota, now + 100).allowed).toBe(false);

    expect(customLimiter.take(quota, now + 200).allowed).toBe(true);
  });

  it("confirms multiple instances do not share closures or bucket references", () => {
    const instances = Array.from({ length: 5 }, () => createContactLimiter());
    const quota = [{ key: "shared-name", limit: 1, windowMs: 5000 }];
    const now = 50_000;

    for (const inst of instances) {
      expect(inst.take(quota, now).allowed).toBe(true);
      expect(inst.take(quota, now + 100).allowed).toBe(false);
    }
  });
});

describe("Rate Limiter - Expired bucket cleanup", () => {
  it("removes expired buckets so they no longer restrict requests", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "cleanup:1", limit: 1, windowMs: 5000 }];
    const start = 100_000;

    expect(limiter.take(quota, start).allowed).toBe(true);
    expect(limiter.take(quota, start + 1000).allowed).toBe(false);

    const postCleanup = limiter.take(quota, start + 5000);
    expect(postCleanup).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("triggers sweep of expired buckets during subsequent take() calls with unrelated keys", () => {
    const limiter = createContactLimiter();
    const key1 = [{ key: "stale:target", limit: 1, windowMs: 3000 }];
    const key2 = [{ key: "unrelated:trigger", limit: 1, windowMs: 10_000 }];
    const start = 100_000;

    limiter.take(key1, start);

    expect(limiter.take(key2, start + 5000).allowed).toBe(true);

    const resKey1 = limiter.take(key1, start + 5000);
    expect(resKey1).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("cleans up multiple independently expired buckets in a single sweep", () => {
    const limiter = createContactLimiter();
    const start = 100_000;

    for (let i = 1; i <= 10; i++) {
      limiter.take([{ key: `multi:key:${i}`, limit: 1, windowMs: i * 1000 }], start);
    }

    const trigger = limiter.take([{ key: "sweep:trigger", limit: 1, windowMs: 10_000 }], start + 15_000);
    expect(trigger.allowed).toBe(true);

    for (let i = 1; i <= 10; i++) {
      expect(limiter.take([{ key: `multi:key:${i}`, limit: 1, windowMs: 5000 }], start + 15_000).allowed).toBe(true);
    }
  });

  it("verifies bucket cleanup purely through public interface without unsupported memory assertions", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "contract:key", limit: 2, windowMs: 4000 }];
    const start = 50_000;

    expect(limiter.take(quota, start).allowed).toBe(true);
    expect(limiter.take(quota, start + 1000).allowed).toBe(true);
    expect(limiter.take(quota, start + 2000).allowed).toBe(false);

    expect(limiter.take(quota, start + 4000).allowed).toBe(true);
    expect(limiter.take(quota, start + 5000).allowed).toBe(true);
    expect(limiter.take(quota, start + 6000).allowed).toBe(false);
  });
});

describe("Rate Limiter - Regression and edge cases", () => {
  it("handles empty quota array gracefully", () => {
    const limiter = createContactLimiter();
    const result = limiter.take([], 100_000);
    expect(result).toEqual({ allowed: true, retryAfter: 0 });
  });

  it("handles repeated calls with the exact same millisecond timestamp", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "same:timestamp", limit: 3, windowMs: 10_000 }];
    const identicalTime = 123_456_789;

    expect(limiter.take(quota, identicalTime)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, identicalTime)).toEqual({ allowed: true, retryAfter: 0 });
    expect(limiter.take(quota, identicalTime)).toEqual({ allowed: true, retryAfter: 0 });

    const fourth = limiter.take(quota, identicalTime);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfter).toBe(10); // 10_000ms / 1000 = 10s
  });

  it("handles multiple keys sharing the exact same expiration timestamp", () => {
    const limiter = createContactLimiter();
    const t0 = 500_000;
    const windowMs = 5000;

    const quotaA = [{ key: "sync:a", limit: 1, windowMs }];
    const quotaB = [{ key: "sync:b", limit: 1, windowMs }];

    expect(limiter.take(quotaA, t0).allowed).toBe(true);
    expect(limiter.take(quotaB, t0).allowed).toBe(true);

    expect(limiter.take(quotaA, t0 + 2000).allowed).toBe(false);
    expect(limiter.take(quotaB, t0 + 2000).allowed).toBe(false);

    expect(limiter.take(quotaA, t0 + 5000).allowed).toBe(true);
    expect(limiter.take(quotaB, t0 + 5000).allowed).toBe(true);
  });

  it("handles large valid quota limits reliably", () => {
    const limiter = createContactLimiter();
    const largeLimit = 500;
    const quota = [{ key: "large:volume", limit: largeLimit, windowMs: 60_000 }];
    const t0 = 1_000_000;

    for (let i = 0; i < largeLimit; i++) {
      const res = limiter.take(quota, t0 + i);
      expect(res.allowed).toBe(true);
      expect(res.retryAfter).toBe(0);
    }

    const excess = limiter.take(quota, t0 + largeLimit);
    expect(excess.allowed).toBe(false);
    expect(excess.retryAfter).toBeGreaterThanOrEqual(1);
  });

  it("maintains stable behavior across multiple successive fixed windows", () => {
    const limiter = createContactLimiter();
    const limit = 2;
    const windowMs = 5000;
    const quota = [{ key: "successive:cycles", limit, windowMs }];
    let currentTime = 100_000;

    for (let cycle = 0; cycle < 4; cycle++) {
      expect(limiter.take(quota, currentTime)).toEqual({ allowed: true, retryAfter: 0 });
      expect(limiter.take(quota, currentTime + 500)).toEqual({ allowed: true, retryAfter: 0 });

      const rejected = limiter.take(quota, currentTime + 1000);
      expect(rejected.allowed).toBe(false);
      expect(rejected.retryAfter).toBe(4);

      currentTime += windowMs;
    }
  });

  it("documents behavior when duplicate quota keys are supplied in a single take() call", () => {
    const limiter = createContactLimiter();
    const dupQuotas = [
      { key: "dup:key", limit: 2, windowMs: 10_000 },
      { key: "dup:key", limit: 2, windowMs: 10_000 },
    ];
    const now = 100_000;

    // Call 1: initializes bucket, increments twice -> count reaches 2 in a single call
    const call1 = limiter.take(dupQuotas, now);
    expect(call1.allowed).toBe(true);

    // Call 2: bucket count is already 2 (>= limit 2) -> rejected
    const call2 = limiter.take([{ key: "dup:key", limit: 2, windowMs: 10_000 }], now + 100);
    expect(call2.allowed).toBe(false);
  });

  it("documents behavior when clock moves backward (negative delta)", () => {
    const limiter = createContactLimiter();
    const quota = [{ key: "backward:clock", limit: 2, windowMs: 10_000 }];
    const t0 = 100_000; // expires at 110_000

    expect(limiter.take(quota, t0).allowed).toBe(true);

    // System clock jumps backward by 5 seconds: now = 95_000
    // bucket.expires (110_000) <= now (95_000) is FALSE, bucket is not evicted, count becomes 2
    expect(limiter.take(quota, t0 - 5000).allowed).toBe(true);

    // 3rd call at backward timestamp (count is 2 >= limit 2) -> rejected
    // retryAfter = ceil((110_000 - 95_000) / 1000) = 15s
    const rejected = limiter.take(quota, t0 - 5000);
    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfter).toBe(15);
  });
});

