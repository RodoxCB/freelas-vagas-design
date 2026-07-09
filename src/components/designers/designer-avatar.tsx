"use client";

import { useEffect, useState } from "react";

const SIZES = {
  sm: { dim: "h-10 w-10", text: "text-sm" },
  md: { dim: "h-12 w-12", text: "text-sm" },
  lg: { dim: "h-20 w-20", text: "text-xs" },
  xl: { dim: "h-24 w-24", text: "text-2xl font-semibold" },
} as const;

type AvatarSize = keyof typeof SIZES;

export function DesignerAvatar({
  nome,
  fotoUrl,
  size = "md",
  variant = "indigo",
}: {
  nome: string | null;
  fotoUrl?: string | null;
  size?: AvatarSize;
  variant?: "indigo" | "zinc";
}) {
  const [error, setError] = useState(false);
  const { dim, text } = SIZES[size];
  const initial = (nome?.trim()?.[0] ?? "?").toUpperCase();

  useEffect(() => {
    setError(false);
  }, [fotoUrl]);

  const fallbackClass =
    variant === "indigo"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-zinc-200 text-zinc-700";

  if (!fotoUrl || error) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full font-medium ${dim} ${text} ${fallbackClass}`}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={fotoUrl}
      alt={nome ?? "Avatar"}
      className={`shrink-0 rounded-full object-cover ${dim}`}
      onError={() => setError(true)}
    />
  );
}
