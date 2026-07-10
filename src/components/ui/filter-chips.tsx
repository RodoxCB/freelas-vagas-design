"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type FilterChip = {
  key: string;
  label: string;
  value: string;
};

export function FilterChips({
  chips,
  basePath,
}: {
  chips: FilterChip[];
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (chips.length === 0) return null;

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${basePath}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    for (const chip of chips) {
      params.delete(chip.key);
    }
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          onClick={() => removeFilter(chip.key)}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          {chip.label}
          <span className="text-zinc-400" aria-hidden>
            ×
          </span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-medium text-[var(--color-primary)] hover:opacity-80"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export function getDesignerFilterChips(searchParams: URLSearchParams): FilterChip[] {
  const chips: FilterChip[] = [];
  const especialidade = searchParams.get("especialidade");
  const nivel = searchParams.get("nivel");
  const tag = searchParams.get("tag");

  if (especialidade) {
    chips.push({ key: "especialidade", label: especialidade, value: especialidade });
  }
  if (nivel) {
    chips.push({ key: "nivel", label: nivel, value: nivel });
  }
  if (tag) {
    chips.push({ key: "tag", label: tag, value: tag });
  }

  return chips;
}

export function countActiveFilters(searchParams: URLSearchParams): number {
  let count = 0;
  if (searchParams.get("especialidade")) count++;
  if (searchParams.get("nivel")) count++;
  if (searchParams.get("tag")) count++;
  return count;
}
