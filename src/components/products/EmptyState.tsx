import Link from "next/link";
import { PackageSearch } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-navy-200 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
        <PackageSearch className="size-7" />
      </span>
      <div>
        <p className="font-medium text-navy-950">Няма намерени продукти</p>
        <p className="mt-1 text-sm text-navy-500">
          Опитай да промениш или изчистиш филтрите.
        </p>
      </div>
      <Link
        href="/products"
        className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
      >
        Изчисти филтрите
      </Link>
    </div>
  );
}
