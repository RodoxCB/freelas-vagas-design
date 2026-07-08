import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes: Record<string, "designer" | "anunciante" | "any" | "admin"> = {
  "/designers/novo": "designer",
  "/designers/editar": "designer",
  "/vagas/nova": "anunciante",
  "/vagas/minhas": "anunciante",
  "/conta/dados": "any",
  "/admin": "admin",
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Refresh session on every request
  const { data: { user } } = await supabase.auth.getUser();

  const matched = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  );

  if (matched) {
    const [, requiredTipo] = matched;
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (requiredTipo === "admin") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else if (requiredTipo !== "any") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("tipo")
        .eq("id", user.id)
        .single();

      if (!profile || profile.tipo !== requiredTipo) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
