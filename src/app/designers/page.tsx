import { Suspense } from "react";
import { getDesigners, getTags } from "@/actions/designers";
import { DesignerCard } from "@/components/designers/designer-card";
import { DesignerFilters } from "@/components/designers/filters";
import { DesignerFiltersMobile } from "@/components/designers/filters-mobile";
import { SearchBar } from "@/components/home/search-bar";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
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

  const tagNames = tags.map((t) => t.nome);

  return (
    <Container>
      <PageHeader
        title="Buscar designers"
        subtitle={
          designers.length > 0
            ? `${designers.length} profissiona${designers.length === 1 ? "l" : "is"} encontrado${designers.length === 1 ? "" : "s"}`
            : "Encontre profissionais na comunidade"
        }
        action={<Button href="/designers/novo">Criar meu perfil</Button>}
      />

      <div className="mt-8">
        <Suspense fallback={null}>
          <SearchBar
            defaultValue={params.q}
            paramKeysToPreserve={["especialidade", "nivel", "tag"]}
          />
        </Suspense>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <Suspense fallback={null}>
            <DesignerFilters tags={tagNames} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-6 lg:hidden">
            <Suspense fallback={null}>
              <DesignerFiltersMobile tags={tagNames} />
            </Suspense>
          </div>

          {designers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {designers.map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200/80 bg-white p-12 text-center">
              <p className="text-zinc-600">Nenhum designer encontrado com esses filtros.</p>
              <Button href="/designers/novo" className="mt-4">
                Criar perfil
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
