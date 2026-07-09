"use client";

import { useState } from "react";
import { formatPhoneNational } from "@/lib/utils/phone";

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
  const [value, setValue] = useState(
    defaultValue ? formatPhoneNational(defaultValue) : ""
  );

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <div className="flex">
        <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">
          +55
        </span>
        <input
          type="tel"
          name={name}
          value={value}
          onChange={(e) => setValue(formatPhoneNational(e.target.value))}
          required={required}
          placeholder="(27) 99999-0000"
          className="w-full rounded-r-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <p className="text-xs text-zinc-400">Formato: +55 (DDD) 99999-0000</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
