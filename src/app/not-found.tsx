import Link from "next/link";
import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Страницата не е намерена — Nexa",
};

export default function NotFound() {
  return (
    <div className="bg-white py-24">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <Compass className="size-8" />
          </span>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-navy-400">
              Грешка 404
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Страницата не е намерена
            </h1>
            <p className="mt-3 text-sm text-navy-500">
              Възможно е връзката да е остаряла, или страницата вече да не
              съществува. Провери адреса или продължи пазаруването си.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Начало
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
            >
              Разгледай продуктите
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
