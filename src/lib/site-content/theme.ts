import { SITE_CONTENT_DEFAULTS, type SiteContentMap } from "./defaults";

export const THEME_COLOR_KEYS = [
  "theme.color.primary",
  "theme.color.background",
  "theme.color.text",
] as const;

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR.test(value.trim());
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("#")) return null;
  const normalized =
    trimmed.length === 4
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed;
  return isValidHexColor(normalized) ? normalized.toLowerCase() : null;
}

export function resolveThemeColors(content: SiteContentMap) {
  return {
    primary:
      normalizeHexColor(content["theme.color.primary"] ?? "") ??
      SITE_CONTENT_DEFAULTS["theme.color.primary"],
    background:
      normalizeHexColor(content["theme.color.background"] ?? "") ??
      SITE_CONTENT_DEFAULTS["theme.color.background"],
    text:
      normalizeHexColor(content["theme.color.text"] ?? "") ??
      SITE_CONTENT_DEFAULTS["theme.color.text"],
  };
}

export function themeCssVariables(content: SiteContentMap): Record<string, string> {
  const colors = resolveThemeColors(content);
  return {
    "--color-primary": colors.primary,
    "--color-background": colors.background,
    "--color-text": colors.text,
  };
}

export function themeCssString(content: SiteContentMap): string {
  const vars = themeCssVariables(content);
  const declarations = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
  return `:root { ${declarations} }`;
}

export function isValidContentUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
