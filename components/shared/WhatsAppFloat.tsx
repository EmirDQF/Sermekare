"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { specialties } from "@/data/specialties";
import { treatments } from "@/data/treatments";
import { doctors } from "@/data/doctors";
import { clinicWhatsApp, messageAbout, messageForDoctor } from "@/lib/whatsapp";
import { useOpenStatus } from "@/lib/use-open-status";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Mensaje de WhatsApp adaptado a la página (p. ej. /especialidades/gota → "…por gota."). */
export function messageForPath(pathname: string): string {
  const [section, slug] = pathname.split("/").filter(Boolean);
  if (section === "especialidades" && slug) {
    const specialty = specialties.find((s) => s.slug === slug);
    if (specialty) return messageAbout(specialty.shortName);
  }
  if (section === "tratamientos" && slug) {
    const treatment = treatments.find((t) => t.slug === slug);
    if (treatment) return messageAbout(treatment.name);
  }
  if (section === "staff" && slug) {
    const doctor = doctors.find((d) => d.slug === slug);
    if (doctor) return messageForDoctor(doctor.name);
  }
  return site.whatsapp.defaultMessage;
}

/** Botón flotante (tablet y escritorio; en móvil lo reemplaza la MobileActionBar). */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const status = useOpenStatus();
  const isOpen = status?.isOpen === true;
  const statusLabel = isOpen ? "En línea" : "Déjanos tu mensaje";

  return (
    <a
      href={clinicWhatsApp(messageForPath(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 hidden items-center gap-3 md:flex"
      aria-label={`Escríbenos por WhatsApp (${statusLabel})`}
    >
      <span
        aria-hidden
        className="glass pointer-events-none translate-x-2 rounded-2xl px-4 py-2.5 text-[0.95rem] opacity-0 shadow-soft transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        <span className="block font-display font-semibold text-heading">¿Tienes dudas? Escríbenos</span>
        <span className="block text-sm text-muted">Te ayudamos a elegir especialista</span>
      </span>
      <span className="relative grid size-16 place-items-center rounded-full bg-[#0f7a6c] text-white shadow-lift transition-transform duration-200 group-hover:scale-105 group-active:scale-95 dark:bg-[#25d366] dark:text-navy">
        <WhatsAppIcon className="size-8" />
        <span
          aria-hidden
          className={cn(
            "absolute -top-2 right-1/2 translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.7rem] font-bold shadow-soft",
            isOpen ? "bg-white text-[#0f7a6c]" : "bg-navy text-white dark:bg-white dark:text-navy",
            status === null && "invisible",
          )}
        >
          {isOpen ? "● En línea" : "Déjanos tu mensaje"}
        </span>
      </span>
    </a>
  );
}
