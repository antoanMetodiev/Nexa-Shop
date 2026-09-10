"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import type { OrderStatus } from "@/lib/supabase/types";

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<{ error?: string }> {
  await requireAdminAction();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("updateOrderStatus failed:", error.message);
    return { error: "Неуспешна промяна на статуса." };
  }

  revalidatePath("/[locale]/admin/orders", "page");
  revalidatePath("/[locale]/admin/orders/[id]", "page");
  return {};
}
