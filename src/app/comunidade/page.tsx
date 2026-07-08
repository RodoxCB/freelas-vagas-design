import Link from "next/link";
import { getContentValue, getSiteContent, resolveComunidadeUrl } from "@/lib/site-content";

export async function generateMetadata() {
  const content = await getSiteContent();
  return {
    title: `${getContentValue(content, "comunidade.title")} — ${getContentValue(content, "site.name")}`,
  };
}

export default async function ComunidadePage() {
  const content = await getSiteContent();
  const comunidadeUrl = resolveComunidadeUrl(content);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">
        {getContentValue(content, "comunidade.title")}
      </h1>
      <p className="mt-6 text-lg text-zinc-600">
        {getContentValue(content, "comunidade.lead")}
      </p>
      <p className="mt-4 text-zinc-600">
        {getContentValue(content, "comunidade.body")}
      </p>
      {comunidadeUrl && comunidadeUrl !== "#" && comunidadeUrl !== "/comunidade" ? (
        <Link
          href={comunidadeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          {getContentValue(content, "comunidade.button")}
        </Link>
      ) : (
        <p className="mt-8 text-sm text-zinc-500">Link do grupo em breve.</p>
      )}
    </div>
  );
}
