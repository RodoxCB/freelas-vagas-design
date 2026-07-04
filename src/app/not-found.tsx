import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">Página não encontrada</h1>
      <p className="mt-2 text-zinc-600">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Voltar para home
      </Link>
    </div>
  );
}
