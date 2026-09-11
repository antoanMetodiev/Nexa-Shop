import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Cookie-based client for the browser, used only by client components that
 * need auth (sign in/up/out, OAuth). Separate from lib/supabase/client.ts
 * (which is the plain anon-key client used for public reads from both
 * Server and Client Components) because createBrowserClient relies on
 * document.cookie and isn't valid to call from a Server Component.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
