"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export async function updateStoreSettings(
  formData: FormData,
): Promise<{ error?: string }> {
  await requireAdminAction();

  const storeName = String(formData.get("store_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim();
  const contactPhone = String(formData.get("contact_phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const freeShippingThreshold = Number(
    formData.get("free_shipping_threshold"),
  );

  if (
    !storeName ||
    !contactEmail ||
    !contactPhone ||
    !address ||
    !Number.isFinite(freeShippingThreshold)
  ) {
    return { error: "Всички полета са задължителни." };
  }

  const { error } = await supabaseAdmin.from("store_settings").upsert({
    id: 1,
    store_name: storeName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    address,
    free_shipping_threshold: freeShippingThreshold,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("updateStoreSettings failed:", error.message);
    return { error: "Неуспешно запазване на настройките." };
  }

  revalidatePath("/", "layout");
  return {};
}
