"use client";

import { Clock, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { site } from "@/data/site";
import { useOpenStatus } from "@/lib/use-open-status";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const TOPBAR_HEIGHT_CLASS = "h-10";

export function TopBar() {
  const status = useOpenStatus();

  return (
    <div className={cn("bg-navy text-[0.85rem] text-slate-200", TOPBAR_HEIGHT_CLASS)}>
      <div className="container-page flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <a
            href={site.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 hover:text-white sm:inline-flex"
          >
            <MapPin aria-hidden strokeWidth={1.75} className="size-4 text-teal" />
            Sede {site.address.district}
          </a>
          <span className="hidden items-center gap-1.5 lg:inline-flex">
            <Clock aria-hidden strokeWidth={1.75} className="size-4 text-teal" />
            {site.hours.label}
          </span>
          <span className="inline-flex min-w-0 items-center gap-2" aria-live="polite">
            {status ? (
              <>
                <span className="relative flex size-2.5 shrink-0">
                  {status.isOpen ? (
                    <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
                  ) : null}
                  <span
                    aria-hidden
                    className={cn("relative size-2.5 rounded-full", status.isOpen ? "bg-emerald-400" : "bg-slate-400")}
                  />
                </span>
                <span className="truncate">
                  <strong className="font-semibold text-white">{status.isOpen ? "Abierto ahora" : "Cerrado"}</strong>
                  <span className="hidden sm:inline"> · {status.nextChange}</span>
                </span>
              </>
            ) : (
              <span className="truncate">{site.hours.label}</span>
            )}
          </span>
        </div>
        <a
          href={clinicWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white hover:text-teal-200"
        >
          <WhatsAppIcon className="size-4" />
          <span className="hidden sm:inline">{site.whatsapp.display}</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
