import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { ServicePillar } from "@/types/medical";
import { IconBadge } from "@/components/shared/Icon";
import { MicroIcon } from "@/components/3d/MicroIcon";
import { isMicroVariant } from "@/lib/micro-variants";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  pillar: ServicePillar;
}

/** Pilar de servicio: el grande muestra todos los subservicios; el resto los despliega. */
export function ServiceCard({ pillar }: ServiceCardProps) {
  const isLarge = pillar.size === "lg";
  const icon = <IconBadge name={pillar.icon} size={isLarge ? "lg" : "md"} />;
  return (
    <div className="flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        {isMicroVariant(pillar.slug) ? (
          <MicroIcon variant={pillar.slug} fallback={icon} className={cn("-m-3", isLarge ? "size-28" : "size-20")} />
        ) : (
          icon
        )}
        <Link
          href={`/servicios/${pillar.slug}`}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-heading transition-colors hover:border-primary hover:text-primary"
          aria-label={`Ver ${pillar.name}`}
        >
          <ArrowUpRight aria-hidden strokeWidth={1.75} className="size-5" />
        </Link>
      </div>

      <h3 className={cn("text-h3 mt-5", isLarge && "lg:text-[1.75rem]")}>{pillar.name}</h3>
      <p className="mt-2 text-muted">{pillar.tagline}</p>

      {isLarge ? (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Servicios de ${pillar.name}`}>
          {pillar.services.map((service) => (
            <li key={service.name} className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-[0.925rem] text-fg">
              {service.name}
            </li>
          ))}
        </ul>
      ) : (
        <details className="group/details mt-auto pt-5">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 font-display font-semibold text-primary [&::-webkit-details-marker]:hidden">
            Ver {pillar.services.length} servicios
            <ChevronDown
              aria-hidden
              strokeWidth={1.75}
              className="size-5 transition-transform duration-300 group-open/details:rotate-180"
            />
          </summary>
          <ul className="mt-2 space-y-2 border-t border-line pt-3">
            {pillar.services.map((service) => (
              <li key={service.name} className="flex gap-2.5 text-[0.95rem] text-fg">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" />
                {service.name}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
