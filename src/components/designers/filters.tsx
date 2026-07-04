"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ESPECIALIDADES, NIVEIS } from "@/lib/constants";

export function DesignerFilters({ tags = [] }: { tags?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/designers?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-900">Especialidade</h3>
        <div className="mt-2 space-y-1">
          <FilterOption label="Todas" active={!searchParams.get("especialidade")} onClick={() => updateFilter("especialidade", "")} />
          {ESPECIALIDADES.map((e) => (
            <FilterOption
              key={e}
              label={e}
              active={searchParams.get("especialidade") === e}
              onClick={() => updateFilter("especialidade", e)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900">Nível</h3>
        <div className="mt-2 space-y-1">
          <FilterOption label="Todos" active={!searchParams.get("nivel")} onClick={() => updateFilter("nivel", "")} />
          {NIVEIS.map((nivel) => (
            <FilterOption
              key={nivel}
              label={nivel}
              active={searchParams.get("nivel") === nivel}
              onClick={() => updateFilter("nivel", nivel)}
            />
          ))}
        </div>
      </div>

      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-900">Ferramenta</h3>
          <div className="mt-2 space-y-1">
            <FilterOption label="Todas" active={!searchParams.get("tag")} onClick={() => updateFilter("tag", "")} />
            {tags.slice(0, 15).map((tag) => (
              <FilterOption
                key={tag}
                label={tag}
                active={searchParams.get("tag") === tag}
                onClick={() => updateFilter("tag", tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
        active ? "bg-indigo-50 font-medium text-indigo-700" : "text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}
