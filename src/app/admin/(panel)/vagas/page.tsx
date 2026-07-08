import Link from "next/link";
import { deleteVagaAdminAction, listVagasAdmin } from "@/actions/admin";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { Badge } from "@/components/ui";
import { TIPO_VAGA_LABELS } from "@/lib/constants";

export const metadata = { title: "Admin — Vagas" };

export default async function AdminVagasPage() {
  const vagas = await listVagasAdmin();

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Expira</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {vagas.map((v) => (
            <tr key={v.id} className="border-b border-zinc-100 last:border-0">
              <td className="px-4 py-3">
                <Link href={`/vagas/${v.id}`} className="text-indigo-600 hover:underline">
                  {v.titulo}
                </Link>
              </td>
              <td className="px-4 py-3">{TIPO_VAGA_LABELS[v.tipo] ?? v.tipo}</td>
              <td className="px-4 py-3">
                <Badge color={v.status === "ativa" ? "green" : "zinc"}>{v.status}</Badge>
              </td>
              <td className="px-4 py-3">
                {new Date(v.expires_at).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-4 py-3">
                <AdminDeleteButton
                  label="Excluir vaga"
                  confirmMessage={`Excluir vaga "${v.titulo}" permanentemente?`}
                  action={deleteVagaAdminAction}
                  id={v.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vagas.length === 0 && (
        <p className="px-4 py-8 text-center text-zinc-500">Nenhuma vaga publicada.</p>
      )}
    </div>
  );
}
