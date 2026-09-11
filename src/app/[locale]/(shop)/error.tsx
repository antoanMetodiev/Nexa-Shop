"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorContent } from "@/components/shared/ErrorContent";

// Catches render/data errors from any storefront page and shows the branded
// error screen (same look as the custom 404) instead of Next's default
// "Application error" page. Header/Footer stay mounted from the layout.
export default function ShopError({
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
    <div className="bg-white py-24">
      <Container>
        <ErrorContent onRetry={reset} />
      </Container>
    </div>
  );
}
