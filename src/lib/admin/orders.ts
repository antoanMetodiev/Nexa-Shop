import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import type { OrderRow, OrderItemRow } from "@/lib/supabase/types";

export const ORDERS_PAGE_SIZE = 20;

export type OrdersResult = { orders: OrderRow[]; total: number };

export async function getOrders(page = 1): Promise<OrdersResult> {
  const pageIndex = page > 0 ? page : 1;
  const from = (pageIndex - 1) * ORDERS_PAGE_SIZE;
  const to = from + ORDERS_PAGE_SIZE - 1;

  const { data, error, count } = await supabaseAdmin
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) {
    console.error("getOrders failed:", error?.message);
    return { orders: [], total: 0 };
  }
  return { orders: data, total: count ?? 0 };
}

export async function getOrderById(
  id: number,
): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  const [orderRes, itemsRes] = await Promise.all([
    supabaseAdmin.from("orders").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", id)
      .order("id", { ascending: true }),
  ]);

  if (orderRes.error || !orderRes.data) return null;
  return { order: orderRes.data, items: itemsRes.data ?? [] };
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}> {
  const [totalRes, revenueRes, pendingRes] = await Promise.all([
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("total").neq("status", "cancelled"),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum, row) => sum + row.total,
    0,
  );

  return {
    totalOrders: totalRes.count ?? 0,
    totalRevenue,
    pendingOrders: pendingRes.count ?? 0,
  };
}
