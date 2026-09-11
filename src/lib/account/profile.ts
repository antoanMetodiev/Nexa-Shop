import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database, UserRow } from "@/lib/supabase/types";

/**
 * Loads the public.users row for a signed-in auth user through their own
 * session client (RLS: own row only) - deliberately NOT the service-role
 * client, so the account page renders even where SUPABASE_SERVICE_ROLE_KEY
 * isn't configured. If the row doesn't exist yet (account created before
 * migration 0011, or the trigger was skipped), it's created on the spot
 * from the auth metadata (insert policy from migration 0012).
 */
export async function getOrCreateProfile(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<UserRow> {
  const { data: existing, error: readError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    throw new Error(`Failed to load profile: ${readError.message}`);
  }
  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("users")
    .insert({
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      phone: (user.user_metadata?.phone as string | undefined) ?? null,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) ?? null,
    })
    .select("*")
    .single();

  if (error || !created) {
    throw new Error(`Failed to create profile: ${error?.message}`);
  }
  return created;
}
