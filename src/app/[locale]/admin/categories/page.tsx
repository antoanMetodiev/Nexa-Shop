import { getCategoriesWithCounts } from "@/lib/products";
import { ReassignCategoryForm } from "@/components/admin/ReassignCategoryForm";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-950">
          Категории
        </h1>
        <p className="mt-1 text-sm text-navy-500">
          Категориите се извеждат автоматично от продуктите — за да
          създадеш изцяло нова категория, добави продукт с ново име в
          категорийните преводи (messages/bg.json, messages/en.json).
        </p>
      </div>

      {categories.length >= 2 && (
        <ReassignCategoryForm categories={categories} />
      )}

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
              <th className="px-4 py-3 font-medium">Категория</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Продукти</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.slug}
                className="border-b border-navy-50 last:border-none"
              >
                <td className="px-4 py-3 font-medium text-navy-950">
                  {category.name}
                </td>
                <td className="px-4 py-3 text-navy-500">{category.slug}</td>
                <td className="px-4 py-3 text-navy-600">{category.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
