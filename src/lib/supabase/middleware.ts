import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/is-admin-user";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let user = null;
  let timer: NodeJS.Timeout | undefined;
  try {
    const userPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Supabase auth timeout")), 3000);
    });
    const res = await Promise.race([userPromise, timeoutPromise]);
    user = res.data?.user ?? null;
  } catch (err) {
    console.warn("[middleware] Supabase auth no disponible o timeout:", err);
    user = null;
  } finally {
    if (timer) clearTimeout(timer);
  }

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isAdminRoute && !isLoginPage && user && !isAdminUser(user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "denied");
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isLoginPage && user && isAdminUser(user)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  return supabaseResponse;
}
