import "server-only";
import { clerkClient } from "@clerk/nextjs/server";

export type Customer = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  createdAt: number;
};

export const CUSTOMERS_PAGE_SIZE = 20;

export async function getCustomers(
  page = 1,
): Promise<{ customers: Customer[]; total: number }> {
  const pageIndex = page > 0 ? page : 1;
  const client = await clerkClient();
  const { data, totalCount } = await client.users.getUserList({
    limit: CUSTOMERS_PAGE_SIZE,
    offset: (pageIndex - 1) * CUSTOMERS_PAGE_SIZE,
    orderBy: "-created_at",
  });

  const customers = data.map((user) => ({
    id: user.id,
    name:
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      user.id,
    email: user.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
  }));

  return { customers, total: totalCount };
}
