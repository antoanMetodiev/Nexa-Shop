import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export function MapEmbed({
  address,
  aspectClassName = "aspect-square sm:aspect-[4/3]",
  className = "",
}: {
  address: string;
  aspectClassName?: string;
  className?: string;
}) {
  const t = useTranslations("contactPage");
  const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        className={`w-full overflow-hidden rounded-2xl border border-navy-100 ${aspectClassName}`}
      >
        <iframe
          src={mapsEmbedSrc}
          title={address}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-navy-600 hover:text-navy-950"
      >
        {t("mapLinkLabel")}
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}
