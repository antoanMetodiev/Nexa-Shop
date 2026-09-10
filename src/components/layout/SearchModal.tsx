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
      className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-navy-50"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-navy-100 bg-navy-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="48px"
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
      <span className="shrink-0 text-sm font-semibold text-navy-950">
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
    getTopRatedProducts(5).then((data) => {
      setSuggestions(data);
    });
  }, [open, suggestions.length]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
      searchProducts(term, 6).then((data) => {
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tHeader("search")}
        className="rounded-full p-2 text-navy-900 transition-colors hover:bg-navy-50"
      >
        <Search className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-navy-950/60 px-4 pt-20 backdrop-blur-sm sm:pt-28">
          <div
            aria-hidden
            className="absolute inset-0"
            onClick={close}
          />

          <div className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                goToFullResults();
              }}
              className="flex items-center gap-3 border-b border-navy-100 px-5 py-4"
            >
              <Search className="size-5 shrink-0 text-navy-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("placeholder")}
                className="min-w-0 flex-1 text-base text-navy-950 placeholder:text-navy-400 focus:outline-none"
              />
              {loading && (
                <Loader2 className="size-4 shrink-0 animate-spin text-navy-400" />
              )}
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="shrink-0 rounded-full p-1.5 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-900"
              >
                <X className="size-5" />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto p-3">
              {showSuggestions ? (
                suggestions.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="px-2.5 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-navy-400">
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
                <div className="flex flex-col gap-1">
                  {results.map((product) => (
                    <ResultRow
                      key={product.id}
                      product={product}
                      onNavigate={close}
                    />
                  ))}
                </div>
              ) : !loading ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <SearchX className="size-8 text-navy-300" />
                  <p className="text-sm text-navy-500">
                    {t("noResults", { query: term })}
                  </p>
                </div>
              ) : null}
            </div>

            {!showSuggestions && (
              <button
                type="button"
                onClick={goToFullResults}
                className="flex items-center justify-between gap-2 border-t border-navy-100 px-5 py-3.5 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50"
              >
                {t("viewAll", { query: term })}
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
