"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ESPECIALIDADES_GRUPOS, NIVEIS } from "@/lib/constants";

export function DesignerFilters({ tags = [] }: { tags?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState("");

  const especialidadeAtiva = searchParams.get("especialidade");
  const query = busca.trim().toLowerCase();

  const grupos = useMemo(
    () =>
      ESPECIALIDADES_GRUPOS.map((grupo) => ({
        categoria: grupo.categoria,
        itens: grupo.itens.filter(
          (item) => query === "" || item.toLowerCase().includes(query)
        ),
      })).filter((grupo) => grupo.itens.length > 0),
    [query]
  );

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
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar especialidade..."
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
        />
        <div className="mt-2 max-h-72 space-y-3 overflow-y-auto rounded-lg border border-zinc-100 p-2">
          <FilterOption label="Todas" active={!especialidadeAtiva} onClick={() => updateFilter("especialidade", "")} />
          {grupos.map((grupo) => {
            const contemAtiva = grupo.itens.some((item) => item === especialidadeAtiva);
            return (
              <details key={grupo.categoria} open={query !== "" || contemAtiva}>
                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {grupo.categoria}
                </summary>
                <div className="mt-1 space-y-1">
                  {grupo.itens.map((item) => (
                    <FilterOption
                      key={item}
                      label={item}
                      active={especialidadeAtiva === item}
                      onClick={() => updateFilter("especialidade", item)}
                    />
                  ))}
                </div>
              </details>
            );
          })}
          {grupos.length === 0 && (
            <p className="px-3 py-2 text-sm text-zinc-500">
              Nenhuma especialidade encontrada.
            </p>
          )}
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
      className={`block w-full min-h-11 rounded-lg px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-[var(--color-accent-subtle)] font-medium text-[var(--color-primary)]"
          : "text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}
