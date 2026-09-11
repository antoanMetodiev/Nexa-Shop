import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Cookie-based client for Server Components and Server Actions — reads the
 * signed-in user's session from request cookies. Writing cookies only
 * succeeds from Server Actions/Route Handlers; when called from a plain
 * Server Component the write is a no-op (ignored below), which is fine
 * because proxy.ts already refreshes the session cookie on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — proxy.ts handles the refresh.
          }
        },
      },
    },
  );
}
