"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
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
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-navy-200 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-500">
        <AlertTriangle className="size-7" />
      </span>
      <div>
        <p className="font-medium text-navy-950">Нещо се обърка</p>
        <p className="mt-1 text-sm text-navy-500">
          Възникна грешка при зареждането на тази секция.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
      >
        Опитай отново
      </button>
    </div>
  );
}
