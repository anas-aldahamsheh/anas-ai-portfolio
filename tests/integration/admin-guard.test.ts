import { describe, it, expect } from "vitest";
import {
  requireUser,
  requireAdmin,
  UnauthorizedError,
  ForbiddenError,
} from "@/modules/auth/infrastructure/server-auth";
import { GET as adminGuardGet } from "@/app/api/admin/guard-check/route";

describe("Server-Side Admin & User Guards (F004 Integration)", () => {
  it("requireUser throws UnauthorizedError when no session exists", async () => {
    const emptyHeaders = new Headers();
    await expect(requireUser(emptyHeaders)).rejects.toThrow(UnauthorizedError);
  });

  it("requireAdmin throws UnauthorizedError when unauthenticated", async () => {
    const emptyHeaders = new Headers();
    await expect(requireAdmin(emptyHeaders)).rejects.toThrow(UnauthorizedError);
  });

  it("UnauthorizedError and ForbiddenError have exact HTTP status codes", () => {
    const unauth = new UnauthorizedError();
    expect(unauth.status).toBe(401);
    expect(unauth.name).toBe("UnauthorizedError");

    const forbidden = new ForbiddenError();
    expect(forbidden.status).toBe(403);
    expect(forbidden.name).toBe("ForbiddenError");
  });

  it("GET /api/admin/guard-check returns HTTP 401 when invoked without admin credentials", async () => {
    const response = await adminGuardGet();
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });
});
