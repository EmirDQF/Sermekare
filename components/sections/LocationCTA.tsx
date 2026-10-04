import { ArrowUpRight, Clock, MapPin, Navigation, Phone } from "lucide-react";
import { JointMotif } from "@/components/shared/JointMotif";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { clinicWhatsApp } from "@/lib/whatsapp";

/** Mapa estilizado (SVG propio, sin cargar Google Maps en la Home) con pin de la sede. */
function StylizedMap() {
  return (
    <svg viewBox="0 0 400 260" aria-hidden className="size-full">
      <rect width="400" height="260" fill="var(--background-alt)" />
      <g fill="var(--card-solid)">
        <rect x="18" y="18" width="110" height="70" rx="10" />
        <rect x="150" y="18" width="90" height="70" rx="10" />
        <rect x="262" y="18" width="120" height="70" rx="10" />
        <rect x="18" y="110" width="80" height="132" rx="10" />
        <rect x="120" y="110" width="120" height="58" rx="10" />
        <rect x="120" y="188" width="120" height="54" rx="10" />
        <rect x="262" y="110" width="120" height="132" rx="10" />
      </g>
      <rect x="296" y="140" width="56" height="70" rx="10" fill="var(--teal-tint)" />
      <g stroke="var(--border-strong)" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M0 99H400" />
        <path d="M251 0V260" />
      </g>
      <path d="M0 99H400" stroke="var(--teal)" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M109 0V260" stroke="var(--border-strong)" strokeWidth="6" />
      <text x="18" y="94" fontSize="10" fontWeight="600" fill="var(--subtle)">{site.address.street}</text>
      <text x="300" y="232" fontSize="10" fontWeight="600" fill="var(--subtle)">Parque</text>
    </svg>
  );
}

export function LocationCTA() {
  return (
    <section aria-labelledby="ubicacion-title" className="section-y">
      <div className="container-page space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <a
            href={site.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block min-h-72 overflow-hidden rounded-[2rem] border border-line shadow-soft"
            aria-label={`Abrir ${site.address.street}, ${site.address.district} en Google Maps`}
          >
            <span className="absolute inset-0 [perspective:1100px]">
              <span className="absolute inset-[-12%] origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] [transform:rotateX(38deg)_rotateZ(-10deg)] group-hover:[transform:rotateX(30deg)_rotateZ(-6deg)]">
                <StylizedMap />
                <span className="absolute left-[62%] top-[34%] [transform-style:preserve-3d]">
                  <span aria-hidden className="absolute -left-10 -top-10 size-20 animate-pulse-ring rounded-full border-2 border-teal/60" />
                  <span aria-hidden className="absolute -left-10 -top-10 size-20 animate-pulse-ring rounded-full border-2 border-teal/40 [animation-delay:0.8s]" />
                  <span className="absolute -left-7 -top-14 grid size-14 origin-bottom place-items-center rounded-full bg-primary text-on-primary shadow-lift [transform:rotateX(-38deg)]">
                    <MapPin aria-hidden strokeWidth={1.75} className="relative size-7" />
                  </span>
                </span>
              </span>
            </span>
            <span className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl p-4 sm:right-auto">
              <span>
                <span className="block font-display font-semibold text-heading">{site.name} · Sede {site.address.district}</span>
                <span className="block text-sm text-muted">
                  {site.address.street}, {site.address.district}, {site.address.city}
                </span>
              </span>
              <ArrowUpRight aria-hidden className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>

          <div className="rounded-[2rem] border border-line bg-card-solid p-6 shadow-soft sm:p-8">
            <h2 id="ubicacion-title" className="text-h3">
              Cómo llegar
            </h2>
            <ul className="mt-4 space-y-3">
              {site.address.howToArrive.map((tip) => (
                <li key={tip} className="flex gap-3 text-fg">
                  <Navigation aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-primary" />
                  {tip}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-bg-alt p-4">
              <p className="flex items-center gap-2 font-display font-semibold text-heading">
                <Clock aria-hidden strokeWidth={1.75} className="size-5 text-primary" /> Horario
              </p>
              <p className="mt-1 text-muted">{site.hours.label}</p>
              <p className="text-muted">{site.hours.closedLabel}</p>
            </div>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
            >
              Abrir en Google Maps <ArrowUpRight aria-hidden className="size-5" />
            </a>
          </div>
        </div>

        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-center text-white sm:px-12 lg:py-20 dark:bg-navy-3">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_0%,rgb(0_168_150/0.3),transparent_70%)]" />
          <JointMotif mode="loop" className="mx-auto h-28 w-auto" />
          <h2 className="text-h2 mx-auto mt-6 max-w-3xl text-white">No tienes que acostumbrarte al dolor</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
            Da el primer paso hoy. Te orientamos y agendamos tu consulta con el especialista adecuado.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#agendar" className={buttonVariants({ variant: "light", size: "lg" })}>
              Agendar consulta
            </a>
            <a
              href={clinicWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "lg" })}
            >
              <WhatsAppIcon /> WhatsApp
            </a>
            <a
              href={`tel:${site.phone.tel}`}
              className={`${buttonVariants({ size: "lg" })} border border-white/25 bg-transparent text-white shadow-none hover:bg-white/10`}
            >
              <Phone aria-hidden strokeWidth={1.75} /> {site.phone.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
