import Link from "next/link";

export const metadata = {
  title: "Comunidade — Freelas e Vagas de Design",
};

export default function ComunidadePage() {
  const comunidadeUrl =
    process.env.NEXT_PUBLIC_COMUNIDADE_URL || "#";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">Comunidade</h1>
      <p className="mt-6 text-lg text-zinc-600">
        Esse projeto existe por causa da comunidade.
      </p>
      <p className="mt-4 text-zinc-600">
        Aqui você encontra gente de verdade, disponível e aberta a trabalhar. O
        site é só uma forma de organizar e facilitar essas conexões.
      </p>
      {comunidadeUrl !== "#" ? (
        <Link
          href={comunidadeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Entrar no grupo
        </Link>
      ) : (
        <p className="mt-8 text-sm text-zinc-500">
          Link do grupo em breve.
        </p>
      )}
    </div>
  );
}
