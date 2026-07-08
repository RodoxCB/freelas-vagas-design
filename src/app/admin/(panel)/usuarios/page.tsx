import Link from "next/link";
import {
  makeAdminAction,
  removeAdminAction,
  deleteUserAdminAction,
  listUsersAdmin,
} from "@/actions/admin";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { Badge } from "@/components/ui";

export const metadata = { title: "Admin — Usuários" };

export default async function AdminUsuariosPage() {
  const users = await listUsersAdmin();

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Admin</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-zinc-100 last:border-0">
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.nome ?? "—"}</td>
              <td className="px-4 py-3 capitalize">{user.tipo}</td>
              <td className="px-4 py-3">
                {user.is_admin ? (
                  <Badge color="indigo">Admin</Badge>
                ) : (
                  <Badge>Usuário</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {!user.is_admin ? (
                    <form action={makeAdminAction}>
                      <input type="hidden" name="user_id" value={user.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Tornar admin
                      </button>
                    </form>
                  ) : (
                    <form action={removeAdminAction}>
                      <input type="hidden" name="user_id" value={user.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Remover admin
                      </button>
                    </form>
                  )}
                  <AdminDeleteButton
                    label="Excluir conta"
                    confirmMessage={`Excluir permanentemente ${user.email}? Todos os dados serão removidos.`}
                    action={deleteUserAdminAction}
                    id={user.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="px-4 py-8 text-center text-zinc-500">Nenhum usuário encontrado.</p>
      )}
    </div>
  );
}
