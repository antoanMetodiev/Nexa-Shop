"use client";

import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-navy-200 px-3 py-1.5 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50"
    >
      Изход
    </button>
  );
}
