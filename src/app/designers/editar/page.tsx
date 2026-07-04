import { redirect } from "next/navigation";
import { getDesignerByUserId, getTags } from "@/actions/designers";
import { DesignerForm } from "@/components/designers/designer-form";
import { requireAuth } from "@/lib/auth/session";

export const metadata = {
  title: "Editar perfil — Freelas e Vagas de Design",
};

export default async function EditarDesignerPage() {
  const auth = await requireAuth("designer");
  if (!auth.user) redirect("/login?redirect=/designers/editar");

  const designer = await getDesignerByUserId(auth.user.id);
  if (!designer) redirect("/designers/novo");

  const tags = await getTags();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Editar perfil</h1>
      <p className="mt-2 text-zinc-600">Atualize suas informações profissionais.</p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <DesignerForm
          designer={designer}
          availableTags={tags.map((t) => t.nome)}
          mode="edit"
        />
      </div>
    </div>
  );
}
