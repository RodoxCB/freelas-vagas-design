import Link from "next/link";
import { getFeaturedDesigners } from "@/actions/designers";
import { getRecentVagas } from "@/actions/vagas";
import { DesignerCardCompact } from "@/components/designers/designer-card";
import {
  CommunityBlock,
  HeroBlocks,
  HowItWorks,
} from "@/components/home/sections";
import { SearchBarWithTabs } from "@/components/home/search-bar";
import { VagaCardCompact } from "@/components/vagas/vaga-card";
import { Container } from "@/components/ui/container";
import { getContentValue, getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const [designers, vagas, content] = await Promise.all([
    getFeaturedDesigners(6),
    getRecentVagas(5),
    getSiteContent(),
  ]);

  return (
    <Container className="sm:py-16">
      <div className="mb-10 text-center sm:mb-12">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {getContentValue(content, "home.hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-600 sm:text-base">
          {getContentValue(content, "home.hero.subtitle")}
        </p>
      </div>

      <HeroBlocks content={content} />

      <div className="mt-10 sm:mt-12">
        <SearchBarWithTabs />
      </div>

      <div className="mt-16 sm:mt-20">
        <HowItWorks content={content} />
      </div>

      <section className="mt-16 sm:mt-20">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
            {getContentValue(content, "home.featured.title")}
          </h2>
          <Link
            href="/designers"
            className="shrink-0 text-sm font-medium text-[var(--color-primary)] hover:opacity-80"
          >
            Ver todos →
          </Link>
        </div>
        {designers.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designers.map((designer) => (
              <DesignerCardCompact key={designer.id} designer={designer} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-zinc-500">
            {getContentValue(content, "home.empty.designers")}{" "}
            <Link href="/designers/novo" className="text-[var(--color-primary)]">
              Seja o primeiro
            </Link>
          </p>
        )}
      </section>

      <section className="mt-16 sm:mt-20">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
            {getContentValue(content, "home.vagas.title")}
          </h2>
          <Link
            href="/vagas"
            className="shrink-0 text-sm font-medium text-[var(--color-primary)] hover:opacity-80"
          >
            Ver todas →
          </Link>
        </div>
        {vagas.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {vagas.map((vaga) => (
              <VagaCardCompact key={vaga.id} vaga={vaga} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-zinc-500">
            {getContentValue(content, "home.empty.vagas")}{" "}
            <Link href="/vagas/nova" className="text-[var(--color-primary)]">
              Publicar a primeira
            </Link>
          </p>
        )}
      </section>

      <div className="mt-16 sm:mt-20">
        <CommunityBlock content={content} />
      </div>
    </Container>
  );
}
