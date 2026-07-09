import { NextRequest, NextResponse } from "next/server";
import { isSupabaseStorageUrl } from "@/lib/images/storage-url";

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src || !isSupabaseStorageUrl(src)) {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  const upstream = await fetch(src, { next: { revalidate: 3600 } });
  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
