"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SearchModal } from "@/components/layout/SearchModal";
import { MAIN_NAV, SITE_NAME } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useSupabaseUser } from "@/lib/use-supabase-user";
import { createClient } from "@/lib/supabase/browser-client";

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-navy-900 text-[10px] font-semibold text-white"
        >
          {count > 9 ? "9+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();
  const user = useSupabaseUser();
  const router = useRouter();
  const t = useTranslations("header");
  const tNav = useTranslations("nav");

  async function handleMobileSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            className="-ml-2 p-2 text-navy-900 md:hidden"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-navy-950"
          >
            <Image
              src="/site-logo.avif"
              alt=""
              width={39}
              height={32}
              priority
              className="h-8 w-auto shrink-0"
            />
            {SITE_NAME.toUpperCase()}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative py-1 text-sm font-medium text-navy-700 transition-colors duration-200 hover:text-navy-950"
              >
                {tNav(item.key)}
                <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] origin-center scale-x-0 rounded-full bg-navy-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Suspense
              fallback={<div className="h-[30px] w-[62px] rounded-full border border-navy-200" />}
            >
              <LanguageSwitcher />
            </Suspense>
            <SearchModal />
            <Link
              href="/wishlist"
              aria-label={t("wishlist")}
              className="relative hidden rounded-full p-2 text-navy-900 transition-all duration-200 hover:scale-110 hover:bg-navy-50 active:scale-95 sm:inline-flex"
            >
              <Heart className="size-5" />
              <CountBadge count={wishlistCount} />
            </Link>
            <AccountMenu user={user} />
            <Link
              href="/cart"
              aria-label={t("cart")}
              className="relative rounded-full p-2 text-navy-900 transition-all duration-200 hover:scale-110 hover:bg-navy-50 active:scale-95"
            >
              <ShoppingBag className="size-5" />
              <CountBadge count={totalCount} />
            </Link>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-navy-100 bg-white md:hidden"
          >
            <Container>
              <div className="flex flex-col py-2">
                {MAIN_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-navy-50 py-3 text-sm font-medium text-navy-800 transition-all duration-200 last:border-none hover:pl-1.5 hover:text-navy-950"
                  >
                    {tNav(item.key)}
                  </Link>
                ))}
                {user ? (
                  <button
                    type="button"
                    onClick={handleMobileSignOut}
                    className="py-3 text-left text-sm font-medium text-navy-800 transition-all duration-200 hover:pl-1.5 hover:text-navy-950"
                  >
                    {t("signOut")}
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-sm font-medium text-navy-800 transition-all duration-200 hover:pl-1.5 hover:text-navy-950"
                  >
                    {t("signIn")}
                  </Link>
                )}
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
