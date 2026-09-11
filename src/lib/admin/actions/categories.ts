"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

/**
 * Categories aren't a separate table - they're just the distinct values of
 * products.category, and each slug needs a matching entry in the
 * categoryNames translation namespace (messages/*.json) to display a name
 * on the storefront. So instead of free-text renaming (which could create
 * a slug with no translation and break public category pages), admins can
 * only move all products from one EXISTING category into another - useful
 * for merging duplicates or fixing a miscategorized batch.
 */
export async function reassignCategory(
  fromSlug: string,
  toSlug: string,
): Promise<{ error?: string }> {
  await requireAdminAction();

  if (!fromSlug || !toSlug || fromSlug === toSlug) {
    return { error: "Избери две различни категории." };
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update({ category: toSlug })
    .eq("category", fromSlug);

  if (error) {
    console.error("reassignCategory failed:", error.message);
    return { error: "Неуспешно преместване на продуктите." };
  }

  revalidatePath("/", "layout");
  return {};
}
