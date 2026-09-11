"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

// Last-resort boundary for errors thrown by the root layout itself (no
// i18n/providers available here, so it renders its own <html>/<body>).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="bg">
      <body className="flex min-h-screen items-center justify-center bg-white font-sans text-navy-950">
        <div className="flex max-w-lg flex-col items-center gap-6 px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy-400">
            Грешка / Error
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Нещо се обърка
          </h1>
          <p className="text-sm text-navy-500">
            Възникна неочаквана грешка. Опитай отново или се върни към
            началото.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Опитай отново
            </button>
            <Link
              href="/"
              className="rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              Начало
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
