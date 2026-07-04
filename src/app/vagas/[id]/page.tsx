import Image from "next/image";
import { notFound } from "next/navigation";
import { getVagaById } from "@/actions/vagas";
import { Badge, Button } from "@/components/ui";
import { TIPO_VAGA_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/dates";
import { formatPhone } from "@/lib/utils/phone";
import { whatsappLink } from "@/lib/utils/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vaga = await getVagaById(id);
  return {
    title: vaga
      ? `${vaga.titulo} — Freelas e Vagas de Design`
      : "Vaga não encontrada",
  };
}

export default async function VagaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vaga = await getVagaById(id);

  if (!vaga) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {vaga.imagem_url && (
          <Image
            src={vaga.imagem_url}
            alt={vaga.titulo}
            width={800}
            height={320}
            className="h-56 w-full object-cover"
            unoptimized
          />
        )}
        <div className="p-8">
          <div className="flex flex-wrap items-start gap-3">
            <Badge color="violet">{TIPO_VAGA_LABELS[vaga.tipo]}</Badge>
            <span className="text-sm text-zinc-500">
              Publicada em {formatDate(vaga.created_at)}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-zinc-900">{vaga.titulo}</h1>

          <div className="mt-8">
            <h2 className="text-sm font-medium text-zinc-900">Descrição</h2>
            <p className="mt-2 whitespace-pre-wrap text-zinc-600">{vaga.descricao}</p>
          </div>

          {vaga.requisitos && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-zinc-900">Requisitos</h2>
              <p className="mt-2 whitespace-pre-wrap text-zinc-600">{vaga.requisitos}</p>
            </div>
          )}

          <div className="mt-8 border-t border-zinc-100 pt-8 space-y-3">
            <a
              href={`mailto:${vaga.contato_email}`}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              Enviar email
            </a>
            <a
              href={whatsappLink(vaga.contato_telefone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 sm:w-auto"
            >
              Falar no WhatsApp ({formatPhone(vaga.contato_telefone.replace(/^55/, ""))})
            </a>
            <p className="text-sm text-zinc-500">
              A candidatura acontece direto pelo canal informado pelo anunciante
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-zinc-600">Precisa de um designer para o projeto?</p>
        <Button href="/designers" variant="secondary" className="mt-3">
          Ver designers
        </Button>
      </div>
    </div>
  );
}
