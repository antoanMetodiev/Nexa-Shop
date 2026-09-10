import "server-only";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Admin access is granted via Clerk's publicMetadata.role === "admin",
 * set manually per-user in the Clerk dashboard (see PROJECT.md). Call this
 * at the top of every admin page/layout and every admin server action —
 * pages get a redirect, actions get a thrown error since they have no
 * response to redirect.
 */
export async function requireAdminPage(locale: string): Promise<string> {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)
    ?.role;

  if (!userId || role !== "admin") {
    redirect({ href: "/", locale: locale as Locale });
  }
  return userId as string;
}

export async function requireAdminAction(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)
    ?.role;

  if (!userId || role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
  return userId;
}
