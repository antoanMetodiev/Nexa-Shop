"use client";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const NAV: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Табло", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Продукти", icon: Package },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/orders", label: "Поръчки", icon: ShoppingCart },
  { href: "/admin/customers", label: "Клиенти", icon: Users },
  { href: "/admin/discounts", label: "Промо кодове", icon: Tag },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-1 border-r border-navy-100 bg-white p-4">
      <Link
        href="/"
        className="mb-4 flex items-center gap-2 px-2 text-xs font-medium text-navy-500 hover:text-navy-950"
      >
        <ArrowLeft className="size-3.5" />
        Обратно към магазина
      </Link>

      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-navy-900 text-white"
                : "text-navy-600 hover:bg-navy-50 hover:text-navy-950"
            }`}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
