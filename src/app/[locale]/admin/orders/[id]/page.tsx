import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/products";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderById(Number(id));
  if (!result) notFound();
  const { order, items } = result;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/orders"
        className="flex items-center gap-1.5 text-xs font-medium text-navy-500 hover:text-navy-950"
      >
        <ArrowLeft className="size-3.5" />
        Всички поръчки
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-navy-950">
          Поръчка #{order.id}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy-100 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
            Клиент
          </p>
          <p className="mt-1 text-sm text-navy-950">{order.email}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
            Дата
          </p>
          <p className="mt-1 text-sm text-navy-950">
            {new Date(order.created_at).toLocaleString("bg-BG")}
          </p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
            Плащане (Stripe)
          </p>
          <p className="mt-1 truncate text-sm text-navy-950">
            {order.stripe_payment_intent_id ?? "—"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
              <th className="px-4 py-3 font-medium">Продукт</th>
              <th className="px-4 py-3 font-medium">Цена</th>
              <th className="px-4 py-3 font-medium">Бр.</th>
              <th className="px-4 py-3 font-medium">Общо</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-navy-50 last:border-none"
              >
                <td className="flex items-center gap-3 px-4 py-3">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="size-10 rounded-lg bg-navy-50 object-cover"
                    />
                  )}
                  <span className="font-medium text-navy-950">
                    {item.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-600">
                  {formatPrice(item.unit_price)}
                </td>
                <td className="px-4 py-3 text-navy-600">{item.quantity}</td>
                <td className="px-4 py-3 font-medium text-navy-950">
                  {formatPrice(item.unit_price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-1.5 border-t border-navy-100 px-4 py-4 text-sm">
          <div className="flex justify-between text-navy-500">
            <span>Междинна сума</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-navy-500">
            <span>Доставка</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-navy-950">
            <span>Общо</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
