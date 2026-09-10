import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getProducts, formatPrice, PRODUCTS_PAGE_SIZE } from "@/lib/products";
import { Pagination } from "@/components/ui/Pagination";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const { products, total } = await getProducts({ page });
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">
            Продукти
          </h1>
          <p className="mt-1 text-sm text-navy-500">{total} продукта общо</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <Plus className="size-4" />
          Нов продукт
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
              <th className="px-4 py-3 font-medium">Продукт</th>
              <th className="px-4 py-3 font-medium">Категория</th>
              <th className="px-4 py-3 font-medium">Цена</th>
              <th className="px-4 py-3 font-medium">Наличност</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-navy-50 last:border-none hover:bg-navy-50/40"
              >
                <td className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={product.thumbnail}
                    alt=""
                    className="size-10 shrink-0 rounded-lg bg-navy-50 object-cover"
                  />
                  <span className="font-medium text-navy-950">
                    {product.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-600">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-navy-600">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-navy-600">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs font-semibold text-navy-700 hover:text-navy-950"
                    >
                      Редакция
                    </Link>
                    <DeleteProductButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath="/admin/products"
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
