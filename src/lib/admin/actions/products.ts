"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export type ProductActionResult = { error?: string; id?: number };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseProductFormData(formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim() || null,
    price: Number(formData.get("price")),
    discount_percentage: Number(formData.get("discount_percentage") ?? 0),
    stock: Number(formData.get("stock") ?? 0),
    thumbnail: thumbnail || images[0] || "",
    images: images.length ? images : thumbnail ? [thumbnail] : [],
    sku: String(formData.get("sku") ?? "").trim() || null,
    tags,
    warranty_information:
      String(formData.get("warranty_information") ?? "").trim() || null,
    shipping_information:
      String(formData.get("shipping_information") ?? "").trim() || null,
    return_policy: String(formData.get("return_policy") ?? "").trim() || null,
    availability_status:
      String(formData.get("availability_status") ?? "").trim() || null,
  };
}

export async function createProduct(
  formData: FormData,
): Promise<ProductActionResult> {
  await requireAdminAction();
  const fields = parseProductFormData(formData);

  if (!fields.title || !fields.category || !Number.isFinite(fields.price)) {
    return { error: "Заглавие, категория и цена са задължителни." };
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      ...fields,
      slug: slugify(fields.title),
      dummy_id: null,
      rating: 0,
      reviews: [],
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createProduct failed:", error?.message);
    return { error: "Неуспешно създаване на продукта." };
  }

  revalidatePath("/", "layout");
  return { id: data.id };
}

export async function updateProduct(
  id: number,
  formData: FormData,
): Promise<ProductActionResult> {
  await requireAdminAction();
  const fields = parseProductFormData(formData);

  if (!fields.title || !fields.category || !Number.isFinite(fields.price)) {
    return { error: "Заглавие, категория и цена са задължителни." };
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update(fields)
    .eq("id", id);

  if (error) {
    console.error("updateProduct failed:", error.message);
    return { error: "Неуспешно запазване на промените." };
  }

  revalidatePath("/", "layout");
  return { id };
}

export async function deleteProduct(
  id: number,
): Promise<{ error?: string }> {
  await requireAdminAction();

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    console.error("deleteProduct failed:", error.message);
    return { error: "Неуспешно изтриване на продукта." };
  }

  revalidatePath("/", "layout");
  return {};
}
