import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUserDetailAdmin } from "@/actions/admin";
import { DesignerAvatar } from "@/components/designers/designer-avatar";
import { Badge } from "@/components/ui";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserDetailAdmin(id);
  return {
    title: user ? `Admin — ${user.email}` : "Admin — Usuário",
  };
}

export default async function AdminUsuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserDetailAdmin(id);
  if (!user) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/admin/usuarios"
        className="text-sm text-[var(--color-primary)] hover:opacity-80"
      >
        ← Voltar para usuários
      </Link>

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <DesignerAvatar
            nome={user.nome}
            fotoUrl={user.designer?.foto_url}
            size="xl"
            variant="zinc"
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-zinc-900">
                {user.nome ?? "Sem nome"}
              </h2>
              {user.is_admin && <Badge color="indigo">Admin</Badge>}
              <Badge>{user.tipo}</Badge>
            </div>
            <p className="text-zinc-600">{user.email}</p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Cadastro</dt>
                <dd>{formatDate(user.created_at)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Email confirmado</dt>
                <dd>{formatDate(user.email_confirmed_at)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Último login</dt>
                <dd>{formatDate(user.last_sign_in_at)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Última atividade</dt>
                <dd>{formatDate(user.last_seen_at)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">ID</dt>
                <dd className="font-mono text-xs">{user.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {user.designer && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-zinc-900">Perfil de designer</h3>
            <Link
              href={`/designers/${user.designer.id}`}
              className="text-sm text-[var(--color-primary)] hover:opacity-80"
            >
              Ver público →
            </Link>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-500">Nome</dt>
              <dd>{user.designer.nome}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Status</dt>
              <dd className="capitalize">{user.designer.status}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Nível</dt>
              <dd className="capitalize">{user.designer.nivel}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">WhatsApp</dt>
              <dd>{user.designer.whatsapp ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-500">Bio</dt>
              <dd>{user.designer.bio ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-500">Especialidades</dt>
              <dd>{user.designer.especialidades?.join(", ") || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-zinc-500">Portfólio</dt>
              <dd>
                {user.designer.portfolio_urls?.length ? (
                  <ul className="list-inside list-disc">
                    {user.designer.portfolio_urls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-primary)] hover:opacity-80"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </section>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-zinc-900">
          Vagas ({user.vagas.length})
        </h3>
        {user.vagas.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Nenhuma vaga publicada.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {user.vagas.map((vaga) => (
              <li
                key={vaga.id}
                className="flex gap-4 rounded-lg border border-zinc-100 p-4"
              >
                {vaga.imagem_url ? (
                  <Image
                    src={vaga.imagem_url}
                    alt={vaga.titulo}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-500">
                    Sem imagem
                  </span>
                )}
                <div>
                  <p className="font-medium text-zinc-900">{vaga.titulo}</p>
                  <p className="text-sm capitalize text-zinc-600">
                    {vaga.tipo} · {vaga.status}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Expira: {formatDate(vaga.expires_at)}
                  </p>
                  <Link
                    href={`/vagas/${vaga.id}`}
                    className="mt-1 inline-block text-sm text-[var(--color-primary)] hover:opacity-80"
                  >
                    Ver vaga →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {user.images.length > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-zinc-900">Imagens carregadas</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.images.map((image) => (
              <figure key={image.url} className="overflow-hidden rounded-lg border border-zinc-100">
                <Image
                  src={image.url}
                  alt={image.label}
                  width={400}
                  height={300}
                  className="h-40 w-full object-cover"
                />
                <figcaption className="px-3 py-2 text-xs text-zinc-600">
                  {image.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
