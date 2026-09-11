"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { SHIPPING_FEE } from "@/lib/constants";
import { createCheckoutSession } from "@/lib/checkout/actions";

export function CheckoutView({
  freeShippingThreshold,
}: {
  freeShippingThreshold: number;
}) {
  const { items, totalPrice, hydrated } = useCart();
  const locale = useLocale();
  const t = useTranslations("checkout");
  const tSummary = useTranslations("cart.summary");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = totalPrice >= freeShippingThreshold ? 0 : SHIPPING_FEE;
  const total = totalPrice + shipping;

  async function handlePay() {
    setError(null);
    setIsPending(true);
    try {
      const result = await createCheckoutSession(
        items,
        freeShippingThreshold,
        locale,
        window.location.origin,
      );
      if ("error" in result) {
        setError(t("errorGeneric"));
        setIsPending(false);
        return;
      }
      window.location.href = result.url;
    } catch (err) {
      console.error("createCheckoutSession failed:", err);
      setError(t("errorGeneric"));
      setIsPending(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="h-80 animate-pulse rounded-2xl bg-navy-50" />
        <div className="h-80 animate-pulse rounded-2xl bg-navy-50" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-navy-100 px-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b border-navy-100 py-4 last:border-none"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-navy-100 bg-navy-50">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy-950">
                {item.title}
              </p>
              <p className="text-xs text-navy-500">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-navy-950">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-navy-100 p-6">
        <h2 className="text-base font-semibold text-navy-950">
          {tSummary("heading")}
        </h2>

        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-navy-500">{tSummary("subtotal")}</span>
            <span className="font-medium text-navy-950">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-navy-500">{tSummary("shipping")}</span>
            <span className="font-medium text-navy-950">
              {shipping === 0 ? tSummary("free") : formatPrice(shipping)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-navy-100 pt-4">
          <span className="text-sm font-semibold text-navy-950">
            {tSummary("total")}
          </span>
          <span className="text-xl font-bold text-navy-950">
            {formatPrice(total)}
          </span>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-full bg-navy-900 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-navy-800 active:scale-95 disabled:opacity-60"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? t("payingLabel") : t("payButton")}
        </button>
      </div>
    </div>
  );
}
