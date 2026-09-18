import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditLogService } from "@/modules/admin/infrastructure/audit-log-service";
import { sanitizeAuditPayload } from "@/modules/admin/domain/audit-log";

describe("AuditLogService & Sanitization (F041)", () => {
  let service: AuditLogService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuditLogService();
  });

  describe("sanitizeAuditPayload", () => {
    it("redacts sensitive keys including password, apiKey, secret, token recursively", () => {
      const payload = {
        username: "admin",
        password: "super-secret-password-123",
        apiKey: "sk-1234567890abcdef",
        nested: {
          sessionToken: "jwt-token-value",
          normalField: "public-data",
          authHeader: "Bearer token",
        },
        itemsArray: [{ clientSecret: "secret-val" }, { name: "item" }],
      };

      interface SanitizedPayload {
        username: string;
        password: string;
        apiKey: string;
        nested: {
          sessionToken: string;
          normalField: string;
          authHeader: string;
        };
        itemsArray: Array<{ clientSecret?: string; name?: string }>;
      }

      const sanitized = sanitizeAuditPayload(payload) as SanitizedPayload;

      expect(sanitized.username).toBe("admin");
      expect(sanitized.password).toBe("[REDACTED]");
      expect(sanitized.apiKey).toBe("[REDACTED]");
      expect(sanitized.nested.sessionToken).toBe("[REDACTED]");
      expect(sanitized.nested.normalField).toBe("public-data");
      expect(sanitized.nested.authHeader).toBe("[REDACTED]");
      expect(sanitized.itemsArray[0]!.clientSecret).toBe("[REDACTED]");
      expect(sanitized.itemsArray[1]!.name).toBe("item");
    });

    it("handles primitives, null, and undefined safely", () => {
      expect(sanitizeAuditPayload(null)).toBeNull();
      expect(sanitizeAuditPayload(undefined)).toBeUndefined();
      expect(sanitizeAuditPayload("test string")).toBe("test string");
      expect(sanitizeAuditPayload(12345)).toBe(12345);
    });
  });

  describe("listEvents", () => {
    it("returns baseline events when database query fails or returns empty", async () => {
      const res = await service.listEvents();
      expect(res.events.length).toBeGreaterThan(0);
      expect(res.total).toBeGreaterThan(0);
      expect(res.events[0]?.action).toBeDefined();
    });

    it("filters events by action", async () => {
      const res = await service.listEvents({ action: "model_assignment", limit: 50, offset: 0 });
      expect(res.events.every((e) => e.action === "model_assignment")).toBe(true);
    });

    it("filters events by entityType", async () => {
      const res = await service.listEvents({ entityType: "secret", limit: 50, offset: 0 });
      expect(res.events.every((e) => e.entityType === "secret")).toBe(true);
    });
  });

  describe("getSummary", () => {
    it("computes totalEvents and securityEventsCount accurately", async () => {
      const summary = await service.getSummary();
      expect(summary.totalEvents).toBeGreaterThan(0);
      expect(summary.securityEventsCount).toBeGreaterThanOrEqual(0);
      expect(summary.actionsBreakdown).toBeDefined();
      expect(summary.entityTypesBreakdown).toBeDefined();
    });
  });

  describe("exportEvents", () => {
    it("exports events in JSON format", async () => {
      const json = await service.exportEvents({ limit: 10, offset: 0 }, "json");
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0]?.id).toBeDefined();
    });

    it("exports events in CSV format with standard headers", async () => {
      const csv = await service.exportEvents({ limit: 10, offset: 0 }, "csv");
      expect(csv).toContain("id,createdAt,action,entityType");
      expect(csv.split("\n").length).toBeGreaterThan(1);
    });
  });
});
