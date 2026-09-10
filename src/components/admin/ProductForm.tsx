"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { createProduct, updateProduct } from "@/lib/admin/actions/products";
import type { Product } from "@/lib/products";

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-950 focus:border-navy-500 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium text-navy-600";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: { slug: string; name: string }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="title">
            Заглавие
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={product?.title}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product?.description ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Категория
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="brand">
            Марка
          </label>
          <input
            id="brand"
            name="brand"
            defaultValue={product?.brand ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="price">
            Цена ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="discount_percentage">
            Отстъпка (%)
          </label>
          <input
            id="discount_percentage"
            name="discount_percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            defaultValue={product?.discount_percentage ?? 0}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="stock">
            Наличност (бр.)
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="sku">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            defaultValue={product?.sku ?? ""}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="thumbnail">
            Снимка (thumbnail URL)
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            defaultValue={product?.thumbnail ?? ""}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="images">
            Допълнителни снимки (по един URL на ред)
          </label>
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={(product?.images ?? []).join("\n")}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="tags">
            Тагове (разделени със запетая)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={(product?.tags ?? []).join(", ")}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="availability_status">
            Статус на наличност
          </label>
          <input
            id="availability_status"
            name="availability_status"
            defaultValue={product?.availability_status ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="warranty_information">
            Гаранция
          </label>
          <input
            id="warranty_information"
            name="warranty_information"
            defaultValue={product?.warranty_information ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="shipping_information">
            Информация за доставка
          </label>
          <input
            id="shipping_information"
            name="shipping_information"
            defaultValue={product?.shipping_information ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="return_policy">
            Политика за връщане
          </label>
          <input
            id="return_policy"
            name="return_policy"
            defaultValue={product?.return_policy ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
        >
          {isPending ? "Запазване..." : product ? "Запази промените" : "Създай продукт"}
        </button>
      </div>
    </form>
  );
}
