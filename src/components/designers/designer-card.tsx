import Link from "next/link";
import { DesignerAvatar } from "@/components/designers/designer-avatar";
import { Badge, Button } from "@/components/ui";
import { whatsappLink } from "@/lib/utils/whatsapp";
import type { Designer } from "@/types/database";

export function DesignerCard({ designer }: { designer: Designer }) {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <DesignerAvatar nome={designer.nome} fotoUrl={designer.foto_url} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900">{designer.nome}</h3>
          <p className="text-sm text-zinc-600">
            {designer.especialidades.slice(0, 2).join(" · ")}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge color="indigo">{designer.nivel}</Badge>
        {designer.especialidades.slice(0, 3).map((e) => (
          <Badge key={e}>{e}</Badge>
        ))}
      </div>

      {designer.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-zinc-600">{designer.bio}</p>
      )}

      {designer.tags && designer.tags.length > 0 && (
        <p className="mt-3 text-xs text-zinc-500">
          {designer.tags.map((t) => t.nome).join(" · ")}
        </p>
      )}

      <div className="mt-6 flex gap-2">
        <Button href={`/designers/${designer.id}`} variant="secondary" size="md" className="flex-1">
          Ver perfil
        </Button>
        <a
          href={whatsappLink(designer.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition hover:opacity-90"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

export function DesignerCardCompact({ designer }: { designer: Designer }) {
  return (
    <Link
      href={`/designers/${designer.id}`}
      className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
    >
      <DesignerAvatar nome={designer.nome} fotoUrl={designer.foto_url} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900">{designer.nome}</p>
        <p className="text-sm text-zinc-600">
          {designer.especialidades.slice(0, 2).join(" · ")} · {designer.nivel}
        </p>
      </div>
    </Link>
  );
}
