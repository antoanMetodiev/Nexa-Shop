"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser-client";

const SupabaseUserContext = createContext<User | null | undefined>(undefined);

/**
 * Single shared subscription to the signed-in Supabase user, wrapping the
 * whole (shop) layout - Header, CartProvider, and WishlistProvider all read
 * from here instead of each independently calling getUser()/
 * onAuthStateChange, which would otherwise fire the same auth check 3x on
 * every page load.
 */
export function SupabaseUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseUserContext.Provider value={user}>
      {children}
    </SupabaseUserContext.Provider>
  );
}

export function useSupabaseUserContext(): User | null {
  const ctx = useContext(SupabaseUserContext);
  if (ctx === undefined) {
    throw new Error(
      "useSupabaseUserContext must be used within a SupabaseUserProvider",
    );
  }
  return ctx;
}
