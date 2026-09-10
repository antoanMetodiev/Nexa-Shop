"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MAIN_NAV, SITE_NAME } from "@/lib/constants";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            className="-ml-2 p-2 text-navy-900 md:hidden"
            aria-label="Отвори менюто"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-navy-950"
          >
            {SITE_NAME.toUpperCase()}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-navy-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/search"
              aria-label="Търсене"
              className="rounded-full p-2 text-navy-900 transition-colors hover:bg-navy-50"
            >
              <Search className="size-5" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Любими продукти"
              className="hidden rounded-full p-2 text-navy-900 transition-colors hover:bg-navy-50 sm:inline-flex"
            >
              <Heart className="size-5" />
            </Link>
            <Link
              href="/sign-in"
              aria-label="Профил"
              className="hidden rounded-full p-2 text-navy-900 transition-colors hover:bg-navy-50 sm:inline-flex"
            >
              <User className="size-5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Кошница"
              className="relative rounded-full p-2 text-navy-900 transition-colors hover:bg-navy-50"
            >
              <ShoppingBag className="size-5" />
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-navy-900 text-[10px] font-semibold text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <nav className="border-t border-navy-100 bg-white md:hidden">
          <Container>
            <div className="flex flex-col py-2">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-navy-50 py-3 text-sm font-medium text-navy-800 last:border-none"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-medium text-navy-800"
              >
                Вход / Профил
              </Link>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
