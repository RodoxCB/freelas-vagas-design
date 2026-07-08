import Link from "next/link";
import { Button } from "@/components/ui";
import { getContentValue, type SiteContentMap } from "@/lib/site-content";

export function HeroBlocks({ content }: { content: SiteContentMap }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-zinc-900">
          {getContentValue(content, "home.block1.title")}
        </h2>
        <p className="mt-3 text-zinc-600">
          {getContentValue(content, "home.block1.text")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/designers">Buscar designers</Button>
          <Button href="/vagas/nova" variant="secondary">
            Publicar vaga
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-zinc-900">
          {getContentValue(content, "home.block2.title")}
        </h2>
        <p className="mt-3 text-zinc-600">
          {getContentValue(content, "home.block2.text")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/designers/novo">Criar meu perfil</Button>
          <Button href="/vagas" variant="secondary">
            Ver vagas
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks({ content }: { content: SiteContentMap }) {
  const steps = [
    {
      title: getContentValue(content, "home.how.step1.title"),
      description: getContentValue(content, "home.how.step1.text"),
    },
    {
      title: getContentValue(content, "home.how.step2.title"),
      description: getContentValue(content, "home.how.step2.text"),
    },
    {
      title: getContentValue(content, "home.how.step3.title"),
      description: getContentValue(content, "home.how.step3.text"),
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-zinc-900">
        {getContentValue(content, "home.how.title")}
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-primary)]">{i + 1}</span>
            <h3 className="font-medium text-zinc-900">{step.title}</h3>
            <p className="text-sm text-zinc-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CommunityBlock({ content }: { content: SiteContentMap }) {
  const comunidadeUrl =
    content["comunidade.url"]?.trim() ||
    process.env.NEXT_PUBLIC_COMUNIDADE_URL ||
    "/comunidade";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
      <h2 className="text-2xl font-semibold text-zinc-900">
        {getContentValue(content, "home.community.title")}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-zinc-600">
        {getContentValue(content, "home.community.text")}
      </p>
      <div className="mt-6">
        <Link
          href={comunidadeUrl}
          target={comunidadeUrl.startsWith("http") ? "_blank" : undefined}
          rel={comunidadeUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          className="inline-flex rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          {getContentValue(content, "home.community.button")}
        </Link>
      </div>
    </section>
  );
}
