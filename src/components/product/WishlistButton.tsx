"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

const VARIANT_CLASSES = {
  overlay:
    "absolute right-3 top-3 size-8 bg-white/90 shadow-sm backdrop-blur hover:bg-white",
  standalone: "size-11 shrink-0 border border-navy-200 bg-white hover:bg-navy-50",
} as const;

export function WishlistButton({
  productId,
  variant = "overlay",
}: {
  productId: number;
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const t = useTranslations("wishlist");
  const active = isWishlisted(productId);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? t("remove") : t("add")}
      className={`flex items-center justify-center rounded-full text-navy-700 transition-colors ${VARIANT_CLASSES[variant]}`}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className="flex"
      >
        <Heart
          className={`size-4 ${active ? "fill-navy-900 text-navy-900" : ""}`}
        />
      </motion.span>
    </motion.button>
  );
}
