"use client";

import { getContentValue, type SiteContentMap } from "@/lib/site-content";
import Image from "next/image";
import {
  CommunityBlock,
  HeroBlocks,
  HowItWorks,
} from "@/components/home/sections";
import { themeCssVariables } from "@/lib/site-content/theme";

function PreviewFrame({
  content,
  children,
}: {
  content: SiteContentMap;
  children: React.ReactNode;
}) {
  const vars = themeCssVariables(content);

  return (
    <div
      className="overflow-hidden rounded-xl border border-zinc-200"
      style={{
        ...vars,
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      {children}
    </div>
  );
}

function GeralPreview({ content }: { content: SiteContentMap }) {
  return (
    <PreviewFrame content={content}>
      <header className="flex items-center gap-2.5 border-b border-zinc-200 bg-white px-4 py-3">
        <Image
          src="/logo.png"
          alt={getContentValue(content, "site.name")}
          width={32}
          height={32}
          className="rounded-full"
        />
        <p className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          {getContentValue(content, "site.name")}
        </p>
      </header>
      <main className="px-4 py-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          SEO
        </p>
        <p className="mt-1 text-sm">{getContentValue(content, "site.description")}</p>
      </main>
      <footer className="border-t border-zinc-200 bg-white px-4 py-4 text-center text-sm text-zinc-600">
        {getContentValue(content, "footer.tagline")}
      </footer>
    </PreviewFrame>
  );
}

function HomePreview({ content }: { content: SiteContentMap }) {
  return (
    <PreviewFrame content={content}>
      <div className="space-y-8 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
            {getContentValue(content, "home.hero.title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            {getContentValue(content, "home.hero.subtitle")}
          </p>
        </div>
        <HeroBlocks content={content} />
        <HowItWorks content={content} />
        <CommunityBlock content={content} />
      </div>
    </PreviewFrame>
  );
}

function ComunidadePreview({ content }: { content: SiteContentMap }) {
  return (
    <PreviewFrame content={content}>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          {getContentValue(content, "comunidade.title")}
        </h2>
        <p className="mt-4 text-zinc-600">{getContentValue(content, "comunidade.lead")}</p>
        <p className="mt-2 text-zinc-600">{getContentValue(content, "comunidade.body")}</p>
        <span
          className="mt-6 inline-flex rounded-lg px-5 py-2.5 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {getContentValue(content, "comunidade.button")}
        </span>
      </div>
    </PreviewFrame>
  );
}

function ApoiarPreview({ content }: { content: SiteContentMap }) {
  const pixKey = getContentValue(content, "apoiar.pix_key").trim();

  return (
    <PreviewFrame content={content}>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          {getContentValue(content, "apoiar.title")}
        </h2>
        <p className="mt-4 text-zinc-600">{getContentValue(content, "apoiar.lead")}</p>
        <p className="mt-2 text-zinc-600">{getContentValue(content, "apoiar.body")}</p>
        {pixKey ? (
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 text-left">
            <p className="text-center text-sm font-medium">
              {getContentValue(content, "apoiar.note")}
            </p>
            <p className="mt-3 break-all rounded bg-zinc-50 px-3 py-2 font-mono text-xs">
              {pixKey}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-zinc-500">
            {getContentValue(content, "apoiar.note")}
          </p>
        )}
      </div>
    </PreviewFrame>
  );
}

function TemaPreview({ content }: { content: SiteContentMap }) {
  return (
    <PreviewFrame content={content}>
      <div className="space-y-4 p-6">
        <p className="text-sm font-medium">Exemplo de interface</p>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Botão primário
        </button>
        <p className="text-sm" style={{ color: "var(--color-text)" }}>
          Texto principal sobre fundo da página.
        </p>
        <a
          href="#"
          className="text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
          onClick={(e) => e.preventDefault()}
        >
          Link de ação
        </a>
      </div>
    </PreviewFrame>
  );
}

export function CmsSectionPreview({
  sectionId,
  content,
}: {
  sectionId: string;
  content: SiteContentMap;
}) {
  switch (sectionId) {
    case "geral":
      return <GeralPreview content={content} />;
    case "home":
      return <HomePreview content={content} />;
    case "comunidade":
      return <ComunidadePreview content={content} />;
    case "apoiar":
      return <ApoiarPreview content={content} />;
    case "tema":
      return <TemaPreview content={content} />;
    default:
      return null;
  }
}
