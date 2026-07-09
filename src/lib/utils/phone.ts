import {
  DEFAULT_COUNTRY,
  detectCountryFromStored,
  getCountryByIso2,
  type PhoneCountry,
} from "@/lib/phone/countries";

const BR_DIAL_CODE = "55";

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

export function stripCountryCode(digits: string, dialCode = BR_DIAL_CODE): string {
  const expectedMinLength = dialCode.length + 10;
  if (digits.length >= expectedMinLength && digits.startsWith(dialCode)) {
    return digits.slice(dialCode.length);
  }
  return digits;
}

export function parseBrazilianPhone(
  input: string
): { ddd: string; number: string } | null {
  const digits = extractDigits(input);
  const national = stripCountryCode(digits, BR_DIAL_CODE);

  if (national.length !== 10 && national.length !== 11) return null;

  const ddd = national.slice(0, 2);
  const number = national.slice(2);

  if (!VALID_DDDS.has(ddd)) return null;

  if (national.length === 11 && number[0] !== "9") return null;

  return { ddd, number };
}

export function isValidBrazilianPhone(input: string): boolean {
  return parseBrazilianPhone(input) !== null;
}

export function parseStoredPhone(
  stored: string
): { country: PhoneCountry; national: string } | null {
  const detected = detectCountryFromStored(stored);
  if (detected) return detected;

  const digits = extractDigits(stored);
  if (!digits) return null;

  if (digits.length === 10 || digits.length === 11) {
    return { country: DEFAULT_COUNTRY, national: digits };
  }

  return null;
}

function isValidInternationalPhone(
  country: PhoneCountry,
  national: string
): boolean {
  if (national.length < 4 || national.length > 14) return false;
  if (national.startsWith("0")) return false;

  const full = `${country.dialCode}${national}`;
  return full.length >= 8 && full.length <= 15;
}

export function isValidPhone(input: string): boolean {
  const digits = extractDigits(input);
  if (!digits) return false;

  const parsed = parseStoredPhone(digits);
  if (!parsed) return false;

  if (parsed.country.iso2 === "BR") {
    return isValidBrazilianPhone(`${parsed.country.dialCode}${parsed.national}`);
  }

  return isValidInternationalPhone(parsed.country, parsed.national);
}

export function formatBrazilianNational(value: string): string {
  const digits = stripCountryCode(extractDigits(value), BR_DIAL_CODE).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatGenericNational(value: string, maxLength = 14): string {
  const digits = extractDigits(value).slice(0, maxLength);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  const parts: string[] = [];
  let index = 0;
  while (index < digits.length) {
    const remaining = digits.length - index;
    const size = remaining <= 4 ? remaining : 3;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  return parts.join(" ");
}

export function formatPhoneNational(
  value: string,
  country: PhoneCountry = DEFAULT_COUNTRY
): string {
  if (country.iso2 === "BR") {
    return formatBrazilianNational(value);
  }
  return formatGenericNational(value);
}

/** @deprecated Use formatPhoneNational */
export function formatPhone(value: string): string {
  return formatPhoneNational(value);
}

export function formatPhoneInternational(stored: string): string {
  const parsed = parseStoredPhone(stored);
  if (!parsed) return stored;

  const { country, national } = parsed;

  if (country.iso2 === "BR") {
    const br = parseBrazilianPhone(`${country.dialCode}${national}`);
    if (!br) return `+${country.dialCode} ${national}`;
    const splitAt = br.number.length === 9 ? 5 : 4;
    return `+${country.dialCode} (${br.ddd}) ${br.number.slice(0, splitAt)}-${br.number.slice(splitAt)}`;
  }

  return `+${country.dialCode} ${formatGenericNational(national)}`;
}

export function buildStoredPhone(
  country: PhoneCountry,
  nationalInput: string
): string {
  const national = extractDigits(nationalInput);
  return `${country.dialCode}${national}`;
}

export function normalizePhone(phone: string): string {
  const digits = extractDigits(phone);
  if (!digits) return "";

  const parsed = parseStoredPhone(digits);
  if (!parsed) return digits;

  if (parsed.country.iso2 === "BR") {
    const br = parseBrazilianPhone(`${parsed.country.dialCode}${parsed.national}`);
    if (br) {
      return `${BR_DIAL_CODE}${br.ddd}${br.number}`;
    }
  }

  return `${parsed.country.dialCode}${parsed.national}`;
}

export function getPhonePlaceholder(country: PhoneCountry): string {
  if (country.iso2 === "BR") return "(27) 99999-0000";
  return "999 000 0000";
}

export function getPhoneFormatHint(country: PhoneCountry): string {
  if (country.iso2 === "BR") return "Formato: +55 (DDD) 99999-0000";
  return `Formato: +${country.dialCode} seguido do número local`;
}

export function getDefaultCountry(): PhoneCountry {
  return DEFAULT_COUNTRY;
}

export function resolveCountry(iso2?: string): PhoneCountry {
  return getCountryByIso2(iso2 ?? "BR") ?? DEFAULT_COUNTRY;
}
