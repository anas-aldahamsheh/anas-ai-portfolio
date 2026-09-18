import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveRequestContext } from "@/modules/auth/infrastructure/request-context";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";

vi.mock("@/lib/security/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe("Request Context Resolution (infrastructure/request-context.ts)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves clean GuestContext for unauthenticated requests with zero side effects", async () => {
    vi.spyOn(serverAuth, "getCurrentSession").mockResolvedValue(null);

    const context = await resolveRequestContext(new Headers());

    expect(context.isAuthenticated).toBe(false);
    expect(context.isGuest).toBe(true);
    expect(context.role).toBe("GUEST");
    expect(context.user).toBeNull();
    expect(context.session).toBeNull();
  });

  it("resolves AuthenticatedRequestContext for authenticated regular USER", async () => {
    vi.spyOn(serverAuth, "getCurrentSession").mockResolvedValue({
      user: {
        id: "user-123",
        email: "recruiter@company.com",
        name: "Recruiter User",
        image: null,
      },
      session: {
        id: "sess-abc",
        userId: "user-123",
        expiresAt: new Date("2026-12-31"),
        token: "token-xyz",
      },
      role: "USER",
    });

    const context = await resolveRequestContext(new Headers());

    expect(context.isAuthenticated).toBe(true);
    expect(context.isGuest).toBe(false);
    expect(context.role).toBe("USER");
    expect(context.user).not.toBeNull();
    expect(context.user?.id).toBe("user-123");
    expect(context.session?.id).toBe("sess-abc");
  });

  it("resolves AuthenticatedRequestContext for authenticated ADMIN", async () => {
    vi.spyOn(serverAuth, "getCurrentSession").mockResolvedValue({
      user: {
        id: "admin-456",
        email: "admin@anas.ai",
        name: "Anas Admin",
        image: null,
      },
      session: {
        id: "sess-def",
        userId: "admin-456",
        expiresAt: new Date("2026-12-31"),
        token: "admin-token-123",
      },
      role: "ADMIN",
    });

    const context = await resolveRequestContext(new Headers());

    expect(context.isAuthenticated).toBe(true);
    expect(context.isGuest).toBe(false);
    expect(context.role).toBe("ADMIN");
    expect(context.user?.id).toBe("admin-456");
  });

  it("treats GUEST role explicitly returned by session as unauthenticated GuestContext", async () => {
    vi.spyOn(serverAuth, "getCurrentSession").mockResolvedValue({
      user: {
        id: "guest-id",
        email: "guest@ephemeral.local",
        name: "Guest",
        image: null,
      },
      session: {
        id: "guest-sess",
        userId: "guest-id",
        expiresAt: new Date("2026-12-31"),
        token: "guest-token",
      },
      role: "GUEST",
    });

    const context = await resolveRequestContext(new Headers());

    expect(context.isAuthenticated).toBe(false);
    expect(context.isGuest).toBe(true);
    expect(context.role).toBe("GUEST");
    expect(context.user).toBeNull();
    expect(context.session).toBeNull();
  });
});
