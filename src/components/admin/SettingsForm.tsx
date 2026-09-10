"use client";

import { useState, useTransition } from "react";
import { updateStoreSettings } from "@/lib/admin/actions/settings";
import type { StoreSettings } from "@/lib/settings";

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-950 focus:border-navy-500 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium text-navy-600";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateStoreSettings(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="flex max-w-xl flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6"
    >
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Настройките са запазени.
        </p>
      )}

      <div>
        <label className={labelClass} htmlFor="store_name">
          Име на магазина
        </label>
        <input
          id="store_name"
          name="store_name"
          required
          defaultValue={settings.storeName}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact_email">
          Имейл за контакт
        </label>
        <input
          id="contact_email"
          name="contact_email"
          type="email"
          required
          defaultValue={settings.contactEmail}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact_phone">
          Телефон
        </label>
        <input
          id="contact_phone"
          name="contact_phone"
          required
          defaultValue={settings.contactPhone}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="address">
          Адрес (използва се и за Google Maps)
        </label>
        <input
          id="address"
          name="address"
          required
          defaultValue={settings.address}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="free_shipping_threshold">
          Праг за безплатна доставка ($)
        </label>
        <input
          id="free_shipping_threshold"
          name="free_shipping_threshold"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={settings.freeShippingThreshold}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
      >
        {isPending ? "Запазване..." : "Запази настройките"}
      </button>
    </form>
  );
}
