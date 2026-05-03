import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && anonKey) {
      // Create the redirect response first so we can write session cookies onto it
      const response = NextResponse.redirect(`${origin}${next}`);

      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("[auth/callback] exchangeCodeForSession error:", error.message);
        return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error.message)}`);
      }

      return response;
    }
  }

  console.error("[auth/callback] No code in request. URL:", requestUrl.toString());
  return NextResponse.redirect(`${origin}/`);
}
