import { createClient } from "@/lib/supabase/browser-client";
import type { CartItem } from "@/lib/cart-context";

/**
 * DB-backed cart for signed-in users, mirrors wishlist-db.ts. Stores a
 * snapshot of title/thumbnail/price (see migration 0007) so cart prices
 * don't drift after adding - same as the current localStorage behavior.
 */

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, title, thumbnail, price, quantity")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("getCartItems failed:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.product_id,
    title: row.title,
    thumbnail: row.thumbnail,
    price: row.price,
    quantity: row.quantity,
  }));
}

export async function upsertCartItem(
  userId: string,
  item: Omit<CartItem, "quantity">,
  quantity: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: userId,
      product_id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      price: item.price,
      quantity,
    },
    { onConflict: "user_id,product_id" },
  );

  if (error) console.error("upsertCartItem failed:", error.message);
}

export async function removeCartItem(
  userId: string,
  productId: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) console.error("removeCartItem failed:", error.message);
}

export async function clearCartItems(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) console.error("clearCartItems failed:", error.message);
}
