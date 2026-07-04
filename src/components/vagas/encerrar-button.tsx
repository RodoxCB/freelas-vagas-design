"use client";

import { useTransition } from "react";
import { encerrarVagaAction } from "@/actions/vagas";

export function EncerrarVagaButton({ vagaId }: { vagaId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await encerrarVagaAction(vagaId);
        })
      }
      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {pending ? "Encerrando..." : "Encerrar vaga"}
    </button>
  );
}
