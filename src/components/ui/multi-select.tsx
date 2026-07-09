"use client";

import { useMemo, useState } from "react";
import { ESPECIALIDADES_GRUPOS } from "@/lib/constants";

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
  const [busca, setBusca] = useState("");

  const query = busca.trim().toLowerCase();

  const grupos = useMemo(
    () =>
      ESPECIALIDADES_GRUPOS.map((grupo) => ({
        categoria: grupo.categoria,
        itens: grupo.itens.map((item) => ({
          nome: item,
          visivel: query === "" || item.toLowerCase().includes(query),
        })),
      })),
    [query]
  );

  const nenhumResultado = grupos.every((grupo) =>
    grupo.itens.every((item) => !item.visivel)
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700">Especialidades *</p>

      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar especialidade..."
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />

      <div className="max-h-80 space-y-4 overflow-y-auto rounded-lg border border-zinc-100 p-3">
        {grupos.map((grupo) => {
          const grupoVisivel = grupo.itens.some((item) => item.visivel);
          return (
            <fieldset
              key={grupo.categoria}
              className={grupoVisivel ? "space-y-2" : "hidden"}
            >
              <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {grupo.categoria}
              </legend>
              <div className="flex flex-wrap gap-2">
                {grupo.itens.map((item) => (
                  <label
                    key={item.nome}
                    className={`flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 ${
                      item.visivel ? "" : "hidden"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="especialidades"
                      value={item.nome}
                      defaultChecked={defaultSelected.includes(item.nome)}
                    />
                    {item.nome}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}

        {nenhumResultado && (
          <p className="text-sm text-zinc-500">
            Nenhuma especialidade encontrada.
          </p>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
