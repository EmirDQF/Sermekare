import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { BOOKING_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import { clinicWhatsApp } from "@/lib/whatsapp";

const ACTION =
  "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.8rem] font-semibold transition-transform active:scale-95 [&_svg]:size-5";

/** Barra inferior fija en móvil: Agendar · WhatsApp · Llamar. */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Acciones rápidas"
      className="glass fixed inset-x-0 bottom-0 z-50 flex gap-2 border-x-0 border-b-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <Link href={BOOKING_HREF} className={`${ACTION} bg-primary text-on-primary`}>
        <CalendarCheck aria-hidden strokeWidth={1.75} />
        Agendar
      </Link>
      <a
        href={clinicWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION} bg-[#0f7a6c] text-white dark:bg-[#25d366] dark:text-navy`}
      >
        <WhatsAppIcon />
        WhatsApp
      </a>
      <a href={`tel:${site.phone.tel}`} className={`${ACTION} border border-line bg-card-solid text-heading`}>
        <Phone aria-hidden strokeWidth={1.75} />
        Llamar
      </a>
    </nav>
  );
}
