import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { doctors } from "@/data/doctors";

export function DoctorsSection() {
  return (
    <section aria-labelledby="staff-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="staff-title"
            align="left"
            eyebrow="Staff médico"
            title="Especialistas que te escuchan y te explican"
            description="Médicos con colegiatura (CMP) y registro de especialidad (RNE) vigentes, dedicados a la salud articular."
          />
          <Link
            href="/staff"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Conoce a todo el equipo <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>
        <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {doctors.map((doctor) => (
            <RevealItem as="li" key={doctor.slug}>
              <TiltCard className="h-full rounded-[1.75rem]">
                <DoctorCard doctor={doctor} />
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
