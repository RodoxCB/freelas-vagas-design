import { redirect } from "next/navigation";
import { getDesignerByUserId, getTags } from "@/actions/designers";
import { DesignerForm } from "@/components/designers/designer-form";
import { requireAuth } from "@/lib/auth/session";

export const metadata = {
  title: "Criar perfil — Freelas e Vagas de Design",
};

export default async function NovoDesignerPage() {
  const auth = await requireAuth("designer");
  if (!auth.user) redirect("/login?redirect=/designers/novo");

  const existing = await getDesignerByUserId(auth.user.id);
  if (existing) redirect("/designers/editar");

  const tags = await getTags();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Criar meu perfil</h1>
      <p className="mt-2 text-zinc-600">
        Preencha seus dados para ser encontrado. Sem portfólio, seu perfil não aparece na busca.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <DesignerForm availableTags={tags.map((t) => t.nome)} />
      </div>
    </div>
  );
}
