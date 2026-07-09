const STORAGE_PUBLIC_PATH = "/storage/v1/object/public/";

export function isSupabaseStorageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const projectHost = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.supabase.co"
    ).hostname;
    return (
      parsed.hostname === projectHost &&
      parsed.pathname.startsWith(STORAGE_PUBLIC_PATH)
    );
  } catch {
    return false;
  }
}

/** Serve Supabase storage via same-origin proxy to avoid browser/adblock blocking. */
export function proxiedStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!isSupabaseStorageUrl(url)) return url;
  return `/api/image?src=${encodeURIComponent(url)}`;
}
