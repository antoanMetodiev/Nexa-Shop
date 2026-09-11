import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: number;
};

export const CUSTOMERS_PAGE_SIZE = 20;

export async function getCustomers(
  page = 1,
): Promise<{ customers: Customer[]; total: number }> {
  const pageIndex = page > 0 ? page : 1;
  const from = (pageIndex - 1) * CUSTOMERS_PAGE_SIZE;
  const to = from + CUSTOMERS_PAGE_SIZE - 1;

  const { data, error, count } = await supabaseAdmin
    .from("users")
    .select("id, email, full_name, phone, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) {
    console.error("getCustomers failed:", error?.message);
    return { customers: [], total: 0 };
  }

  const customers = data.map((row) => ({
    id: row.id,
    name: row.full_name || row.email || row.id,
    email: row.email ?? "",
    phone: row.phone,
    createdAt: new Date(row.created_at).getTime(),
  }));

  return { customers, total: count ?? customers.length };
}
