import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { STORE_ADDRESS, STORE_MAPS_EMBED_SRC, STORE_MAPS_LINK } from "@/lib/constants";

export function MapEmbed({
  aspectClassName = "aspect-square sm:aspect-[4/3]",
  className = "",
}: {
  aspectClassName?: string;
  className?: string;
}) {
  const t = useTranslations("contactPage");

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        className={`w-full overflow-hidden rounded-2xl border border-navy-100 ${aspectClassName}`}
      >
        <iframe
          src={STORE_MAPS_EMBED_SRC}
          title={STORE_ADDRESS}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>
      <a
        href={STORE_MAPS_LINK}
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
