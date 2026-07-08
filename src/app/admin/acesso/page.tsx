import { AdminGateForm } from "@/components/admin/admin-gate-form";

export const metadata = { title: "Acesso admin" };

export default async function AdminAcessoPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center text-2xl font-semibold text-zinc-900">
        Acesso administrativo
      </h1>
      <p className="mt-2 text-center text-sm text-zinc-600">
        Informe a senha de administração para continuar.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <AdminGateForm redirect={redirect} />
      </div>
    </div>
  );
}
