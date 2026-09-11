import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

function getClient(): SupabaseClient<Database> {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      );
    }
    client = createClient<Database>(supabaseUrl, supabaseKey);
  }
  return client;
}

// Lazily initialized so importing this module never crashes the build when
// env vars aren't present yet (e.g. during static analysis) - the real
// client (and its validation) is only created on first actual use.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
