import type { SVGProps } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SITE_NAME } from "@/lib/constants";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.6-1.5H16.5V4.3c-.28-.04-1.25-.12-2.37-.12-2.35 0-3.96 1.43-3.96 4.06V10.5H7.5v3H10.17V21h3.33Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4l7.2 9.4L4.3 20H6.7l5.7-6.2L17 20h3l-7.5-9.8L19.6 4h-2.4l-5.3 5.8L8 4H4Z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");

  const footerColumns = [
    {
      title: t("shoppingHeading"),
      links: [
        { label: t("allProducts"), href: "/products" },
        { label: t("categories"), href: "/categories" },
        { label: t("deals"), href: "/deals" },
        { label: t("wishlist"), href: "/wishlist" },
      ],
    },
    {
      title: t("helpHeading"),
      links: [
        { label: t("contact"), href: "/contact" },
        { label: t("faq"), href: "/faq" },
        { label: t("shipping"), href: "/shipping-returns" },
        { label: t("trackOrder"), href: "/account/orders" },
      ],
    },
    {
      title: t("companyHeading"),
      links: [
        { label: t("about"), href: "/about" },
        { label: t("terms"), href: "/terms" },
        { label: t("privacy"), href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-navy-950 text-navy-200">
      <Container>
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <span className="text-xl font-bold tracking-tight text-white">
              {SITE_NAME.toUpperCase()}
            </span>
            <p className="max-w-xs text-sm text-navy-300">{t("tagline")}</p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full border border-navy-700 p-2 text-navy-200 transition-colors hover:border-navy-400 hover:text-white"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full border border-navy-700 p-2 text-navy-200 transition-colors hover:border-navy-400 hover:text-white"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="#"
                aria-label="X (Twitter)"
                className="rounded-full border border-navy-700 p-2 text-navy-200 transition-colors hover:border-navy-400 hover:text-white"
              >
                <XIcon className="size-4" />
              </a>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-navy-800 py-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("dataNote")}</p>
        </div>
      </Container>
    </footer>
  );
}
