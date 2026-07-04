import Link from "next/link";
import { getVagas } from "@/actions/vagas";
import { SearchBar } from "@/components/home/search-bar";
import { VagaCard } from "@/components/vagas/vaga-card";
import { Button } from "@/components/ui";
import { TIPOS_VAGA, TIPO_VAGA_LABELS } from "@/lib/constants";

type SearchParams = Promise<{ q?: string; tipo?: "freela" | "estagio" | "clt" }>;

export default async function VagasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const vagas = await getVagas({ q: params.q, tipo: params.tipo });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Vagas</h1>
          <p className="mt-1 text-zinc-600">
            Oportunidades abertas na comunidade
          </p>
        </div>
        <Button href="/vagas/nova">Publicar vaga</Button>
      </div>

      <div className="mt-8">
        <SearchBar
          defaultValue={params.q}
          action="/vagas"
          placeholder="Busque por título, descrição..."
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="Todas" href="/vagas" active={!params.tipo} />
        {TIPOS_VAGA.map((tipo) => (
          <FilterLink
            key={tipo}
            label={TIPO_VAGA_LABELS[tipo]}
            href={`/vagas?tipo=${tipo}`}
            active={params.tipo === tipo}
          />
        ))}
      </div>

      {vagas.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {vagas.map((vaga) => (
            <VagaCard key={vaga.id} vaga={vaga} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-600">Nenhuma vaga encontrada.</p>
          <Button href="/vagas/nova" className="mt-4">
            Publicar vaga
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
      }`}
    >
      {label}
    </Link>
  );
}
