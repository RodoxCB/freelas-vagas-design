"use client";

import { ESPECIALIDADES } from "@/lib/constants";

export function MultiSelect({
  label,
  options,
  name,
  defaultSelected = [],
  error,
}: {
  label: string;
  options: readonly string[];
  name: string;
  defaultSelected?: string[];
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={defaultSelected.includes(option)}
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function EspecialidadesSelect({
  defaultSelected = [],
  error,
}: {
  defaultSelected?: string[];
  error?: string;
}) {
  return (
    <MultiSelect
      label="Especialidades *"
      options={ESPECIALIDADES}
      name="especialidades"
      defaultSelected={defaultSelected}
      error={error}
    />
  );
}
