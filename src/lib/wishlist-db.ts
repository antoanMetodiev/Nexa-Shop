import { createClient } from "@/lib/supabase/browser-client";

/**
 * DB-backed wishlist for signed-in users. Uses the cookie-based browser
 * client (not lib/supabase/client.ts, which keeps its own localStorage
 * session separate from the SSR auth cookies) so that auth.uid() resolves
 * in the RLS policies (migration 0006).
 */

export async function getWishlistProductIds(userId: string): Promise<number[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("getWishlistProductIds failed:", error?.message);
    return [];
  }
  return data.map((row) => row.product_id);
}

export async function addWishlistItem(
  userId: string,
  productId: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .upsert(
      { user_id: userId, product_id: productId },
      { onConflict: "user_id,product_id", ignoreDuplicates: true },
    );

  if (error) console.error("addWishlistItem failed:", error.message);
}

export async function removeWishlistItem(
  userId: string,
  productId: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) console.error("removeWishlistItem failed:", error.message);
}
