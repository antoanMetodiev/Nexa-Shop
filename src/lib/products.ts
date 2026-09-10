import { supabase } from "@/lib/supabase/client";
import type { ProductRow } from "@/lib/supabase/types";

export type Product = ProductRow;
export type Category = { slug: string; name: string };

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getTopRatedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getTopRatedProducts failed:", error.message);
    return [];
  }
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("products").select("category");

  if (error || !data) {
    console.error("getCategories failed:", error?.message);
    return [];
  }

  const slugs = Array.from(new Set(data.map((row) => row.category))).sort();
  return slugs.map((slug) => ({ slug, name: toTitleCase(slug) }));
}

export async function getCategoryThumbnail(
  slug: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("products")
    .select("thumbnail")
    .eq("category", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data.thumbnail;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function discountedPrice(product: Product): number {
  return product.price * (1 - product.discount_percentage / 100);
}
