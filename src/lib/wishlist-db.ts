import { supabase } from "@/lib/supabase/client";

/**
 * DB-backed wishlist for signed-in users — ready for when Clerk auth lands.
 * Not wired into the UI yet: `wishlist_items` has RLS enabled with no
 * policies (see migration 0003), so these calls will get an empty/denied
 * result with the anon key until real per-user policies are added. Once
 * Clerk provides a user id, `WishlistProvider` should branch to these
 * functions instead of localStorage for signed-in users.
 */

export async function getWishlistProductIds(userId: string): Promise<number[]> {
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
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) console.error("removeWishlistItem failed:", error.message);
}
