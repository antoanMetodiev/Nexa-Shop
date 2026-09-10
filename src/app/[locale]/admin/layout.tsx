import { UserButton } from "@clerk/nextjs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdminPage } from "@/lib/admin/require-admin";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdminPage(locale);

  return (
    <div className="flex min-h-screen bg-navy-50/40">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-navy-100 bg-white px-6 py-3">
          <p className="text-sm font-semibold text-navy-950">Nexa Admin</p>
          <UserButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
