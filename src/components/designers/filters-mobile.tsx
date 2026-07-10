"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DesignerFilters } from "@/components/designers/filters";
import { FilterSheet } from "@/components/ui/filter-sheet";
import { IconFilter } from "@/components/ui/icons";
import {
  countActiveFilters,
  FilterChips,
  getDesignerFilterChips,
} from "@/components/ui/filter-chips";

export function DesignerFiltersMobile({ tags = [] }: { tags?: string[] }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeCount = countActiveFilters(searchParams);
  const chips = getDesignerFilterChips(searchParams);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <IconFilter className="h-4 w-4" />
          Filtrar
          {activeCount > 0 && (
            <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
        <FilterChips chips={chips} basePath="/designers" />
      </div>

      <FilterSheet open={open} onClose={() => setOpen(false)}>
        <DesignerFilters tags={tags} />
      </FilterSheet>
    </>
  );
}
