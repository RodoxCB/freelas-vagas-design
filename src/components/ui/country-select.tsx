"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  filterCountries,
  isoToFlag,
  type PhoneCountry,
} from "@/lib/phone/countries";

export function CountrySelect({
  value,
  onChange,
}: {
  value: PhoneCountry;
  onChange: (country: PhoneCountry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const countries = filterCountries(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCountry(country: PhoneCountry) {
    onChange(country);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-full min-w-[6.5rem] items-center gap-1.5 rounded-l-lg border border-r-0 border-zinc-200 bg-zinc-50 px-2.5 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <span aria-hidden className="text-base leading-none">
          {isoToFlag(value.iso2)}
        </span>
        <span className="font-medium">+{value.dialCode}</span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-zinc-400 transition ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-100 p-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar país ou DDI..."
              autoFocus
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            className="max-h-60 overflow-y-auto py-1"
          >
            {countries.length === 0 ? (
              <li className="px-3 py-2 text-sm text-zinc-500">
                Nenhum país encontrado
              </li>
            ) : (
              countries.map((country) => (
                <li key={`${country.iso2}-${country.dialCode}`} role="option">
                  <button
                    type="button"
                    aria-selected={country.iso2 === value.iso2}
                    onClick={() => selectCountry(country)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-zinc-50 ${
                      country.iso2 === value.iso2
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-zinc-700"
                    }`}
                  >
                    <span aria-hidden className="text-base leading-none">
                      {isoToFlag(country.iso2)}
                    </span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-zinc-400">+{country.dialCode}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
