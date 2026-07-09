"use client";

import { useMemo, useState } from "react";
import { CountrySelect } from "@/components/ui/country-select";
import { DEFAULT_COUNTRY, type PhoneCountry } from "@/lib/phone/countries";
import {
  buildStoredPhone,
  formatPhoneNational,
  getPhoneFormatHint,
  getPhonePlaceholder,
  parseStoredPhone,
} from "@/lib/utils/phone";

function getInitialState(defaultValue: string): {
  country: PhoneCountry;
  national: string;
} {
  if (!defaultValue) {
    return { country: DEFAULT_COUNTRY, national: "" };
  }

  const parsed = parseStoredPhone(defaultValue);
  if (!parsed) {
    return {
      country: DEFAULT_COUNTRY,
      national: formatPhoneNational(defaultValue, DEFAULT_COUNTRY),
    };
  }

  return {
    country: parsed.country,
    national: formatPhoneNational(parsed.national, parsed.country),
  };
}

export function PhoneInput({
  label,
  name,
  defaultValue = "",
  error,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  const initial = useMemo(() => getInitialState(defaultValue), [defaultValue]);
  const [country, setCountry] = useState<PhoneCountry>(initial.country);
  const [national, setNational] = useState(initial.national);

  const storedValue = buildStoredPhone(country, national);

  function handleCountryChange(nextCountry: PhoneCountry) {
    setCountry(nextCountry);
    setNational((current) =>
      formatPhoneNational(current, nextCountry)
    );
  }

  function handleNationalChange(value: string) {
    setNational(formatPhoneNational(value, country));
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <div className="flex">
        <CountrySelect value={country} onChange={handleCountryChange} />
        <input
          type="tel"
          value={national}
          onChange={(e) => handleNationalChange(e.target.value)}
          required={required}
          placeholder={getPhonePlaceholder(country)}
          className="w-full rounded-r-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <input type="hidden" name={name} value={storedValue} />
      <p className="text-xs text-zinc-400">{getPhoneFormatHint(country)}</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
