"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/utils/phone";

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
  const [value, setValue] = useState(defaultValue ? formatPhone(defaultValue) : "");

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="tel"
        name={name}
        value={value}
        onChange={(e) => setValue(formatPhone(e.target.value))}
        required={required}
        placeholder="(11) 99999-9999"
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
