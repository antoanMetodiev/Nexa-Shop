import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import type { DiscountCodeRow } from "@/lib/supabase/types";

export async function getDiscountCodes(): Promise<DiscountCodeRow[]> {
  const { data, error } = await supabaseAdmin
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getDiscountCodes failed:", error?.message);
    return [];
  }
  return data;
}
