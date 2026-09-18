import { describe, it, expect } from "vitest";
import {
  ROLES,
  ROLE_HIERARCHY,
  hasRole,
  isGuest,
  isUser,
  isAdmin,
} from "@/modules/auth/domain/roles";

describe("RBAC Role Logic & Hierarchy (F004)", () => {
  it("defines exact initial roles (GUEST, USER, ADMIN)", () => {
    expect(ROLES.GUEST).toBe("GUEST");
    expect(ROLES.USER).toBe("USER");
    expect(ROLES.ADMIN).toBe("ADMIN");
  });

  it("enforces proper role hierarchy levels", () => {
    expect(ROLE_HIERARCHY.GUEST).toBeLessThan(ROLE_HIERARCHY.USER);
    expect(ROLE_HIERARCHY.USER).toBeLessThan(ROLE_HIERARCHY.ADMIN);
  });

  it("correctly evaluates hasRole with hierarchy inheritance", () => {
    // ADMIN has all permissions
    expect(hasRole("ADMIN", "ADMIN")).toBe(true);
    expect(hasRole("ADMIN", "USER")).toBe(true);
    expect(hasRole("ADMIN", "GUEST")).toBe(true);

    // USER has USER and GUEST permissions, but not ADMIN
    expect(hasRole("USER", "USER")).toBe(true);
    expect(hasRole("USER", "GUEST")).toBe(true);
    expect(hasRole("USER", "ADMIN")).toBe(false);

    // GUEST has only GUEST permissions
    expect(hasRole("GUEST", "GUEST")).toBe(true);
    expect(hasRole("GUEST", "USER")).toBe(false);
    expect(hasRole("GUEST", "ADMIN")).toBe(false);
  });

  it("evaluates role predicates correctly", () => {
    expect(isGuest(null)).toBe(true);
    expect(isGuest(undefined)).toBe(true);
    expect(isGuest("GUEST")).toBe(true);
    expect(isGuest("USER")).toBe(false);
    expect(isGuest("ADMIN")).toBe(false);

    expect(isUser("USER")).toBe(true);
    expect(isUser("ADMIN")).toBe(true);
    expect(isUser("GUEST")).toBe(false);
    expect(isUser(null)).toBe(false);

    expect(isAdmin("ADMIN")).toBe(true);
    expect(isAdmin("USER")).toBe(false);
    expect(isAdmin("GUEST")).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
});
