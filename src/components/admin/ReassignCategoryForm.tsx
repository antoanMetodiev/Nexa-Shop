"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { reassignCategory } from "@/lib/admin/actions/categories";

export function ReassignCategoryForm({
  categories,
}: {
  categories: { slug: string; name: string; count: number }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    const from = String(formData.get("from"));
    const to = String(formData.get("to"));
    startTransition(async () => {
      const result = await reassignCategory(from, to);
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
      <p className="text-sm font-semibold text-navy-950">
        Премести продукти между категории
      </p>
      <p className="text-xs text-navy-500">
        Всички продукти от избраната категория ще бъдат преместени в
        целевата. Използвай за сливане на дублиращи се или грешно
        категоризирани продукти.
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            От категория
          </label>
          <select
            name="from"
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-navy-600">
            В категория
          </label>
          <select
            name="to"
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
        >
          {isPending ? "Преместване..." : "Премести"}
        </button>
      </div>
    </form>
  );
}
