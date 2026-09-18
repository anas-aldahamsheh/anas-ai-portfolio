import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getSecretsRoute, POST as postSecretRoute } from "@/app/api/admin/secrets/route";
import {
  GET as getSecretDetailRoute,
  DELETE as deleteSecretRoute,
} from "@/app/api/admin/secrets/[key]/route";
import * as serverAuth from "@/modules/auth/infrastructure/server-auth";
import { secretsService } from "@/lib/security/secrets-service";

describe("Admin Secrets Management API Endpoints (F020 Integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    secretsService.clearCache();
  });

  describe("Security Guards (401 / 403 enforcement)", () => {
    it("GET /api/admin/secrets returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/secrets");
      const res = await getSecretsRoute(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("POST /api/admin/secrets returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/secrets", {
        method: "POST",
        body: JSON.stringify({ key: "test_key", value: "secret" }),
      });
      const res = await postSecretRoute(request);
      expect(res.status).toBe(401);
    });

    it("GET /api/admin/secrets/[key] returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/secrets/test_key");
      const res = await getSecretDetailRoute(request, {
        params: Promise.resolve({ key: "test_key" }),
      });
      expect(res.status).toBe(401);
    });

    it("DELETE /api/admin/secrets/[key] returns 401 when unauthenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/secrets/test_key", {
        method: "DELETE",
      });
      const res = await deleteSecretRoute(request, {
        params: Promise.resolve({ key: "test_key" }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe("Admin Authenticated Operations", () => {
    beforeEach(() => {
      vi.spyOn(serverAuth, "requireAdmin").mockResolvedValue({
        user: {
          id: "admin-user-uuid-1",
          email: "admin@anas-ai.dev",
          name: "Admin User",
        },
        session: {
          id: "session-1",
          userId: "admin-user-uuid-1",
          expiresAt: new Date(Date.now() + 3600000),
          token: "mock-session-token",
        },
        role: "ADMIN",
      });
    });

    it("POST /api/admin/secrets rejects invalid schema payloads", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/secrets", {
        method: "POST",
        body: JSON.stringify({ key: "k" }), // missing value, key too short
      });

      const res = await postSecretRoute(request);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Validation failed");
    });

    it("POST /api/admin/secrets securely encrypts secret and returns write-only display metadata", async () => {
      const rawSecret = "sk-live-super-secret-key-12345678";
      const request = new NextRequest("http://localhost:3000/api/admin/secrets", {
        method: "POST",
        body: JSON.stringify({
          key: "ai_provider_groq_api_key",
          value: rawSecret,
        }),
      });

      const res = await postSecretRoute(request);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.secret).toBeDefined();
      expect(data.secret.key).toBe("ai_provider_groq_api_key");
      expect(data.secret.exists).toBe(true);
      expect(data.secret.maskedPreview).toBe("sk-...5678");

      // Verify that raw value is NEVER returned in response
      expect(JSON.stringify(data)).not.toContain(rawSecret);
    });

    it("GET /api/admin/secrets lists secret metadata", async () => {
      await secretsService.setSecret(
        "ai_provider_openai_api_key",
        "sk-openai-sample-key",
        "admin-user-uuid-1",
      );

      const request = new NextRequest("http://localhost:3000/api/admin/secrets");
      const res = await getSecretsRoute(request);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.secrets).toBeDefined();
      expect(
        data.secrets.some((s: { key: string }) => s.key === "ai_provider_openai_api_key"),
      ).toBe(true);
    });

    it("DELETE /api/admin/secrets/[key] removes the secret", async () => {
      await secretsService.setSecret("to_remove_key", "some_value", "admin-user-uuid-1");

      const deleteReq = new NextRequest("http://localhost:3000/api/admin/secrets/to_remove_key", {
        method: "DELETE",
      });
      const delRes = await deleteSecretRoute(deleteReq, {
        params: Promise.resolve({ key: "to_remove_key" }),
      });
      expect(delRes.status).toBe(200);

      const after = await secretsService.getSecret("to_remove_key");
      expect(after).toBeNull();
    });
  });
});
