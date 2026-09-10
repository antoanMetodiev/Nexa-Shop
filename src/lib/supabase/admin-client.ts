import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

function getClient(): SupabaseClient<Database> {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      );
    }
    client = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

/**
 * Bypasses RLS entirely — only ever call this from server actions/route
 * handlers that have already verified the caller is an authenticated admin
 * (see requireAdmin in src/lib/admin/require-admin.ts). The "server-only"
 * import above makes accidentally bundling this into client code a build
 * error instead of a leaked secret.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
