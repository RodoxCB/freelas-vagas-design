"use client";

import { useActionState } from "react";
import {
  verifyAdminGateAction,
  type AdminGateState,
} from "@/actions/admin-gate";
import { Button, Input } from "@/components/ui";

export function AdminGateForm({ redirect }: { redirect?: string }) {
  const [state, action, pending] = useActionState<AdminGateState, FormData>(
    verifyAdminGateAction,
    {}
  );

  return (
    <form action={action} className="mx-auto max-w-sm space-y-4">
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <Input
        label="Senha de administração"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Informe a senha do admin"
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Verificando..." : "Entrar no painel"}
      </Button>
    </form>
  );
}
