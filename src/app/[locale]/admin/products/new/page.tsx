import { getCategoriesWithCounts } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950">
        Нов продукт
      </h1>
      <div className="max-w-3xl rounded-2xl border border-navy-100 bg-white p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
