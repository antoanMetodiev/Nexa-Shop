"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSupabaseUserContext } from "@/lib/supabase/user-context";
import {
  clearCartItems,
  getCartItems,
  removeCartItem,
  upsertCartItem,
} from "@/lib/cart-db";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nexa-cart";

function readLocalItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalItems(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const user = useSupabaseUserContext();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    const wasSignedIn = prevUserId.current !== null;
    prevUserId.current = user?.id ?? null;

    if (!user) {
      // Guest — either never signed in, or just signed out (localStorage is
      // empty in the sign-out case since it was cleared on sign-in below).
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local state to the signed-in-ness of the external auth session, not derivable during render
      setItems(readLocalItems());
      setHydrated(true);
      return;
    }

    if (!wasSignedIn) {
      // Guest -> signed-in: merge localStorage into the account cart
      // (summing quantities for products already in the DB cart), then the
      // DB becomes the source of truth.
      getCartItems(user.id).then((dbItems) => {
        const merged = new Map<number, CartItem>(
          dbItems.map((item) => [item.id, item]),
        );
        for (const localItem of readLocalItems()) {
          const existing = merged.get(localItem.id);
          merged.set(localItem.id, existing
            ? { ...existing, quantity: existing.quantity + localItem.quantity }
            : localItem);
        }
        const mergedItems = [...merged.values()];
        Promise.all(
          mergedItems.map((item) => upsertCartItem(user.id, item, item.quantity)),
        ).then(() => {
          writeLocalItems([]);
          setItems(mergedItems);
          setHydrated(true);
        });
      });
    } else {
      getCartItems(user.id).then((dbItems) => {
        setItems(dbItems);
        setHydrated(true);
      });
    }
    // Only re-run when the signed-in identity actually changes (sign-in/out),
    // not on every background token refresh from onAuthStateChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!hydrated || user) return;
    writeLocalItems(items);
  }, [items, hydrated, user]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((row) => row.id === item.id);
      const nextQuantity = existing ? existing.quantity + quantity : quantity;
      if (user) upsertCartItem(user.id, item, nextQuantity);
      if (existing) {
        return prev.map((row) =>
          row.id === item.id ? { ...row, quantity: nextQuantity } : row,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((row) => row.id !== id));
    if (user) removeCartItem(user.id, id);
  }

  function updateQuantity(id: number, quantity: number) {
    setItems((prev) => {
      if (quantity <= 0) {
        if (user) removeCartItem(user.id, id);
        return prev.filter((row) => row.id !== id);
      }
      const row = prev.find((r) => r.id === id);
      if (user && row) upsertCartItem(user.id, row, quantity);
      return prev.map((r) => (r.id === id ? { ...r, quantity } : r));
    });
  }

  function clearCart() {
    setItems([]);
    if (user) clearCartItems(user.id);
  }

  const totalCount = items.reduce((sum, row) => sum + row.quantity, 0);
  const totalPrice = items.reduce(
    (sum, row) => sum + row.price * row.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
