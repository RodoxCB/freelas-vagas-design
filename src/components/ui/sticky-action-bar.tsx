import { type ReactNode } from "react";

export function StickyActionBar({
  children,
  label = "Ações",
  className = "",
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      className={`fixed inset-x-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm pb-safe bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-0 ${className}`}
    >
      <div className="mx-auto flex max-w-3xl gap-2">{children}</div>
    </div>
  );
}
