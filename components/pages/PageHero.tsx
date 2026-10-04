import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { KineticText } from "@/components/shared/KineticText";

interface PageHeroProps {
  id: string;
  crumbs: readonly BreadcrumbItem[];
  eyebrow: string;
  title: string;
  /** Frase del título resaltada con el gradiente teal. */
  accent?: string;
  lead: ReactNode;
  /** Botones o enlaces bajo el texto. */
  actions?: ReactNode;
  /** Visual a la derecha (3D, ilustración). */
  visual?: ReactNode;
}

/** Cabecera común de las páginas internas: migas, h1 cinético, entrada y visual opcional. */
export function PageHero({ id, crumbs, eyebrow, title, accent, lead, actions, visual }: PageHeroProps) {
  return (
    <section aria-labelledby={id} className="relative overflow-hidden pb-14 pt-36 sm:pt-40 lg:pb-20">
      <div aria-hidden className="mesh-bg -z-10" />
      <div className={visual ? "container-page grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]" : "container-page"}>
        <div className="max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-tint px-3.5 py-1.5 text-sm font-semibold text-primary">
            <span aria-hidden className="size-1.5 rounded-full bg-teal" /> {eyebrow}
          </p>
          <h1 id={id} className="text-display mt-4 text-heading">
            <KineticText text={title} accent={accent} />
          </h1>
          <div className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{lead}</div>
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
        </div>
        {visual}
      </div>
    </section>
  );
}
