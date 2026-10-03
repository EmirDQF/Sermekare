import Image from "next/image";
import Link from "next/link";
import { Award, GraduationCap } from "lucide-react";
import type { Doctor } from "@/types/medical";
import { DoctorAvailabilityDialog } from "@/components/shared/DoctorAvailabilityDialog";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card-solid shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/4.4] overflow-hidden bg-bg-alt">
        <Image
          src={doctor.photo}
          alt={doctor.photoAlt}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw"
          className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <span className="glass absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-heading">
          <Award aria-hidden strokeWidth={1.75} className="size-4 text-primary" />
          {doctor.yearsOfExperience} años de experiencia
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-h3">
          <Link href={`/staff/${doctor.slug}`} className="hover:text-primary">
            {doctor.name}
          </Link>
        </h3>
        <p className="mt-1 font-medium text-primary">{doctor.specialty}</p>
        <p className="mt-1 text-sm text-muted">
          CMP {doctor.cmp} · RNE {doctor.rne}
        </p>
        <p className="mt-4 flex items-start gap-2 text-[0.95rem] text-muted">
          <GraduationCap aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-primary" />
          {doctor.education[1] ?? doctor.education[0]}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Enfoque clínico">
          {doctor.focus.slice(0, 3).map((item) => (
            <li key={item} className="rounded-full bg-bg-alt px-3 py-1 text-sm text-fg">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <DoctorAvailabilityDialog doctor={doctor} triggerClassName="w-full" />
        </div>
      </div>
    </article>
  );
}
