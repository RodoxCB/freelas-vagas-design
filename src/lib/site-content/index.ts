import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import type { Database } from "@/types/database";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentMap,
  resolveComunidadeUrl,
} from "./defaults";

function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export { SITE_CONTENT_DEFAULTS, SITE_CONTENT_GROUPS, SITE_CONTENT_LABELS } from "./defaults";
export { resolveComunidadeUrl };
export type { SiteContentMap };

export function getContentValue(content: SiteContentMap, key: string): string {
  return content[key] ?? SITE_CONTENT_DEFAULTS[key] ?? "";
}

export async function getSiteContent(): Promise<SiteContentMap> {
  noStore();
  const supabase = createPublicClient();
  const { data } = await supabase.from("site_content").select("key, value");

  const merged: SiteContentMap = { ...SITE_CONTENT_DEFAULTS };

  for (const row of data ?? []) {
    const val = row.value;
    if (typeof val === "string") {
      merged[row.key] = val;
    } else if (val && typeof val === "object" && "text" in val) {
      merged[row.key] = String((val as { text: string }).text);
    }
  }

  if (!merged["comunidade.url"]) {
    merged["comunidade.url"] =
      process.env.NEXT_PUBLIC_COMUNIDADE_URL ?? SITE_CONTENT_DEFAULTS["comunidade.url"];
  }

  return merged;
}

