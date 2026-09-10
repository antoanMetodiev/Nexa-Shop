import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
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
  return (
    <div className="flex gap-4 border-b border-navy-100 py-5 last:border-none">
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
          <button
            type="button"
            onClick={onRemove}
            aria-label="Премахни от кошницата"
            className="shrink-0 rounded-full p-1.5 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center rounded-full border border-navy-200">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              aria-label="Намали количеството"
              className="flex size-9 items-center justify-center text-navy-700"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-medium text-navy-950">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label="Увеличи количеството"
              className="flex size-9 items-center justify-center text-navy-700"
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
                {formatPrice(item.price)} / бр.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
