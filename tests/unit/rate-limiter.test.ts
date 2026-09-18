import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { RateLimiter } from "@/lib/security/rate-limiter";

describe("RateLimiter (F044)", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      chat: { limit: 5, windowMs: 1000, burstLimit: 3, cooldownMs: 2000 },
      auth: { limit: 3, windowMs: 5000 },
      admin: { limit: 100, windowMs: 1000 },
      public: { limit: 10, windowMs: 1000 },
    });
  });

  it("allows initial requests and decrements remaining quota", () => {
    const res1 = limiter.check("test-user-1", "chat");
    expect(res1.allowed).toBe(true);
    expect(res1.limit).toBe(5);
    expect(res1.remaining).toBe(4);

    const res2 = limiter.check("test-user-1", "chat");
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it("blocks requests when limit is exceeded within window", () => {
    const id = "flooder-1";
    // Spend 3 requests (below burst limit of 3)
    limiter.check(id, "auth");
    limiter.check(id, "auth");
    limiter.check(id, "auth");

    // 4th request exceeds limit of 3
    const blocked = limiter.check(id, "auth");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("triggers burst protection cooldown when requests spike within 2 seconds", () => {
    const id = "burst-bot";
    limiter.check(id, "chat");
    limiter.check(id, "chat");
    limiter.check(id, "chat");

    // 4th instant request triggers burst limit (burstLimit: 3)
    const burstBlocked = limiter.check(id, "chat");
    expect(burstBlocked.allowed).toBe(false);
    expect(burstBlocked.retryAfterSeconds).toBe(2); // 2000ms cooldown

    const throttled = limiter.listThrottledClients();
    expect(throttled.length).toBeGreaterThan(0);
    expect(throttled[0]?.reason).toContain("Burst cooldown");
  });

  it("resolves client identifier properly from headers", () => {
    // 1. User ID header
    const reqUser = new NextRequest("http://localhost:3000/api/chat", {
      headers: { "x-user-id": "usr_98765" },
    });
    expect(limiter.resolveClientIdentifier(reqUser)).toBe("user:usr_98765");

    // 2. Forwarded-For proxy header
    const reqProxy = new NextRequest("http://localhost:3000/api/chat", {
      headers: { "x-forwarded-for": "203.0.113.195, 10.0.0.1" },
    });
    expect(limiter.resolveClientIdentifier(reqProxy)).toBe("ip:203.0.113.195");

    // 3. Real IP header
    const reqReal = new NextRequest("http://localhost:3000/api/chat", {
      headers: { "x-real-ip": "198.51.100.42" },
    });
    expect(limiter.resolveClientIdentifier(reqReal)).toBe("ip:198.51.100.42");

    // 4. Default fallback
    const reqDefault = new NextRequest("http://localhost:3000/api/chat");
    expect(limiter.resolveClientIdentifier(reqDefault)).toBe("ip:127.0.0.1");
  });

  it("resets limits when explicitly requested", () => {
    const id = "test-reset";
    limiter.check(id, "auth");
    limiter.check(id, "auth");
    limiter.check(id, "auth");
    expect(limiter.check(id, "auth").allowed).toBe(false);

    limiter.reset(id, "auth");
    expect(limiter.check(id, "auth").allowed).toBe(true);
  });
});
