import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  requireUser,
  requireAdmin,
  getUserRole,
  UnauthorizedError,
  ForbiddenError,
} from "@/modules/auth/infrastructure/server-auth";
import { auth } from "@/lib/security/auth";
import { db } from "@/lib/db/client";

vi.mock("@/lib/security/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("OWASP Access Control & Authorization (F049)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Broken Access Control Prevention (OWASP A01:2021)", () => {
    it("denies access with 401 when no active session exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      await expect(requireUser(new Headers())).rejects.toThrow(UnauthorizedError);
      await expect(requireAdmin(new Headers())).rejects.toThrow(UnauthorizedError);
    });

    it("denies admin access with 403 when authenticated as normal USER", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-1", email: "user@example.com", name: "Normal User" },
        session: { id: "sess-1", userId: "user-1", expiresAt: new Date(Date.now() + 3600000), token: "tok-1" },
      } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);

      // Database returns USER role
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ role: "USER" }]),
      };
      vi.mocked(db.select).mockReturnValue(mockSelect as unknown as ReturnType<typeof db.select>);

      const userCtx = await requireUser(new Headers());
      expect(userCtx.user.id).toBe("user-1");
      expect(userCtx.role).toBe("USER");

      // requireAdmin must reject with ForbiddenError (403)
      await expect(requireAdmin(new Headers())).rejects.toThrow(ForbiddenError);
    });

    it("grants access when user has verified ADMIN role in PostgreSQL", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "admin-1", email: "admin@example.com", name: "Super Admin" },
        session: { id: "sess-admin", userId: "admin-1", expiresAt: new Date(Date.now() + 3600000), token: "tok-admin" },
      } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ role: "ADMIN" }]),
      };
      vi.mocked(db.select).mockReturnValue(mockSelect as unknown as ReturnType<typeof db.select>);

      const adminCtx = await requireAdmin(new Headers());
      expect(adminCtx.user.id).toBe("admin-1");
      expect(adminCtx.role).toBe("ADMIN");
    });

    it("defaults to safe 'USER' role when no role entry exists in database (privilege escalation defense)", async () => {
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]), // No DB row
      };
      vi.mocked(db.select).mockReturnValue(mockSelect as unknown as ReturnType<typeof db.select>);

      const role = await getUserRole("attacker-id");
      expect(role).toBe("USER");
    });
  });
});
