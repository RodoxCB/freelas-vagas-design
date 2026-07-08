const GATE_MESSAGE = "freelas-vagas-admin-gate-v1";

export const ADMIN_GATE_COOKIE = "admin_gate";

export function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value || null;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function adminGateToken(): Promise<string | null> {
  const password = getAdminPassword();
  if (!password || !globalThis.crypto?.subtle) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(GATE_MESSAGE));
  return bufferToHex(sig);
}

export async function isAdminGateCookieValid(
  cookieValue: string | undefined
): Promise<boolean> {
  const expected = await adminGateToken();
  if (!expected || !cookieValue) return false;
  if (cookieValue.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function verifyAdminPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  if (input.length !== password.length) return false;

  let mismatch = 0;
  for (let i = 0; i < password.length; i += 1) {
    mismatch |= input.charCodeAt(i) ^ password.charCodeAt(i);
  }
  return mismatch === 0;
}
