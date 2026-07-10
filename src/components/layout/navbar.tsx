import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui";
import { getProfile, getSession } from "@/lib/auth/session";
import { getContentValue, getSiteContent } from "@/lib/site-content";

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
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <SiteLogo name={getContentValue(content, "site.name")} />
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm text-zinc-600 transition hover:text-zinc-900 md:block"
            >
              {link.label}
            </Link>
          ))}

          <div className="hidden items-center gap-4 md:flex">
            {user && profile?.tipo === "designer" && (
              <Link
                href="/designers/editar"
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                Meu perfil
              </Link>
            )}

            {user && (
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
                <Button href="/cadastro">Criar conta</Button>
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
              <Button href="/designers/novo">Criar perfil</Button>
            )}
            {user && (
              <Button href="/vagas/nova">Publicar vaga</Button>
            )}
          </div>

          <MobileMenuButton />
        </nav>
      </div>
    </header>
  );
}
