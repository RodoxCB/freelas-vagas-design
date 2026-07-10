"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBriefcase,
  IconDesigners,
  IconUser,
  IconUsers,
} from "@/components/ui/icons";

const items = [
  { href: "/designers", label: "Designers", icon: IconDesigners },
  { href: "/vagas", label: "Vagas", icon: IconBriefcase },
  { href: "/comunidade", label: "Comunidade", icon: IconUsers },
] as const;

export function BottomNav({
  onAccountClick,
}: {
  onAccountClick?: () => void;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white md:hidden"
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-around pb-safe">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/designers"
              ? pathname.startsWith("/designers")
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[3.5rem] min-w-[4rem] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
                active
                  ? "text-[var(--color-primary)]"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onAccountClick}
          className="flex min-h-[3.5rem] min-w-[4rem] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-zinc-500 transition hover:text-zinc-700"
          aria-label="Conta e menu"
        >
          <IconUser className="h-5 w-5" />
          Conta
        </button>
      </div>
    </nav>
  );
}
