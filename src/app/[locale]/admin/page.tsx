import { Package, FolderTree, ShoppingCart, Users, Tag } from "lucide-react";
import {
  getProductsCount,
  getCategoriesWithCounts,
  getBrandsWithCounts,
} from "@/lib/products";
import { getOrderStats } from "@/lib/admin/orders";
import { getDiscountCodes } from "@/lib/admin/discounts";
import { formatPrice } from "@/lib/products";

export default async function AdminDashboardPage() {
  const [productsCount, categories, brands, orderStats, discounts] =
    await Promise.all([
      getProductsCount(),
      getCategoriesWithCounts(),
      getBrandsWithCounts(),
      getOrderStats(),
      getDiscountCodes(),
    ]);

  const stats = [
    {
      label: "Продукти",
      value: productsCount,
      icon: Package,
    },
    {
      label: "Категории",
      value: categories.length,
      icon: FolderTree,
    },
    {
      label: "Поръчки",
      value: orderStats.totalOrders,
      icon: ShoppingCart,
    },
    {
      label: "Марки",
      value: brands.length,
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950">
        Табло
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-navy-950">
                  {stat.value}
                </p>
                <p className="text-xs text-navy-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-100 bg-white p-5">
          <p className="mb-1 text-sm font-medium text-navy-500">
            Приходи (некасирани поръчки)
          </p>
          <p className="text-3xl font-bold text-navy-950">
            {formatPrice(orderStats.totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            {orderStats.pendingOrders} чакащи поръчки
          </p>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-navy-500">
            <Tag className="size-4" />
            Активни промо кодове
          </div>
          <p className="text-3xl font-bold text-navy-950">
            {discounts.filter((d) => d.active).length}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            {discounts.length} общо създадени
          </p>
        </div>
      </div>

      {orderStats.totalOrders === 0 && (
        <p className="rounded-xl border border-dashed border-navy-200 px-4 py-3 text-xs text-navy-500">
          Все още няма поръчки — секцията ще се напълни автоматично, след
          като checkout/Stripe бъде свързан.
        </p>
      )}
    </div>
  );
}
