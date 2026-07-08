import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";

const links = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/designers", label: "Designers" },
  { href: "/admin/vagas", label: "Vagas" },
  { href: "/admin/conteudo", label: "Conteúdo do site" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) redirect("/login?redirect=/admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Administração</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Moderação e edição de conteúdo sem novo deploy
          </p>
        </div>
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700">
          ← Voltar ao site
        </Link>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
