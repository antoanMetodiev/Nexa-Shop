"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type WishlistContextValue = {
  ids: number[];
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
  totalCount: number;
  hydrated: boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "nexa-wishlist";

// TODO: branch here on the signed-in Supabase user id — for a signed-in
// user, read/write via lib/wishlist-db.ts instead of localStorage, so
// wishlists persist to their account across devices.
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage after mount, so server and
    // client render the same empty wishlist on the first pass (no mismatch).
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // ignore malformed/inaccessible storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore write failures (private mode, quota, etc.)
    }
  }, [ids, hydrated]);

  function isWishlisted(productId: number) {
    return ids.includes(productId);
  }

  function toggle(productId: number) {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }

  function remove(productId: number) {
    setIds((prev) => prev.filter((id) => id !== productId));
  }

  return (
    <WishlistContext.Provider
      value={{
        ids,
        isWishlisted,
        toggle,
        remove,
        totalCount: ids.length,
        hydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
