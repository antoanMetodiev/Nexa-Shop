"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export function AccountMenu({ user }: { user: User | null }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        aria-label={t("account")}
        className="hidden rounded-full p-2 text-navy-900 transition-all duration-200 hover:scale-110 hover:bg-navy-50 active:scale-95 sm:inline-flex"
      >
        <UserIcon className="size-5" />
      </Link>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const name = user.user_metadata?.full_name as string | undefined;
  const label = name || user.email || "";
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(locale)
    : null;

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("account")}
        aria-expanded={open}
        className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-navy-200 text-xs font-semibold text-navy-700 transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={36}
            height={36}
            className="size-full object-cover"
          />
        ) : (
          label.charAt(0).toUpperCase()
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xl"
          >
            <div className="truncate border-b border-navy-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-navy-950">
                {label}
              </p>
              {name && user.email && (
                <p className="truncate text-xs text-navy-500">
                  {user.email}
                </p>
              )}
              {joinedDate && (
                <p className="mt-1 truncate text-[11px] text-navy-400">
                  {t("memberSince", { date: joinedDate })}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-left text-sm font-medium text-navy-800 transition-colors hover:bg-navy-50"
            >
              {t("signOut")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
