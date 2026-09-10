"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/products";

const SHIPPING_FEE = 9.99;

export function OrderSummary({
  subtotal,
  freeShippingThreshold,
}: {
  subtotal: number;
  freeShippingThreshold: number;
}) {
  const t = useTranslations("cart.summary");
  const shipping = subtotal >= freeShippingThreshold ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-navy-100 p-6">
      <h2 className="text-base font-semibold text-navy-950">
        {t("heading")}
      </h2>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-navy-500">{t("subtotal")}</span>
          <span className="font-medium text-navy-950">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-navy-500">{t("shipping")}</span>
          <span className="font-medium text-navy-950">
            {shipping === 0 ? t("free") : formatPrice(shipping)}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-navy-400">
            {t("freeShippingNote", {
              amount: formatPrice(freeShippingThreshold),
            })}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-navy-100 pt-4">
        <span className="text-sm font-semibold text-navy-950">
          {t("total")}
        </span>
        <motion.span
          key={total}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-navy-950"
        >
          {formatPrice(total)}
        </motion.span>
      </div>

      <Link
        href="/checkout"
        className="flex items-center justify-center gap-2 rounded-full bg-navy-900 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-navy-800 active:scale-95"
      >
        {t("checkout")}
        <ArrowRight className="size-4" />
      </Link>

      <Link
        href="/products"
        className="text-center text-sm font-medium text-navy-600 hover:text-navy-950"
      >
        {t("continueShopping")}
      </Link>
    </div>
  );
}
