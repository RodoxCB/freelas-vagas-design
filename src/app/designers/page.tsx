import { Suspense } from "react";
import { getDesigners, getTags } from "@/actions/designers";
import { DesignerCard } from "@/components/designers/designer-card";
import { DesignerFilters } from "@/components/designers/filters";
import { SearchBar } from "@/components/home/search-bar";
import { Button } from "@/components/ui";

type SearchParams = Promise<{
  q?: string;
  especialidade?: string;
  nivel?: string;
  tag?: string;
}>;

export default async function DesignersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [designers, tags] = await Promise.all([
    getDesigners({
      q: params.q,
      especialidade: params.especialidade,
      nivel: params.nivel,
      tag: params.tag,
    }),
    getTags(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Buscar designers</h1>
          <p className="mt-1 text-zinc-600">
            Encontre profissionais na comunidade
          </p>
        </div>
        <Button href="/designers/novo">Criar meu perfil</Button>
      </div>

      <div className="mt-8">
        <SearchBar defaultValue={params.q} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <Suspense fallback={null}>
            <DesignerFilters tags={tags.map((t) => t.nome)} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-6 lg:hidden">
            <Suspense fallback={null}>
              <DesignerFilters tags={tags.map((t) => t.nome)} />
            </Suspense>
          </div>

          {designers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {designers.map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
              <p className="text-zinc-600">Nenhum designer encontrado com esses filtros.</p>
              <Button href="/designers/novo" className="mt-4">Criar perfil</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
