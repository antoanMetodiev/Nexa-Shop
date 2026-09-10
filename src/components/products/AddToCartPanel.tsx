"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function AddToCartPanel({
  id,
  title,
  price,
  thumbnail,
  stock,
}: {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
}) {
  const { addItem } = useCart();
  const t = useTranslations("productDetail");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = stock <= 0;

  function handleAdd() {
    addItem({ id, title, price, thumbnail }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center justify-between rounded-full border border-navy-200 sm:justify-start">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
          aria-label={t("decreaseQuantity")}
          className="flex size-11 items-center justify-center text-navy-700 transition-transform active:scale-90 disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <motion.span
          key={quantity}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="w-8 text-center text-sm font-semibold text-navy-950"
        >
          {quantity}
        </motion.span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          disabled={outOfStock}
          aria-label={t("increaseQuantity")}
          className="flex size-11 items-center justify-center text-navy-700 transition-transform active:scale-90 disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <motion.button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        whileTap={outOfStock ? undefined : { scale: 0.97 }}
        animate={added ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400"
      >
        {outOfStock ? (
          t("outOfStock")
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                <Check className="size-4" />
                {t("added")}
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="size-4" />
                {t("addToCart")}
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </motion.button>
    </div>
  );
}
