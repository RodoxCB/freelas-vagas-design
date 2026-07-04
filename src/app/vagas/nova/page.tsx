import { redirect } from "next/navigation";
import { VagaForm } from "@/components/vagas/vaga-form";
import { requireAuth } from "@/lib/auth/session";

export const metadata = {
  title: "Publicar vaga — Freelas e Vagas de Design",
};

export default async function NovaVagaPage() {
  const auth = await requireAuth("anunciante");
  if (!auth.user) redirect("/login?redirect=/vagas/nova");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Publicar vaga</h1>
      <p className="mt-2 text-zinc-600">
        Compartilhe uma oportunidade com a comunidade de designers.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <VagaForm />
      </div>
    </div>
  );
}
