import { afterEach, describe, expect, it } from "vitest";
import { verifyAdminPassword } from "./gate";

describe("verifyAdminPassword", () => {
  const original = process.env.ADMIN_PASSWORD;

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = original;
  });

  it("returns false when ADMIN_PASSWORD is unset", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyAdminPassword("anything")).toBe(false);
  });

  it("returns true for exact match", () => {
    process.env.ADMIN_PASSWORD = "SecretPass1";
    expect(verifyAdminPassword("SecretPass1")).toBe(true);
  });

  it("returns false for wrong password", () => {
    process.env.ADMIN_PASSWORD = "SecretPass1";
    expect(verifyAdminPassword("WrongPass1")).toBe(false);
  });
});
