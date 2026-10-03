"use client";

import Link from "next/link";
import { CalendarClock, MapPin, Video } from "lucide-react";
import type { Doctor, DoctorSchedule } from "@/types/medical";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { clinicWhatsApp, messageForDoctor } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const MODALITY_LABEL: Record<DoctorSchedule["modality"], string> = {
  presencial: "Presencial",
  teleconsulta: "Teleconsulta",
  ambas: "Presencial y teleconsulta",
};

interface DoctorAvailabilityDialogProps {
  doctor: Doctor;
  triggerClassName?: string;
}

/** "Dra. Valeria Quintana Ríos" → "Dra. Valeria" */
function shortName(name: string): string {
  return name.split(" ").slice(0, 2).join(" ");
}

export function DoctorAvailabilityDialog({ doctor, triggerClassName }: DoctorAvailabilityDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: "primary" }), triggerClassName)}>
        <CalendarClock aria-hidden strokeWidth={1.75} />
        Ver disponibilidad
        <span className="sr-only">de {doctor.name}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{doctor.name}</DialogTitle>
        <DialogDescription>
          {doctor.title} · CMP {doctor.cmp} · RNE {doctor.rne}
        </DialogDescription>

        <ul className="mt-6 space-y-3">
          {doctor.schedule.map((slot) => (
            <li key={`${slot.day}-${slot.hours}`} className="rounded-2xl border border-line bg-bg p-4">
              <p className="font-display font-semibold text-heading">{slot.day}</p>
              <p className="text-muted">{slot.hours}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-tint px-3 py-1 text-sm font-medium text-primary">
                {slot.modality === "teleconsulta" ? (
                  <Video aria-hidden strokeWidth={1.75} className="size-4" />
                ) : (
                  <MapPin aria-hidden strokeWidth={1.75} className="size-4" />
                )}
                {MODALITY_LABEL[slot.modality]}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[0.95rem] text-muted">
          Te confirmamos el horario exacto por WhatsApp. Atendemos {site.hours.label.toLowerCase()}.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={clinicWhatsApp(messageForDoctor(doctor.name))}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "whatsapp" }), "flex-1")}
          >
            <WhatsAppIcon />
            Agendar con {shortName(doctor.name)}
          </a>
          <Link href={`/staff/${doctor.slug}`} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
            Ver perfil
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
