import { Check } from "lucide-react";
import { IconBadge } from "@/components/shared/Icon";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { densitometry } from "@/data/densitometry";

/** Proceso en 4 pasos + checklist de preparación con checks animados. */
export function DensitometrySteps() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      <RevealGroup as="ol" className="relative grid gap-4 sm:grid-cols-2">
        {densitometry.steps.map((step, index) => (
          <RevealItem as="li" key={step.id} className="relative rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
            <span aria-hidden className="absolute right-5 top-5 font-mono text-sm text-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <IconBadge name={step.icon} />
            <h3 className="text-h3 mt-4">{step.title}</h3>
            <p className="mt-2 text-muted">{step.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="rounded-[1.75rem] bg-teal-tint p-6">
        <h3 className="text-h3">Cómo prepararte</h3>
        <RevealGroup as="ul" className="mt-4 space-y-3">
          {densitometry.preparation.map((item) => (
            <RevealItem as="li" key={item} className="flex gap-3 text-fg">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                <Check aria-hidden strokeWidth={2.5} className="size-4" />
              </span>
              {item}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
