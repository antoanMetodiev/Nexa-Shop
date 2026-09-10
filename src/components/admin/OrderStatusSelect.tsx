"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { updateOrderStatus } from "@/lib/admin/actions/orders";
import { ORDER_STATUSES } from "@/lib/admin/order-status";
import type { OrderStatus } from "@/lib/supabase/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Чакаща",
  paid: "Платена",
  fulfilled: "Изпълнена",
  cancelled: "Отказана",
  refunded: "Възстановена",
};

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const next = event.target.value as OrderStatus;
        startTransition(async () => {
          await updateOrderStatus(orderId, next);
          router.refresh();
        });
      }}
      className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-800 disabled:opacity-50"
    >
      {ORDER_STATUSES.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABEL[value]}
        </option>
      ))}
    </select>
  );
}
