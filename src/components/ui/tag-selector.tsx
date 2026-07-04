"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";
import { DEFAULT_TAGS } from "@/lib/constants";

export function TagSelector({
  availableTags,
  defaultSelected = [],
  name = "tags",
}: {
  availableTags: string[];
  defaultSelected?: string[];
  name?: string;
}) {
  const allTags = Array.from(new Set([...DEFAULT_TAGS, ...availableTags]));
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [input, setInput] = useState("");

  function toggle(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustom() {
    const trimmed = input.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    setSelected((prev) => [...prev, trimmed]);
    setInput("");
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={selected.join(",")} />
      <p className="text-sm font-medium text-zinc-700">Ferramentas e skills</p>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selected.includes(tag)
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder="Criar nova tag..."
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          Adicionar
        </button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((tag) => (
            <Badge key={tag} color="indigo">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
