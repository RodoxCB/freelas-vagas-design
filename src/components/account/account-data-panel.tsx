"use client";

import { useState, useTransition } from "react";
import {
  deleteAccountAction,
  exportUserDataAction,
  revokeConsentAction,
} from "@/actions/account";
import { Button, Checkbox } from "@/components/ui";

export function AccountDataPanel() {
  const [exportData, setExportData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const data = await exportUserDataAction();
      if (!data) {
        setError("Não foi possível exportar seus dados.");
        return;
      }
      const json = JSON.stringify(data, null, 2);
      setExportData(json);

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Download iniciado.");
    });
  }

  function handleRevoke() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await revokeConsentAction();
      if (!result.success) {
        setError(result.error ?? "Erro ao revogar consentimento.");
        return;
      }
      setMessage("Consentimento revogado. Seu perfil foi ocultado da busca pública.");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await deleteAccountAction();
      if (!result.success) {
        setError(result.error ?? "Erro ao excluir conta.");
      }
    });
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Acesso e portabilidade</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Baixe uma cópia dos dados associados à sua conta em formato JSON.
        </p>
        <Button type="button" onClick={handleExport} disabled={pending} className="mt-4">
          {pending ? "Exportando..." : "Exportar meus dados"}
        </Button>
        {exportData && (
          <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-zinc-50 p-4 text-xs text-zinc-700">
            {exportData.slice(0, 2000)}
            {exportData.length > 2000 ? "\n..." : ""}
          </pre>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900">Revogar consentimento</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Oculta seu perfil de designer da listagem pública e remove o registro de
          consentimento para exibição de dados de contato.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={handleRevoke}
          disabled={pending}
          className="mt-4"
        >
          Revogar consentimento e ocultar perfil
        </Button>
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Excluir conta</h2>
        <p className="mt-2 text-sm text-red-800">
          Remove permanentemente sua conta, perfil, vagas, imagens e dados pessoais.
          Esta ação não pode ser desfeita.
        </p>
        <Checkbox
          name="confirm_delete"
          checked={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.checked)}
          className="mt-4 text-red-900"
          label="Entendo que esta ação é irreversível"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleDelete}
          disabled={pending || !confirmDelete}
          className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
        >
          {pending ? "Excluindo..." : "Excluir minha conta"}
        </Button>
      </section>
    </div>
  );
}
