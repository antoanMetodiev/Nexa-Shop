import { notFound } from "next/navigation";
import { getProductById, getCategoriesWithCounts } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategoriesWithCounts(),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950">
        Редакция: {product.title}
      </h1>
      <div className="max-w-3xl rounded-2xl border border-navy-100 bg-white p-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
