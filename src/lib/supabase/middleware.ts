import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const privatePrefixes = [
    "/dashboard",
    "/health",
    "/wellness",
    "/appointments",
    "/documents",
    "/guide",
    "/tools",
    "/profile",
    "/report",
    "/contractions",
    "/birth-plan",
    "/reminders",
  ];

  const isPrivateRoute = privatePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isOnboardingRoute = pathname === "/onboarding";
  const isHomeRoute = pathname === "/";
  const isCallbackRoute = pathname.startsWith("/auth/callback");

  if (!user && (isPrivateRoute || isOnboardingRoute)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (user && !isCallbackRoute && (isPrivateRoute || isOnboardingRoute || isHomeRoute)) {
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const hasProfile = Boolean(profile);

    if (!hasProfile && isPrivateRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (hasProfile && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isHomeRoute && hasProfile) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}
