"use client";

import { useState } from "react";

const SIZES = {
  sm: { dim: "h-10 w-10", text: "text-sm" },
  md: { dim: "h-12 w-12", text: "text-sm" },
  lg: { dim: "h-20 w-20", text: "text-xs" },
  xl: { dim: "h-24 w-24", text: "text-2xl font-semibold" },
} as const;

type AvatarSize = keyof typeof SIZES;

function AvatarFallback({
  initial,
  dim,
  text,
  fallbackClass,
}: {
  initial: string;
  dim: string;
  text: string;
  fallbackClass: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-medium ${dim} ${text} ${fallbackClass}`}
    >
      {initial}
    </div>
  );
}

function AvatarImage({
  fotoUrl,
  nome,
  dim,
  initial,
  text,
  fallbackClass,
}: {
  fotoUrl: string;
  nome: string | null;
  dim: string;
  initial: string;
  text: string;
  fallbackClass: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <AvatarFallback
        initial={initial}
        dim={dim}
        text={text}
        fallbackClass={fallbackClass}
      />
    );
  }

  return (
    <img
      src={fotoUrl}
      alt={nome ?? "Avatar"}
      className={`shrink-0 rounded-full object-cover ${dim}`}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => setError(true)}
    />
  );
}

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
  const { dim, text } = SIZES[size];
  const initial = (nome?.trim()?.[0] ?? "?").toUpperCase();

  const fallbackClass =
    variant === "indigo"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-zinc-200 text-zinc-700";

  if (!fotoUrl) {
    return (
      <AvatarFallback
        initial={initial}
        dim={dim}
        text={text}
        fallbackClass={fallbackClass}
      />
    );
  }

  return (
    <AvatarImage
      key={fotoUrl}
      fotoUrl={fotoUrl}
      nome={nome}
      dim={dim}
      initial={initial}
      text={text}
      fallbackClass={fallbackClass}
    />
  );
}
