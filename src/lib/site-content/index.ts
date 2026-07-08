import { createClient } from "@/lib/supabase/server";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentMap,
  resolveComunidadeUrl,
} from "./defaults";

export { SITE_CONTENT_DEFAULTS, SITE_CONTENT_GROUPS, SITE_CONTENT_LABELS } from "./defaults";
export { resolveComunidadeUrl };
export type { SiteContentMap };

export function getContentValue(content: SiteContentMap, key: string): string {
  return content[key] ?? SITE_CONTENT_DEFAULTS[key] ?? "";
}

export async function getSiteContent(): Promise<SiteContentMap> {
  const supabase = await createClient();
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

