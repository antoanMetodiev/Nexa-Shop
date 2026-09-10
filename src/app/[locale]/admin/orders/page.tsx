import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getOrders, ORDERS_PAGE_SIZE } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/products";
import { Pagination } from "@/components/ui/Pagination";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const { orders, total } = await getOrders(page);
  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-950">
          Поръчки
        </h1>
        <p className="mt-1 text-sm text-navy-500">{total} поръчки общо</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
            <ShoppingCart className="size-7" />
          </span>
          <p className="font-medium text-navy-950">Все още няма поръчки</p>
          <p className="max-w-sm text-sm text-navy-500">
            Тази секция ще се напълни автоматично, след като checkout/Stripe
            интеграцията заработи.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                  <th className="px-4 py-3 font-medium">№</th>
                  <th className="px-4 py-3 font-medium">Имейл</th>
                  <th className="px-4 py-3 font-medium">Дата</th>
                  <th className="px-4 py-3 font-medium">Сума</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-navy-50 last:border-none"
                  >
                    <td className="px-4 py-3 font-medium text-navy-950">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3 text-navy-600">{order.email}</td>
                    <td className="px-4 py-3 text-navy-500">
                      {new Date(order.created_at).toLocaleDateString("bg-BG")}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy-950">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect
                        orderId={order.id}
                        status={order.status}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-semibold text-navy-700 hover:text-navy-950"
                      >
                        Детайли
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            basePath="/admin/orders"
            currentPage={page}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
