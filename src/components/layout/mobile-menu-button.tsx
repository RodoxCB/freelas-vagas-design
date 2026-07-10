"use client";

import { IconMenu } from "@/components/ui/icons";
import { useMobileNav } from "@/components/layout/mobile-nav-provider";

export function MobileMenuButton() {
  const { openMenu } = useMobileNav();

  return (
    <button
      type="button"
      onClick={openMenu}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 md:hidden"
      aria-label="Abrir menu"
    >
      <IconMenu />
    </button>
  );
}
