import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export type Customer = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
};

export const CUSTOMERS_PAGE_SIZE = 20;

export async function getCustomers(
  page = 1,
): Promise<{ customers: Customer[]; total: number }> {
  const pageIndex = page > 0 ? page : 1;
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: pageIndex,
    perPage: CUSTOMERS_PAGE_SIZE,
  });

  if (error) {
    console.error("getCustomers failed:", error.message);
    return { customers: [], total: 0 };
  }

  const customers = data.users.map((user) => ({
    id: user.id,
    name:
      (user.user_metadata?.full_name as string | undefined) ||
      user.email ||
      user.id,
    email: user.email ?? "",
    createdAt: new Date(user.created_at).getTime(),
  }));

  return { customers, total: data.total };
}
