"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";

/** Empties the cart once, after a successful Stripe checkout redirect. */
export function ClearCartOnMount() {
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clearCart();
    // Only ever run once, regardless of clearCart's identity changing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
