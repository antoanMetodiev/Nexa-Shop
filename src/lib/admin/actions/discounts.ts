"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export async function createDiscountCode(
  formData: FormData,
): Promise<{ error?: string }> {
  await requireAdminAction();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "");
  const value = Number(formData.get("value"));
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();
  const usageLimitRaw = String(formData.get("usage_limit") ?? "").trim();

  if (!code || (type !== "percentage" && type !== "fixed") || !(value > 0)) {
    return { error: "Попълни код, тип и валидна стойност." };
  }

  const { error } = await supabaseAdmin.from("discount_codes").insert({
    code,
    type,
    value,
    active: true,
    starts_at: null,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    usage_limit: usageLimitRaw ? Number(usageLimitRaw) : null,
  });

  if (error) {
    console.error("createDiscountCode failed:", error.message);
    return {
      error: error.code === "23505" ? "Този код вече съществува." : "Неуспешно създаване.",
    };
  }

  revalidatePath("/[locale]/admin/discounts", "page");
  return {};
}

export async function toggleDiscountCode(
  id: number,
  active: boolean,
): Promise<{ error?: string }> {
  await requireAdminAction();

  const { error } = await supabaseAdmin
    .from("discount_codes")
    .update({ active })
    .eq("id", id);

  if (error) {
    console.error("toggleDiscountCode failed:", error.message);
    return { error: "Неуспешна промяна." };
  }

  revalidatePath("/[locale]/admin/discounts", "page");
  return {};
}

export async function deleteDiscountCode(
  id: number,
): Promise<{ error?: string }> {
  await requireAdminAction();

  const { error } = await supabaseAdmin
    .from("discount_codes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteDiscountCode failed:", error.message);
    return { error: "Неуспешно изтриване." };
  }

  revalidatePath("/[locale]/admin/discounts", "page");
  return {};
}
