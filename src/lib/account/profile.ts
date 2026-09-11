import "server-only";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import type { UserRow } from "@/lib/supabase/types";

/**
 * Loads the public.users row for a signed-in auth user. If it doesn't exist
 * yet (account created before migration 0011, or the trigger was skipped),
 * it's created on the spot from the auth metadata so the account page
 * always has a row to edit.
 */
export async function getOrCreateProfile(user: User): Promise<UserRow> {
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const seed = {
    id: user.id,
    email: user.email ?? null,
    full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
    phone: (user.user_metadata?.phone as string | undefined) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  const { data: created, error } = await supabaseAdmin
    .from("users")
    .upsert(seed, { onConflict: "id" })
    .select("*")
    .single();

  if (error || !created) {
    throw new Error(`Failed to create profile: ${error?.message}`);
  }
  return created;
}
