"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2, Search, SearchX, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  discountedPrice,
  formatPrice,
  getTopRatedProducts,
  searchProducts,
  type Product,
} from "@/lib/products";

function ResultRow({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-navy-50"
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-navy-100 bg-navy-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-navy-950">
          {product.title}
        </p>
        {product.brand && (
          <p className="truncate text-xs text-navy-400">{product.brand}</p>
        )}
      </div>
      <span className="shrink-0 text-xs font-semibold text-navy-950">
        {formatPrice(discountedPrice(product))}
      </span>
    </Link>
  );
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("search");
  const tHeader = useTranslations("header");
  const router = useRouter();

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  // Load top-rated products once, to show as suggestions before the user types.
  useEffect(() => {
    if (!open || suggestions.length > 0) return;
    getTopRatedProducts(4).then((data) => {
      setSuggestions(data);
    });
  }, [open, suggestions.length]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    function onClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local state to the query prop, not derivable during render
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handle = setTimeout(() => {
      searchProducts(term, 5).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  function goToFullResults() {
    const term = query.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
    close();
  }

  const term = query.trim();
  const showSuggestions = term.length < 2;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={tHeader("search")}
        aria-expanded={open}
        className="rounded-full p-2 text-navy-900 transition-colors hover:bg-navy-50"
      >
        <Search className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-xs overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xl sm:w-80">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              goToFullResults();
            }}
            className="flex items-center gap-2 border-b border-navy-100 px-3.5 py-3"
          >
            <Search className="size-4 shrink-0 text-navy-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("placeholder")}
              className="min-w-0 flex-1 text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none"
            />
            {loading && (
              <Loader2 className="size-4 shrink-0 animate-spin text-navy-400" />
            )}
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="shrink-0 rounded-full p-1 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              <X className="size-4" />
            </button>
          </form>

          <div className="max-h-80 overflow-y-auto p-2">
            {showSuggestions ? (
              suggestions.length > 0 && (
                <div className="flex flex-col gap-0.5">
                  <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                    {t("startTyping")}
                  </p>
                  {suggestions.map((product) => (
                    <ResultRow
                      key={product.id}
                      product={product}
                      onNavigate={close}
                    />
                  ))}
                </div>
              )
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {results.map((product) => (
                  <ResultRow
                    key={product.id}
                    product={product}
                    onNavigate={close}
                  />
                ))}
              </div>
            ) : !loading ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <SearchX className="size-6 text-navy-300" />
                <p className="px-4 text-xs text-navy-500">
                  {t("noResults", { query: term })}
                </p>
              </div>
            ) : null}
          </div>

          {!showSuggestions && (
            <button
              type="button"
              onClick={goToFullResults}
              className="flex w-full items-center justify-between gap-2 border-t border-navy-100 px-3.5 py-2.5 text-xs font-medium text-navy-700 transition-colors hover:bg-navy-50"
            >
              {t("viewAll", { query: term })}
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
