const BLOCKED_URL_PROTOCOLS = /^(javascript|data|vbscript):/i;

export function isSafeHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (BLOCKED_URL_PROTOCOLS.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeTagName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 30) return null;
  if (/[<>]/.test(trimmed)) return null;
  return trimmed;
}
