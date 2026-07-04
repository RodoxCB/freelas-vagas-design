import Image from "next/image";
import { notFound } from "next/navigation";
import { getDesignerById } from "@/actions/designers";
import { Badge, Button } from "@/components/ui";
import { whatsappLink } from "@/lib/utils/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const designer = await getDesignerById(id);
  return {
    title: designer
      ? `${designer.nome} — Freelas e Vagas de Design`
      : "Designer não encontrado",
  };
}

export default async function DesignerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const designer = await getDesignerById(id);

  if (!designer) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {designer.foto_url ? (
            <Image
              src={designer.foto_url}
              alt={designer.nome}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-700">
              {designer.nome.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-zinc-900">{designer.nome}</h1>
            <p className="mt-1 text-zinc-600">{designer.nivel}</p>
            {designer.localizacao && (
              <p className="mt-1 text-sm text-zinc-500">{designer.localizacao}</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {designer.especialidades.map((e) => (
                <Badge key={e} color="indigo">{e}</Badge>
              ))}
            </div>
          </div>
        </div>

        {designer.bio && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-zinc-900">Bio</h2>
            <p className="mt-2 text-zinc-600">{designer.bio}</p>
          </div>
        )}

        {designer.tags && designer.tags.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-zinc-900">Ferramentas</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {designer.tags.map((tag) => (
                <Badge key={tag.id}>{tag.nome}</Badge>
              ))}
            </div>
          </div>
        )}

        {designer.portfolio_urls.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-zinc-900">Portfólio</h2>
            <ul className="mt-2 space-y-1">
              {designer.portfolio_urls.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {designer.linkedin_url && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-zinc-900">LinkedIn</h2>
            <a
              href={designer.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-700"
            >
              {designer.linkedin_url}
            </a>
          </div>
        )}

        <div className="mt-8 border-t border-zinc-100 pt-8">
          <a
            href={whatsappLink(
              designer.whatsapp,
              `Olá ${designer.nome}, vi seu perfil no Freelas e Vagas de Design!`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-zinc-600">Procurando oportunidades?</p>
        <Button href="/vagas" variant="secondary" className="mt-3">
          Ver vagas abertas
        </Button>
      </div>
    </div>
  );
}
