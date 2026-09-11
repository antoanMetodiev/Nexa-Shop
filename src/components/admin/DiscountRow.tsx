"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  toggleDiscountCode,
  deleteDiscountCode,
} from "@/lib/admin/actions/discounts";
import type { DiscountCodeRow } from "@/lib/supabase/types";

export function DiscountRow({ discount }: { discount: DiscountCodeRow }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <tr className="border-b border-navy-50 last:border-none">
      <td className="px-4 py-3 font-mono text-sm font-semibold text-navy-950">
        {discount.code}
      </td>
      <td className="px-4 py-3 text-navy-600">
        {discount.type === "percentage"
          ? `${discount.value}%`
          : `${discount.value} €`}
      </td>
      <td className="px-4 py-3 text-navy-500">
        {discount.used_count}
        {discount.usage_limit ? ` / ${discount.usage_limit}` : ""}
      </td>
      <td className="px-4 py-3 text-navy-500">
        {discount.expires_at
          ? new Date(discount.expires_at).toLocaleDateString("bg-BG")
          : "-"}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await toggleDiscountCode(discount.id, !discount.active);
              router.refresh();
            })
          }
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            discount.active
              ? "bg-green-50 text-green-700"
              : "bg-navy-100 text-navy-500"
          }`}
        >
          {discount.active ? "Активен" : "Неактивен"}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await deleteDiscountCode(discount.id);
              router.refresh();
            })
          }
          className="text-xs font-semibold text-navy-400 hover:text-red-600"
        >
          Изтрий
        </button>
      </td>
    </tr>
  );
}
