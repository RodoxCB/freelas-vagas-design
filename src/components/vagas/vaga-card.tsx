import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { IconWhatsApp } from "@/components/ui/icons";
import { TIPO_VAGA_LABELS } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/utils/dates";
import { vagaWhatsappMessage, whatsappLink } from "@/lib/utils/whatsapp";
import type { Vaga } from "@/types/database";

const tipoBadgeColor = {
  freela: "indigo",
  estagio: "amber",
  clt: "violet",
} as const;

export function VagaCard({ vaga }: { vaga: Vaga }) {
  const waMessage = vagaWhatsappMessage(vaga.titulo);
  const badgeColor = tipoBadgeColor[vaga.tipo] ?? "violet";

  return (
    <article className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white">
      <Link
        href={`/vagas/${vaga.id}`}
        className="absolute inset-0 z-0"
        aria-label={`Ver vaga ${vaga.titulo}`}
      />
      {vaga.imagem_url && (
        <div className="relative z-[1] pointer-events-none">
          <Image
            src={vaga.imagem_url}
            alt=""
            width={400}
            height={128}
            className="h-32 w-full object-cover sm:h-40"
            loading="lazy"
            unoptimized
          />
        </div>
      )}
      <div className="relative z-[1] p-4 pointer-events-none sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-zinc-900">{vaga.titulo}</h3>
            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
              {formatRelativeDate(vaga.created_at)}
            </p>
          </div>
          <Badge color={badgeColor}>{TIPO_VAGA_LABELS[vaga.tipo]}</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">
          {vaga.descricao}
        </p>
      </div>
      <div className="relative z-10 flex gap-2 p-4 pt-0 sm:p-6 sm:pt-0">
        <a
          href={whatsappLink(vaga.contato_telefone, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          <IconWhatsApp className="h-4 w-4 shrink-0" />
          WhatsApp
        </a>
        <Link
          href={`/vagas/${vaga.id}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          Detalhes
        </Link>
      </div>
    </article>
  );
}

export function VagaCardCompact({ vaga }: { vaga: Vaga }) {
  const badgeColor = tipoBadgeColor[vaga.tipo] ?? "violet";

  return (
    <Link
      href={`/vagas/${vaga.id}`}
      className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-4 transition hover:border-zinc-300"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">{vaga.titulo}</h3>
        <Badge color={badgeColor}>{TIPO_VAGA_LABELS[vaga.tipo]}</Badge>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{formatRelativeDate(vaga.created_at)}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">
        {vaga.descricao}
      </p>
    </Link>
  );
}
