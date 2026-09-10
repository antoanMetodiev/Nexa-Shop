"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { deleteProduct } from "@/lib/admin/actions/products";

export function DeleteProductButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-navy-400 hover:text-red-600"
        aria-label="Изтрий продукта"
      >
        <Trash2 className="size-4" />
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-xs">
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await deleteProduct(id);
            router.refresh();
          })
        }
        className="font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? "..." : "Потвърди"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-navy-400 hover:text-navy-700"
      >
        Отказ
      </button>
    </span>
  );
}
