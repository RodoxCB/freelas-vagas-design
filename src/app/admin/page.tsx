import { getAdminStats } from "@/actions/admin";
import { Card } from "@/components/ui";

export const metadata = { title: "Admin — Visão geral" };

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-sm text-zinc-500">Usuários</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-900">{stats?.users ?? 0}</p>
      </Card>
      <Card>
        <p className="text-sm text-zinc-500">Designers</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-900">{stats?.designers ?? 0}</p>
      </Card>
      <Card>
        <p className="text-sm text-zinc-500">Vagas (total)</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-900">{stats?.vagas ?? 0}</p>
      </Card>
      <Card>
        <p className="text-sm text-zinc-500">Vagas ativas</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-900">{stats?.vagasAtivas ?? 0}</p>
      </Card>
    </div>
  );
}
