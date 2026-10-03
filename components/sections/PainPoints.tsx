"use client";

import { ArrowRight, MessageCircleHeart } from "lucide-react";
import { painPoints } from "@/data/home";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TRIAGE_SECTION_ID, requestTriage } from "@/lib/triage-events";

/** "¿Te identificas?": frases reales del público; cada una abre el triage con su caso preseleccionado. */
export function PainPoints() {
  return (
    <section aria-labelledby="identificas-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="identificas-title"
          eyebrow="¿Te identificas?"
          title="Lo que nos cuentan nuestros pacientes en su primera consulta"
          description="Si alguna de estas frases eres tú (o alguien que quieres), no tienes que acostumbrarte al dolor."
        />
        <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point, index) => (
            <RevealItem as="li" key={point.id} className={index === 0 ? "lg:row-span-2" : undefined}>
              <a
                href={`#${TRIAGE_SECTION_ID}`}
                onClick={() => requestTriage(point.target)}
                className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lift sm:p-7"
              >
                <MessageCircleHeart aria-hidden strokeWidth={1.75} className="size-8 text-coral" />
                <p className={`mt-4 font-display font-bold text-heading ${index === 0 ? "text-2xl lg:text-3xl" : "text-xl"}`}>
                  “{point.quote}”
                </p>
                <p className="mt-3 text-muted">{point.context}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display font-semibold text-primary">
                  Ver qué puede ser
                  <ArrowRight aria-hidden strokeWidth={1.75} className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
