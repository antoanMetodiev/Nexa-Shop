"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { createDiscountCode } from "@/lib/admin/actions/discounts";

export function DiscountForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createDiscountCode(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-5"
    >
      <p className="text-sm font-semibold text-navy-950">Нов промо код</p>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            Код
          </label>
          <input
            name="code"
            required
            placeholder="NEXA10"
            className="w-32 rounded-lg border border-navy-200 px-3 py-2 text-sm uppercase"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            Тип
          </label>
          <select
            name="type"
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
          >
            <option value="percentage">Процент (%)</option>
            <option value="fixed">Фиксирана сума ($)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            Стойност
          </label>
          <input
            name="value"
            type="number"
            step="0.01"
            min="0"
            required
            className="w-24 rounded-lg border border-navy-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            Изтича на (по избор)
          </label>
          <input
            name="expires_at"
            type="date"
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            Лимит употреби (по избор)
          </label>
          <input
            name="usage_limit"
            type="number"
            min="1"
            className="w-28 rounded-lg border border-navy-200 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
        >
          {isPending ? "Създаване..." : "Създай"}
        </button>
      </div>
    </form>
  );
}
