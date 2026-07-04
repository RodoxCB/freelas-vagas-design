import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { TIPO_VAGA_LABELS } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/utils/dates";
import type { Vaga } from "@/types/database";

export function VagaCard({ vaga }: { vaga: Vaga }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      {vaga.imagem_url && (
        <Image
          src={vaga.imagem_url}
          alt={vaga.titulo}
          width={400}
          height={160}
          className="h-40 w-full object-cover"
          unoptimized
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-zinc-900">{vaga.titulo}</h3>
            <p className="mt-1 text-sm text-zinc-500">
              {formatRelativeDate(vaga.created_at)}
            </p>
          </div>
          <Badge color="violet">{TIPO_VAGA_LABELS[vaga.tipo]}</Badge>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-zinc-600">{vaga.descricao}</p>
        <div className="mt-4">
          <Link
            href={`/vagas/${vaga.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Ver vaga →
          </Link>
        </div>
      </div>
    </div>
  );
}
