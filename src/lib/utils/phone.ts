const COUNTRY_CODE = "55";

const VALID_DDDS = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24",
  "27", "28",
  "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46",
  "47", "48", "49",
  "51", "53", "54", "55",
  "61",
  "62", "64",
  "63",
  "65", "66",
  "67",
  "68",
  "69",
  "71", "73", "74", "75", "77",
  "79",
  "81", "87",
  "82",
  "83",
  "84",
  "85", "88",
  "86", "89",
  "91", "93", "94",
  "92", "97",
  "95",
  "96",
  "98", "99",
]);

export function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function stripCountryCode(digits: string): string {
  if (digits.length >= 12 && digits.startsWith(COUNTRY_CODE)) {
    return digits.slice(2);
  }
  return digits;
}

export function parseBrazilianPhone(
  input: string
): { ddd: string; number: string } | null {
  const digits = extractDigits(input);
  const national = stripCountryCode(digits);

  if (national.length !== 10 && national.length !== 11) return null;

  const ddd = national.slice(0, 2);
  const number = national.slice(2);

  if (!VALID_DDDS.has(ddd)) return null;

  if (national.length === 11) {
    if (number[0] !== "9") return null;
  }

  return { ddd, number };
}

export function isValidBrazilianPhone(input: string): boolean {
  return parseBrazilianPhone(input) !== null;
}

export function formatPhoneNational(value: string): string {
  const digits = stripCountryCode(extractDigits(value)).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** @deprecated Use formatPhoneNational */
export function formatPhone(value: string): string {
  return formatPhoneNational(value);
}

export function formatPhoneInternational(stored: string): string {
  const parsed = parseBrazilianPhone(stored);
  if (!parsed) return stored;
  return `+${COUNTRY_CODE} (${parsed.ddd}) ${parsed.number.slice(0, parsed.number.length === 9 ? 5 : 4)}-${parsed.number.slice(parsed.number.length === 9 ? 5 : 4)}`;
}

export function normalizePhone(phone: string): string {
  const parsed = parseBrazilianPhone(phone);
  if (!parsed) {
    const digits = extractDigits(phone);
    return digits.startsWith(COUNTRY_CODE) ? digits : `${COUNTRY_CODE}${digits}`;
  }
  return `${COUNTRY_CODE}${parsed.ddd}${parsed.number}`;
}
