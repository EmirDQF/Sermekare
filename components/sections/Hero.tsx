import { ArrowDown, BadgeCheck, ShieldCheck, Video } from "lucide-react";
import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: "Reumatólogos certificados" },
  { icon: ShieldCheck, label: "Atendemos seguros y EPS" },
  { icon: Video, label: "Teleconsulta disponible" },
] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-16 pt-36 sm:pt-40 lg:pb-24 lg:pt-44">
      <div aria-hidden className="mesh-bg -z-10" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card-solid/70 px-4 py-2 text-sm font-semibold text-heading shadow-soft">
            <span aria-hidden className="size-2 rounded-full bg-teal" />
            {site.legalTagline} · {site.address.district}
          </p>
          <div className="mt-6">
            <HeroHeadline id="hero-title" />
          </div>
          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            Diagnóstico oportuno con reumatólogos certificados, ecografía en consultorio y tratamientos no invasivos para
            que vuelvas a moverte con confianza.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#agendar" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Reservar cita médica
              <ArrowDown aria-hidden strokeWidth={1.75} />
            </a>
            <a
              href={clinicWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <WhatsAppIcon className="text-[#0f7a6c] dark:text-[#25d366]" />
              Escribir por WhatsApp
            </a>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-3" aria-label="Por qué confiar en nosotros">
            {TRUST_ITEMS.map(({ icon: ItemIcon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[0.95rem] font-medium text-heading">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-tint text-primary">
                  <ItemIcon aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <HeroVisual />
      </div>
      <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg")} />
    </section>
  );
}
