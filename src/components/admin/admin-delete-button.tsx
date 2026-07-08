"use client";

import { useTransition } from "react";

export function AdminDeleteButton({
  label,
  confirmMessage,
  action,
  id,
  variant = "danger",
}: {
  label: string;
  confirmMessage: string;
  action: (id: string) => Promise<{ success: boolean; error?: string }>;
  id: string;
  variant?: "danger" | "secondary";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await action(id);
          if (!result.success && result.error) {
            alert(result.error);
          }
        });
      }}
      className={
        variant === "danger"
          ? "rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          : "rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      }
    >
      {pending ? "..." : label}
    </button>
  );
}
