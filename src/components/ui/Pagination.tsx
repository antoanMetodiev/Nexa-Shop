import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

/** Simple single-param (`?page=`) pagination for listings without other filters. */
export function Pagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = pageNumbers(currentPage, totalPages);
  const hrefFor = (page: number) =>
    page <= 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4">
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex size-9 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors hover:bg-navy-50 ${
          currentPage === 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-9 items-center justify-center text-sm text-navy-400"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            className={`flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-navy-900 text-white"
                : "text-navy-700 hover:bg-navy-50"
            }`}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`flex size-9 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors hover:bg-navy-50 ${
          currentPage === totalPages ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
