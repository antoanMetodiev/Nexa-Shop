import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/lib/cart-context";

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("cart");

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/products/${item.id}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-navy-100 bg-navy-50"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/products/${item.id}`}
            className="text-sm font-medium text-navy-950 hover:underline"
          >
            {item.title}
          </Link>
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={onRemove}
            aria-label={t("remove")}
            className="shrink-0 rounded-full p-1.5 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <Trash2 className="size-4" />
          </motion.button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center rounded-full border border-navy-200">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              aria-label={t("decreaseQuantity")}
              className="flex size-9 items-center justify-center text-navy-700 transition-transform active:scale-90"
            >
              <Minus className="size-3.5" />
            </button>
            <motion.span
              key={item.quantity}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="w-7 text-center text-sm font-medium text-navy-950"
            >
              {item.quantity}
            </motion.span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label={t("increaseQuantity")}
              className="flex size-9 items-center justify-center text-navy-700 transition-transform active:scale-90"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-navy-950">
              {formatPrice(item.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-navy-400">
                {t("perUnit", { price: formatPrice(item.price) })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
