"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { useSupabaseUserContext } from "@/lib/supabase/user-context";
import type { UserRow } from "@/lib/supabase/types";

type ProfileContextValue = {
  profile: UserRow | null;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * The signed-in user's public.users row (name/phone/avatar), read through
 * the browser client under RLS. Header/AccountMenu display from here, and
 * the account page calls refreshProfile() after saving so they update
 * without a reload.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const user = useSupabaseUserContext();
  const userId = user?.id ?? null;
  const [profile, setProfile] = useState<UserRow | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("Failed to load profile:", error.message);
      return;
    }
    setProfile(data);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local state to the external auth session (sign-in/out), not derivable during render
    refreshProfile();
  }, [refreshProfile]);

  return (
    <ProfileContext.Provider value={{ profile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
