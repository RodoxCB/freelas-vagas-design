import { describe, expect, it } from "vitest";
import { SITE_CONTENT_DEFAULTS } from "./defaults";
import { getContentValue } from "./index";
import {
  isValidContentUrl,
  isValidHexColor,
  normalizeHexColor,
  resolveThemeColors,
  themeCssString,
} from "./theme";

describe("theme helpers", () => {
  it("validates hex colors", () => {
    expect(isValidHexColor("#4f46e5")).toBe(true);
    expect(isValidHexColor("#fff")).toBe(false);
    expect(isValidHexColor("blue")).toBe(false);
  });

  it("normalizes shorthand hex", () => {
    expect(normalizeHexColor("#abc")).toBe("#aabbcc");
  });

  it("resolves theme colors with defaults", () => {
    expect(resolveThemeColors({})).toEqual({
      primary: SITE_CONTENT_DEFAULTS["theme.color.primary"],
      background: SITE_CONTENT_DEFAULTS["theme.color.background"],
      text: SITE_CONTENT_DEFAULTS["theme.color.text"],
    });
  });

  it("builds css string", () => {
    expect(themeCssString({})).toContain("--color-primary:");
  });

  it("validates content urls", () => {
    expect(isValidContentUrl("")).toBe(true);
    expect(isValidContentUrl("https://example.com")).toBe(true);
    expect(isValidContentUrl("not-a-url")).toBe(false);
  });
});

describe("getContentValue", () => {
  it("falls back to defaults", () => {
    expect(getContentValue({}, "site.name")).toBe(SITE_CONTENT_DEFAULTS["site.name"]);
    expect(getContentValue({ "site.name": "Custom" }, "site.name")).toBe("Custom");
  });
});
