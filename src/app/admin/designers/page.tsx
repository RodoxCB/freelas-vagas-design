import Link from "next/link";
import {
  deleteDesignerAdminAction,
  hideDesignerAdminAction,
  listDesignersAdmin,
} from "@/actions/admin";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { Badge } from "@/components/ui";

export const metadata = { title: "Admin — Designers" };

export default async function AdminDesignersPage() {
  const designers = await listDesignersAdmin();

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Nível</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {designers.map((d) => (
            <tr key={d.id} className="border-b border-zinc-100 last:border-0">
              <td className="px-4 py-3">
                <Link href={`/designers/${d.id}`} className="text-indigo-600 hover:underline">
                  {d.nome}
                </Link>
              </td>
              <td className="px-4 py-3">{d.nivel}</td>
              <td className="px-4 py-3">
                <Badge color={d.status === "ativo" ? "green" : "zinc"}>{d.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {d.status === "ativo" && (
                    <AdminDeleteButton
                      label="Ocultar"
                      confirmMessage={`Ocultar perfil de ${d.nome}?`}
                      action={hideDesignerAdminAction}
                      id={d.id}
                      variant="secondary"
                    />
                  )}
                  <AdminDeleteButton
                    label="Excluir perfil"
                    confirmMessage={`Excluir perfil de ${d.nome}?`}
                    action={deleteDesignerAdminAction}
                    id={d.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {designers.length === 0 && (
        <p className="px-4 py-8 text-center text-zinc-500">Nenhum designer cadastrado.</p>
      )}
    </div>
  );
}
