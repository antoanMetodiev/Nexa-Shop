import type { OrderStatus } from "@/lib/supabase/types";

/**
 * No "server-only" here on purpose — this is imported by the client-side
 * OrderStatusSelect dropdown. Keep this file free of any supabaseAdmin
 * import, or the service-role client leaks into the browser bundle.
 */
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
];
