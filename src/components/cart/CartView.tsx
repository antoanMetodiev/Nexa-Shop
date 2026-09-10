"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";

export function CartView() {
  const { items, hydrated, updateQuantity, removeItem, clearCart, totalPrice } =
    useCart();
  const t = useTranslations("cart");

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="h-80 animate-pulse rounded-2xl bg-navy-50" />
        <div className="h-80 animate-pulse rounded-2xl bg-navy-50" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-navy-200 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
          <ShoppingBag className="size-7" />
        </span>
        <div>
          <p className="font-medium text-navy-950">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-navy-500">{t("emptySubtitle")}</p>
        </div>
        <Link
          href="/products"
          className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-navy-500">
            {t("itemsCount", { count: items.length })}
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-navy-500 hover:text-navy-950"
          >
            {t("clearCart")}
          </button>
        </div>

        <div className="rounded-2xl border border-navy-100 px-5">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onUpdateQuantity={(quantity) =>
                updateQuantity(item.id, quantity)
              }
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      </div>

      <OrderSummary subtotal={totalPrice} />
    </div>
  );
}
