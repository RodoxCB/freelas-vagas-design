import Link from "next/link";
import { Button } from "@/components/ui";

export function HeroBlocks() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-zinc-900">
          Precisa de um designer?
        </h2>
        <p className="mt-3 text-zinc-600">
          Encontre alguém disponível ou publique uma oportunidade e receba
          contatos direto
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
          Você é designer?
        </h2>
        <p className="mt-3 text-zinc-600">
          Crie seu perfil para ser encontrado ou explore vagas abertas na
          comunidade
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

export function HowItWorks() {
  const steps = [
    {
      title: "Crie seu perfil ou publique uma vaga",
      description: "Sem cadastro complicado. Preencha o básico e pronto.",
    },
    {
      title: "Encontre oportunidades ou profissionais",
      description: "Busque por área, nível e disponibilidade.",
    },
    {
      title: "Converse direto pelo canal informado",
      description: "WhatsApp, email ou link externo. Sem intermediários.",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-zinc-900">Como funciona</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="space-y-2">
            <span className="text-sm font-medium text-indigo-600">
              {i + 1}
            </span>
            <h3 className="font-medium text-zinc-900">{step.title}</h3>
            <p className="text-sm text-zinc-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CommunityBlock() {
  const comunidadeUrl =
    process.env.NEXT_PUBLIC_COMUNIDADE_URL || "/comunidade";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
      <h2 className="text-2xl font-semibold text-zinc-900">Comunidade</h2>
      <p className="mx-auto mt-4 max-w-xl text-zinc-600">
        Esse projeto nasceu de um grupo de designers que compartilham
        oportunidades todos os dias. A ideia é deixar isso mais organizado,
        aberto e fácil para todo mundo.
      </p>
      <div className="mt-6">
        <Link
          href={comunidadeUrl}
          target={comunidadeUrl.startsWith("http") ? "_blank" : undefined}
          rel={comunidadeUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          className="inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Entrar na comunidade
        </Link>
      </div>
    </section>
  );
}
