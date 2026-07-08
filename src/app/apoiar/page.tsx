import Link from "next/link";
import { PixCopyButton } from "@/components/apoiar/pix-copy-button";
import { getContentValue, getSiteContent } from "@/lib/site-content";

export async function generateMetadata() {
  const content = await getSiteContent();
  return {
    title: `${getContentValue(content, "apoiar.title")} — ${getContentValue(content, "site.name")}`,
  };
}

export default async function ApoiarPage() {
  const content = await getSiteContent();
  const linkUrl = getContentValue(content, "apoiar.link_url").trim();
  const linkLabel = getContentValue(content, "apoiar.link_label").trim();
  const pixKey = getContentValue(content, "apoiar.pix_key").trim();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">
        {getContentValue(content, "apoiar.title")}
      </h1>
      <p className="mt-6 text-lg text-zinc-600">
        {getContentValue(content, "apoiar.lead")}
      </p>
      <p className="mt-4 text-zinc-600">
        {getContentValue(content, "apoiar.body")}
      </p>

      {pixKey ? (
        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 text-left">
          <p className="text-center text-sm font-medium text-zinc-900">
            {getContentValue(content, "apoiar.note")}
          </p>
          <p className="mt-4 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
            Chave Pix
          </p>
          <p className="mt-2 break-all rounded-lg bg-zinc-50 px-4 py-3 text-center font-mono text-sm text-zinc-800">
            {pixKey}
          </p>
          <div className="mt-4 flex justify-center">
            <PixCopyButton pixKey={pixKey} />
          </div>
        </div>
      ) : (
        <p className="mt-8 text-sm text-zinc-500">
          {getContentValue(content, "apoiar.note")}
        </p>
      )}

      {linkUrl && linkLabel ? (
        <Link
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
