import "server-only";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Admin access is granted via app_metadata.role === "admin" on the Supabase
 * auth user, set manually per-user via SQL (see ADMIN_AUTH_PAYMENTS.md) -
 * app_metadata (unlike user_metadata) can only be changed with the service
 * role key, so users can't grant themselves access. Call this at the top of
 * every admin page/layout and every admin server action - pages get a
 * redirect, actions get a thrown error since they have no response to
 * redirect.
 */
export async function requireAdminPage(locale: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role;

  if (!user || role !== "admin") {
    redirect({ href: "/", locale: locale as Locale });
  }
  return user!.id;
}

export async function requireAdminAction(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role;

  if (!user || role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
  return user.id;
}
