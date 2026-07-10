"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileMenuSheet } from "@/components/layout/mobile-menu";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

type MobileNavContextValue = {
  openMenu: () => void;
  closeMenu: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    return { openMenu: () => {}, closeMenu: () => {} };
  }
  return ctx;
}

export function MobileNavProvider({
  children,
  user,
  profile,
}: {
  children: ReactNode;
  user: User | null;
  profile: Profile | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <MobileNavContext.Provider value={{ openMenu, closeMenu }}>
      {children}
      <BottomNav onAccountClick={openMenu} />
      <MobileMenuSheet
        open={menuOpen}
        onClose={closeMenu}
        user={user}
        profile={profile}
      />
    </MobileNavContext.Provider>
  );
}
