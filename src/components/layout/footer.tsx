import Link from "next/link";
import { getContentValue, getSiteContent } from "@/lib/site-content";

export async function Footer() {
  const content = await getSiteContent();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white bottom-nav-offset md:bottom-nav-offset-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-zinc-500">
          {getContentValue(content, "footer.tagline")}
        </p>
        <div className="flex flex-wrap gap-6">
          <Link
            href="/privacidade"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Privacidade
          </Link>
          <Link
            href="/termos"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Termos
          </Link>
          <Link
            href="/comunidade"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Comunidade
          </Link>
          <Link
            href="/apoiar"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Apoiar
          </Link>
        </div>
      </div>
    </footer>
  );
}
