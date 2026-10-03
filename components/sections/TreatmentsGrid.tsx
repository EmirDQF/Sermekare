import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpotlightCard } from "@/components/shared/SpotlightCard";
import { TreatmentCard } from "@/components/shared/TreatmentCard";
import { Reveal } from "@/components/shared/Reveal";
import { treatments } from "@/data/treatments";

export function TreatmentsGrid() {
  return (
    <section aria-labelledby="tratamientos-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="tratamientos-title"
          eyebrow="Tratamientos"
          title="Tratamientos modernos, explicados con claridad"
          description="Te contamos para quién está indicado cada uno, qué beneficios tiene y cuánto dura, antes de decidir."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment, index) => (
            <Reveal key={treatment.slug} delay={(index % 3) * 0.08}>
              <SpotlightCard className="h-full">
                <TreatmentCard treatment={treatment} />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
