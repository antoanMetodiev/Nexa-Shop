import { supabase } from "@/lib/supabase/client";
import type { StoreSettingsRow } from "@/lib/supabase/types";
import {
  STORE_ADDRESS,
  STORE_EMAIL,
  STORE_PHONE,
  SITE_NAME,
} from "@/lib/constants";

export type StoreSettings = {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  freeShippingThreshold: number;
};

const FALLBACK: StoreSettings = {
  storeName: SITE_NAME,
  contactEmail: STORE_EMAIL,
  contactPhone: STORE_PHONE,
  address: STORE_ADDRESS,
  freeShippingThreshold: 100,
};

function toStoreSettings(row: StoreSettingsRow): StoreSettings {
  return {
    storeName: row.store_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    address: row.address,
    freeShippingThreshold: row.free_shipping_threshold,
  };
}

/**
 * Reads the editable store info (name/contact/address/free-shipping
 * threshold) that the admin panel manages. Falls back to the constants in
 * src/lib/constants.ts if migration 0005 hasn't been run yet or the
 * singleton row is missing, so public pages never break on a fresh setup.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getStoreSettings failed:", error.message);
    return FALLBACK;
  }
  return toStoreSettings(data);
}
