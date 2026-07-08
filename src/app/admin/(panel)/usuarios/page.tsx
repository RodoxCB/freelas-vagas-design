import Link from "next/link";
import Image from "next/image";
import {
  makeAdminAction,
  removeAdminAction,
  deleteUserAdminAction,
  listUsersAdmin,
} from "@/actions/admin";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { Badge } from "@/components/ui";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function UserAvatar({
  nome,
  fotoUrl,
}: {
  nome: string | null;
  fotoUrl: string | null;
}) {
  if (fotoUrl) {
    return (
      <Image
        src={fotoUrl}
        alt={nome ?? "Avatar"}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  const initial = (nome?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700">
      {initial}
    </span>
  );
}

export const metadata = { title: "Admin — Usuários" };

export default async function AdminUsuariosPage() {
  const users = await listUsersAdmin();

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Usuário</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Atividade</th>
            <th className="px-4 py-3 font-medium">Conteúdo</th>
            <th className="px-4 py-3 font-medium">Admin</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-zinc-100 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar nome={user.nome} fotoUrl={user.designer_foto_url} />
                  <div>
                    <p className="font-medium text-zinc-900">{user.nome ?? "—"}</p>
                    <p className="text-zinc-600">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 capitalize">{user.tipo}</td>
              <td className="px-4 py-3 text-zinc-600">
                <p>Cadastro: {formatDate(user.created_at)}</p>
                <p>Último acesso: {formatDate(user.last_sign_in_at ?? user.last_seen_at)}</p>
              </td>
              <td className="px-4 py-3 text-zinc-600">
                {user.designer_id ? (
                  <p>Designer ({user.designer_status})</p>
                ) : (
                  <p>Sem perfil designer</p>
                )}
                <p>{user.vagas_count} vaga(s)</p>
              </td>
              <td className="px-4 py-3">
                {user.is_admin ? (
                  <Badge color="indigo">Admin</Badge>
                ) : (
                  <Badge>Usuário</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/usuarios/${user.id}`}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Ver detalhes
                  </Link>
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
