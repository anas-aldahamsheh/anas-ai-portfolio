import { describe, it, expect } from "vitest";
import { auth } from "@/lib/security/auth";

describe("Better Auth Server Instance (F003 Integration)", () => {
  it("initializes auth instance with emailAndPassword provider enabled", () => {
    expect(auth).toBeDefined();
    expect(auth.options.emailAndPassword?.enabled).toBe(true);
    expect(auth.options.session?.expiresIn).toBe(60 * 60 * 24 * 7);
  });

  it("handles auth API requests through auth.handler", async () => {
    const request = new Request("http://localhost:3000/api/auth/get-session", {
      method: "GET",
    });

    const response = await auth.handler(request);
    expect(response).toBeDefined();
    // For unauthenticated session request, response status is 200 with null session or empty body
    expect([200, 401]).toContain(response.status);
  });
});
