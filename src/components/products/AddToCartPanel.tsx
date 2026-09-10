"use client";

import { useState } from "react";
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
          aria-label="Намали количеството"
          className="flex size-11 items-center justify-center text-navy-700 disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-navy-950">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          disabled={outOfStock}
          aria-label="Увеличи количеството"
          className="flex size-11 items-center justify-center text-navy-700 disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400"
      >
        {outOfStock ? (
          "Изчерпан"
        ) : added ? (
          <>
            <Check className="size-4" />
            Добавено
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" />
            Добави в кошницата
          </>
        )}
      </button>
    </div>
  );
}
