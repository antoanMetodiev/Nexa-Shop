import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

/**
 * Cookie-based client for the browser, used only by client components that
 * need auth (sign in/up/out, OAuth). Separate from lib/supabase/client.ts
 * (which is the plain anon-key client used for public reads from both
 * Server and Client Components) because createBrowserClient relies on
 * document.cookie and isn't valid to call from a Server Component.
 *
 * Memoized as a module-level singleton — createBrowserClient() starts its
 * own GoTrueClient each call, and calling it repeatedly (every component
 * that needs auth calls createClient()) otherwise triggers Supabase's
 * "Multiple GoTrueClient instances" warning.
 */
export function createClient(): SupabaseClient<Database> {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
  }
  return client;
}
