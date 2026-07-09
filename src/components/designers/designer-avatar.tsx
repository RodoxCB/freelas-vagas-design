"use client";

import Image from "next/image";
import { useState } from "react";

const SIZES = {
  sm: { px: 40, dim: "h-10 w-10", text: "text-sm" },
  md: { px: 48, dim: "h-12 w-12", text: "text-sm" },
  lg: { px: 80, dim: "h-20 w-20", text: "text-xs" },
  xl: { px: 96, dim: "h-24 w-24", text: "text-2xl font-semibold" },
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
  const { px, dim, text } = SIZES[size];
  const initial = (nome?.trim()?.[0] ?? "?").toUpperCase();

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
    <Image
      src={fotoUrl}
      alt={nome ?? "Avatar"}
      width={px}
      height={px}
      className={`shrink-0 rounded-full object-cover ${dim}`}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
