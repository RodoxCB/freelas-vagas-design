import Link from "next/link";
import { getFeaturedDesigners } from "@/actions/designers";
import { getRecentVagas } from "@/actions/vagas";
import { DesignerCardCompact } from "@/components/designers/designer-card";
import {
  CommunityBlock,
  HeroBlocks,
  HowItWorks,
} from "@/components/home/sections";
import { SearchBar } from "@/components/home/search-bar";
import { VagaCard } from "@/components/vagas/vaga-card";
import { getContentValue, getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const [designers, vagas, content] = await Promise.all([
    getFeaturedDesigners(6),
    getRecentVagas(5),
    getSiteContent(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {getContentValue(content, "home.hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          {getContentValue(content, "home.hero.subtitle")}
        </p>
      </div>

      <HeroBlocks content={content} />

      <div className="mt-12">
        <SearchBar />
      </div>

      <div className="mt-20">
        <HowItWorks content={content} />
      </div>

      <section className="mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900">
            {getContentValue(content, "home.featured.title")}
          </h2>
          <Link
            href="/designers"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
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
            <Link href="/designers/novo" className="text-indigo-600">
              Seja o primeiro
            </Link>
          </p>
        )}
      </section>

      <section className="mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900">
            {getContentValue(content, "home.vagas.title")}
          </h2>
          <Link
            href="/vagas"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Ver todas →
          </Link>
        </div>
        {vagas.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {vagas.map((vaga) => (
              <VagaCard key={vaga.id} vaga={vaga} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-zinc-500">
            {getContentValue(content, "home.empty.vagas")}{" "}
            <Link href="/vagas/nova" className="text-indigo-600">
              Publicar a primeira
            </Link>
          </p>
        )}
      </section>

      <div className="mt-20">
        <CommunityBlock content={content} />
      </div>
    </div>
  );
}
