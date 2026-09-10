"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchLocale(nextLocale: Locale) {
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: nextLocale });
  }

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-navy-200 text-xs font-semibold">
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          aria-current={locale === code}
          className={`px-2.5 py-1.5 uppercase transition-colors ${
            locale === code
              ? "bg-navy-900 text-white"
              : "text-navy-600 hover:bg-navy-50"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
