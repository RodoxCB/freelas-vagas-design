import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { getProfile, getSession } from "@/lib/auth/session";
import { getContentValue, getSiteContent } from "@/lib/site-content";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui";

const links = [
  { href: "/designers", label: "Designers" },
  { href: "/vagas", label: "Vagas" },
  { href: "/comunidade", label: "Comunidade" },
];

export async function Navbar() {
  const { user } = await getSession();
  const [profile, content] = await Promise.all([
    user ? getProfile() : Promise.resolve(null),
    getSiteContent(),
  ]);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <SiteLogo name={getContentValue(content, "site.name")} />
        <nav className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm text-zinc-600 transition hover:text-zinc-900 sm:block"
            >
              {link.label}
            </Link>
          ))}

          {user && profile?.tipo === "designer" && (
            <Link
              href="/designers/editar"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Meu perfil
            </Link>
          )}

          {user && profile?.tipo === "anunciante" && (
            <Link
              href="/vagas/minhas"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Minhas vagas
            </Link>
          )}

          {user && (
            <Link
              href="/conta/dados"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Meus dados
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">
                Entrar
              </Link>
              <Button href="/cadastro" className="hidden sm:inline-flex">
                Criar conta
              </Button>
            </>
          ) : (
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                Sair
              </button>
            </form>
          )}

          {profile?.tipo === "designer" && (
            <Button href="/designers/novo" className="hidden sm:inline-flex">
              Criar perfil
            </Button>
          )}
          {profile?.tipo === "anunciante" && (
            <Button href="/vagas/nova" className="hidden sm:inline-flex">
              Publicar vaga
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
