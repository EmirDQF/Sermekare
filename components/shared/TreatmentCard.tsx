import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import type { Treatment } from "@/types/medical";
import { IconBadge } from "@/components/shared/Icon";

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  return (
    <article className="flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <IconBadge name={treatment.icon} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-alt px-3 py-1.5 text-sm font-medium text-muted">
          <Clock aria-hidden strokeWidth={1.75} className="size-4" />
          <span className="sr-only">Duración aproximada:</span>
          {treatment.duration}
        </span>
      </div>

      <h3 className="text-h3 mt-5">{treatment.name}</h3>
      <p className="mt-2 text-muted">{treatment.summary}</p>

      <div className="mt-5 rounded-2xl bg-bg-alt p-4">
        <p className="text-sm font-semibold text-heading">¿Para quién está indicado?</p>
        <p className="mt-1 text-[0.95rem] text-muted">{treatment.indicatedFor}</p>
      </div>

      <p className="mt-5 text-sm font-semibold text-heading">Beneficios clave</p>
      <ul className="mt-2 space-y-1.5">
        {treatment.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-[0.95rem] text-fg">
            <Check aria-hidden strokeWidth={2} className="mt-1 size-4 shrink-0 text-primary" />
            {benefit}
          </li>
        ))}
      </ul>

      <Link
        href={`/tratamientos/${treatment.slug}`}
        className="mt-auto inline-flex min-h-12 items-center gap-2 pt-5 font-display font-semibold text-primary hover:underline"
      >
        Conocer el procedimiento
        <span className="sr-only">: {treatment.name}</span>
        <ArrowRight aria-hidden strokeWidth={1.75} className="size-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
