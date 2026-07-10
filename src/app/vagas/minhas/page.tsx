import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyVagas } from "@/actions/vagas";
import { VagaCard } from "@/components/vagas/vaga-card";
import { Button } from "@/components/ui";
import { requireAuth } from "@/lib/auth/session";
import { EncerrarVagaButton } from "@/components/vagas/encerrar-button";

export const metadata = {
  title: "Minhas vagas — Freelas e Vagas de Design",
};

export default async function MinhasVagasPage() {
  const auth = await requireAuth();
  if (auth.error || !auth.user) redirect("/login?redirect=/vagas/minhas");

  const vagas = await getMyVagas();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Minhas vagas</h1>
          <p className="mt-1 text-zinc-600">Gerencie as oportunidades que você publicou</p>
        </div>
        <Button href="/vagas/nova">Publicar vaga</Button>
      </div>

      {vagas.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {vagas.map((vaga) => (
            <div key={vaga.id} className="space-y-2">
              <VagaCard vaga={vaga} />
              <div className="flex gap-2 px-1">
                <Link
                  href={`/vagas/${vaga.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Ver vaga
                </Link>
                {vaga.status === "ativa" && <EncerrarVagaButton vagaId={vaga.id} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-600">Você ainda não publicou nenhuma vaga.</p>
          <Button href="/vagas/nova" className="mt-4">Publicar vaga</Button>
        </div>
      )}
    </div>
  );
}
