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
  addWishlistItem,
  getWishlistProductIds,
  removeWishlistItem,
} from "@/lib/wishlist-db";

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

function readLocalIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalIds(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const user = useSupabaseUserContext();
  const [ids, setIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    const wasSignedIn = prevUserId.current !== null;
    prevUserId.current = user?.id ?? null;

    if (!user) {
      // Guest - either never signed in, or just signed out (localStorage is
      // empty in the sign-out case since it was cleared on sign-in below).
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local state to the signed-in-ness of the external auth session, not derivable during render
      setIds(readLocalIds());
      setHydrated(true);
      return;
    }

    if (!wasSignedIn) {
      // Guest -> signed-in: merge whatever's in localStorage into the
      // account once, then the DB becomes the source of truth.
      const localIds = readLocalIds();
      Promise.all(localIds.map((id) => addWishlistItem(user.id, id)))
        .then(() => {
          writeLocalIds([]);
          return getWishlistProductIds(user.id);
        })
        .then((dbIds) => {
          setIds(dbIds);
          setHydrated(true);
        });
    } else {
      getWishlistProductIds(user.id).then((dbIds) => {
        setIds(dbIds);
        setHydrated(true);
      });
    }
    // Only re-run when the signed-in identity actually changes (sign-in/out),
    // not on every background token refresh from onAuthStateChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!hydrated || user) return;
    writeLocalIds(ids);
  }, [ids, hydrated, user]);

  function isWishlisted(productId: number) {
    return ids.includes(productId);
  }

  function toggle(productId: number) {
    const wasWishlisted = ids.includes(productId);
    setIds((prev) =>
      wasWishlisted
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
    if (user) {
      if (wasWishlisted) removeWishlistItem(user.id, productId);
      else addWishlistItem(user.id, productId);
    }
  }

  function remove(productId: number) {
    setIds((prev) => prev.filter((id) => id !== productId));
    if (user) removeWishlistItem(user.id, productId);
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
