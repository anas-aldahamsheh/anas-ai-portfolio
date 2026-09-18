import { describe, it, expect } from "vitest";
import { signInSchema, signUpSchema } from "@/modules/auth/domain/validation";

describe("Authentication Validation (F003)", () => {
  describe("signInSchema", () => {
    it("accepts valid email and password", () => {
      const result = signInSchema.safeParse({
        email: "recruiter@example.com",
        password: "StrongPassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email address format", () => {
      const result = signInSchema.safeParse({
        email: "not-an-email",
        password: "StrongPassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/email/i);
      }
    });

    it("rejects password shorter than 8 characters", () => {
      const result = signInSchema.safeParse({
        email: "user@example.com",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/8 characters/i);
      }
    });
  });

  describe("signUpSchema", () => {
    it("accepts valid registration payload with matching passwords", () => {
      const result = signUpSchema.safeParse({
        name: "Test Engineer",
        email: "engineer@example.com",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects when password and confirmPassword do not match", () => {
      const result = signUpSchema.safeParse({
        name: "Test Engineer",
        email: "engineer@example.com",
        password: "SecurePassword123!",
        confirmPassword: "DifferentPassword456!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/do not match/i);
      }
    });

    it("rejects name shorter than 2 characters", () => {
      const result = signUpSchema.safeParse({
        name: "A",
        email: "engineer@example.com",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/at least 2 characters/i);
      }
    });
  });
});
