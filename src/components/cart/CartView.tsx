"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { FadeIn } from "@/components/motion/FadeIn";

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
      <FadeIn className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-navy-200 py-24 text-center">
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
      </FadeIn>
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
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-navy-100 last:border-none"
              >
                <CartLineItem
                  item={item}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.id, quantity)
                  }
                  onRemove={() => removeItem(item.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <OrderSummary subtotal={totalPrice} />
    </div>
  );
}
