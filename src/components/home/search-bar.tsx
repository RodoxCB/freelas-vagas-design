"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@/components/ui/icons";

export function SearchBar({
  placeholder = "Busque por UX, UI, logo, social media...",
  defaultValue = "",
  action = "/designers",
  preserveParams = true,
  paramKeysToPreserve,
}: {
  placeholder?: string;
  defaultValue?: string;
  action?: string;
  preserveParams?: boolean;
  paramKeysToPreserve?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = preserveParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();

    if (paramKeysToPreserve && preserveParams) {
      const preserved = new URLSearchParams();
      for (const key of paramKeysToPreserve) {
        const value = searchParams.get(key);
        if (value) preserved.set(key, value);
      }
      if (query.trim()) preserved.set("q", query.trim());
      else preserved.delete("q");
      router.push(`${action}?${preserved.toString()}`);
      return;
    }

    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    router.push(`${action}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="min-h-11 flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition hover:opacity-90 sm:min-w-0 sm:px-5"
          aria-label="Buscar"
        >
          <IconSearch className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>
    </form>
  );
}

type SearchTab = "designers" | "vagas";

export function SearchBarWithTabs({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [tab, setTab] = useState<SearchTab>("designers");
  const action = tab === "designers" ? "/designers" : "/vagas";
  const placeholder =
    tab === "designers"
      ? "Busque por UX, UI, logo, social media..."
      : "Busque por título, descrição...";

  return (
    <div className="space-y-3">
      <div
        role="tablist"
        aria-label="Tipo de busca"
        className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1"
      >
        {(
          [
            { id: "designers" as const, label: "Designers" },
            { id: "vagas" as const, label: "Vagas" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-9 rounded-md px-4 text-sm font-medium transition ${
              tab === id
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <SearchBar
        key={action}
        defaultValue={defaultValue}
        action={action}
        placeholder={placeholder}
        preserveParams={false}
      />
    </div>
  );
}
