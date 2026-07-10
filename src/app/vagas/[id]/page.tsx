import { notFound } from "next/navigation";
import { getVagaById } from "@/actions/vagas";
import { Container } from "@/components/ui/container";
import { Badge, Button } from "@/components/ui";
import { IconArrowLeft } from "@/components/ui/icons";
import {
  ExpandableText,
  VagaApplyBar,
} from "@/components/vagas/vaga-detail-client";
import { TIPO_VAGA_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/dates";
import { formatPhoneInternational } from "@/lib/utils/phone";
import { vagaWhatsappMessage, whatsappLink } from "@/lib/utils/whatsapp";
import Image from "next/image";
import Link from "next/link";

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

  const waHref = whatsappLink(
    vaga.contato_telefone,
    vagaWhatsappMessage(vaga.titulo)
  );

  return (
    <>
      <Container size="narrow" className="sticky-action-offset">
        <Link
          href="/vagas"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <IconArrowLeft className="h-4 w-4" />
          Vagas
        </Link>

        <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white">
          {vaga.imagem_url && (
            <Image
              src={vaga.imagem_url}
              alt={vaga.titulo}
              width={800}
              height={320}
              className="h-48 w-full object-cover sm:h-56"
              unoptimized
            />
          )}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start gap-3">
              <Badge color="violet">{TIPO_VAGA_LABELS[vaga.tipo]}</Badge>
              <span className="text-sm text-zinc-500">
                Publicada em {formatDate(vaga.created_at)}
              </span>
            </div>

            <h1 className="mt-4 text-xl font-semibold text-zinc-900 sm:text-2xl">
              {vaga.titulo}
            </h1>

            <div className="mt-6">
              <h2 className="text-sm font-medium text-zinc-900">Descrição</h2>
              <ExpandableText text={vaga.descricao} className="mt-2" />
            </div>

            {vaga.requisitos && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-zinc-900">Requisitos</h2>
                <ExpandableText text={vaga.requisitos} className="mt-2" />
              </div>
            )}

            <div className="mt-8 hidden border-t border-zinc-100 pt-8 space-y-3 md:block">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
              >
                Falar no WhatsApp ({formatPhoneInternational(vaga.contato_telefone)})
              </a>
              <a
                href={`mailto:${vaga.contato_email}`}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 sm:w-auto"
              >
                Enviar email
              </a>
              <p className="text-sm text-zinc-500">
                A candidatura acontece direto pelo canal informado pelo anunciante
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200/80 bg-white p-6 text-center">
          <p className="text-zinc-600">Precisa de um designer para o projeto?</p>
          <Button href="/designers" variant="secondary" className="mt-3">
            Ver designers
          </Button>
        </div>
      </Container>

      <div className="md:hidden">
        <VagaApplyBar email={vaga.contato_email} whatsappHref={waHref} />
      </div>
    </>
  );
}
