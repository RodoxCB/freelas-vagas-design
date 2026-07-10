"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui";
import { IconClose } from "@/components/ui/icons";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

export function MobileMenuSheet({
  open,
  onClose,
  user,
  profile,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
  profile: Profile | null;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-lg motion-safe:animate-[slideUp_0.25s_ease-out]"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 className="text-base font-semibold text-zinc-900">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
            aria-label="Fechar"
          >
            <IconClose />
          </button>
        </div>
        <div className="space-y-1 overflow-y-auto px-4 py-4 pb-safe">
          <MenuLink href="/designers" onNavigate={onClose}>
            Designers
          </MenuLink>
          <MenuLink href="/vagas" onNavigate={onClose}>
            Vagas
          </MenuLink>
          <MenuLink href="/comunidade" onNavigate={onClose}>
            Comunidade
          </MenuLink>
          <MenuLink href="/apoiar" onNavigate={onClose}>
            Apoiar
          </MenuLink>

          <div className="my-3 border-t border-zinc-100" />

          {user && profile?.tipo === "designer" && (
            <>
              <MenuLink href="/designers/editar" onNavigate={onClose}>
                Meu perfil
              </MenuLink>
              <div className="pt-2">
                <Button href="/designers/novo" className="w-full" onClick={onClose}>
                  Criar perfil
                </Button>
              </div>
            </>
          )}

          {user && (
            <>
              <MenuLink href="/vagas/minhas" onNavigate={onClose}>
                Minhas vagas
              </MenuLink>
              <div className="pt-2">
                <Button href="/vagas/nova" className="w-full" onClick={onClose}>
                  Publicar vaga
                </Button>
              </div>
            </>
          )}

          {user && (
            <MenuLink href="/conta/dados" onNavigate={onClose}>
              Meus dados
            </MenuLink>
          )}

          {!user ? (
            <div className="space-y-2 pt-2">
              <Button href="/login" variant="secondary" className="w-full" onClick={onClose}>
                Entrar
              </Button>
              <Button href="/cadastro" className="w-full" onClick={onClose}>
                Criar conta
              </Button>
            </div>
          ) : (
            <form action={signOutAction} className="pt-2">
              <button
                type="submit"
                className="flex min-h-11 w-full items-center rounded-lg px-3 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Sair
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
    >
      {children}
    </Link>
  );
}
