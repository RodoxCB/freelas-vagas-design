"use client";

import { useState } from "react";
import { IconMail, IconWhatsApp } from "@/components/ui/icons";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";

export function VagaApplyBar({
  email,
  whatsappHref,
}: {
  email: string;
  whatsappHref: string;
}) {
  return (
    <StickyActionBar label="Ações de candidatura">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition hover:opacity-90"
      >
        <IconWhatsApp className="h-4 w-4 shrink-0" />
        WhatsApp
      </a>
      <a
        href={`mailto:${email}`}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 sm:flex-initial"
      >
        <IconMail className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Email</span>
      </a>
    </StickyActionBar>
  );
}

export function ExpandableText({
  text,
  maxLines = 3,
  className = "",
}: {
  text: string;
  maxLines?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.split("\n").length > maxLines || text.length > 280;

  return (
    <div className={className}>
      <p
        className="whitespace-pre-wrap leading-relaxed text-zinc-600"
        style={
          !expanded && isLong
            ? {
                display: "-webkit-box",
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-[var(--color-primary)] hover:opacity-80"
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </div>
  );
}
