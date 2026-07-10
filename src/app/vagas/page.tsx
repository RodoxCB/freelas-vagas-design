import Link from "next/link";
import { Suspense } from "react";
import { getVagas } from "@/actions/vagas";
import { SearchBar } from "@/components/home/search-bar";
import { VagaCard } from "@/components/vagas/vaga-card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
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
    <Container>
      <PageHeader
        title="Vagas"
        subtitle={
          vagas.length > 0
            ? `${vagas.length} oportunidade${vagas.length === 1 ? "" : "s"} aberta${vagas.length === 1 ? "" : "s"}`
            : "Oportunidades abertas na comunidade"
        }
        action={<Button href="/vagas/nova">Publicar vaga</Button>}
      />

      <div className="mt-8">
        <Suspense fallback={null}>
          <SearchBar
            defaultValue={params.q}
            action="/vagas"
            placeholder="Busque por título, descrição..."
            paramKeysToPreserve={["tipo"]}
          />
        </Suspense>
      </div>

      <div className="mt-6 -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <FilterLink label="Todas" q={params.q} active={!params.tipo} />
        {TIPOS_VAGA.map((tipo) => (
          <FilterLink
            key={tipo}
            label={TIPO_VAGA_LABELS[tipo]}
            tipo={tipo}
            q={params.q}
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
        <div className="mt-12 rounded-xl border border-zinc-200/80 bg-white p-12 text-center">
          <p className="text-zinc-600">Nenhuma vaga encontrada.</p>
          <Button href="/vagas/nova" className="mt-4">
            Publicar vaga
          </Button>
        </div>
      )}
    </Container>
  );
}

function FilterLink({
  label,
  q,
  tipo,
  active,
}: {
  label: string;
  q?: string;
  tipo?: string;
  active: boolean;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tipo) params.set("tipo", tipo);
  const href = params.toString() ? `/vagas?${params.toString()}` : "/vagas";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-9 shrink-0 snap-start items-center rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {label}
    </Link>
  );
}
