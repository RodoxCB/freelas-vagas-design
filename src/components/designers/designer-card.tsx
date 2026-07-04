import Image from "next/image";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { whatsappLink } from "@/lib/utils/whatsapp";
import type { Designer } from "@/types/database";

function DesignerAvatar({ designer }: { designer: Designer }) {
  if (designer.foto_url) {
    return (
      <Image
        src={designer.foto_url}
        alt={designer.nome}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
        unoptimized
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
      {designer.nome.charAt(0).toUpperCase()}
    </div>
  );
}

export function DesignerCard({ designer }: { designer: Designer }) {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <DesignerAvatar designer={designer} />
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
        <Button href={`/designers/${designer.id}`} variant="secondary" className="flex-1">
          Ver perfil
        </Button>
        <a
          href={whatsappLink(designer.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Chamar no WhatsApp
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
      <DesignerAvatar designer={designer} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900">{designer.nome}</p>
        <p className="text-sm text-zinc-600">
          {designer.especialidades.slice(0, 2).join(" · ")} · {designer.nivel}
        </p>
      </div>
    </Link>
  );
}
