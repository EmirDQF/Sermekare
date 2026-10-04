import type { Metadata } from "next";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { buttonVariants } from "@/components/ui/button";
import { BOOKING_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { clinicWhatsApp } from "@/lib/whatsapp";

const TITLE = `Contacto y cómo llegar | ${site.name} San Borja`;
const DESCRIPTION = `Escríbenos por WhatsApp, llámanos o visítanos en ${site.address.street}, ${site.address.district}. ${site.hours.label}.`;
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/contacto" }),
  title: { absolute: TITLE },
};

const CHANNELS = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    value: site.whatsapp.display,
    href: clinicWhatsApp(),
    external: true,
    note: "La forma más rápida de agendar.",
  },
  { icon: Phone, title: "Teléfono", value: site.phone.display, href: `tel:${site.phone.tel}`, external: false, note: site.hours.label },
  { icon: Mail, title: "Correo", value: site.email, href: `mailto:${site.email}`, external: false, note: "Te respondemos en horario de atención." },
  {
    icon: MapPin,
    title: "Sede",
    value: `${site.address.street}, ${site.address.district}`,
    href: site.address.mapsUrl,
    external: true,
    note: site.address.city,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${site.url}/contacto`,
          mainEntity: { "@id": `${site.url}/#clinic` },
        }}
      />
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="contacto-title"
        crumbs={CRUMBS}
        eyebrow="Contacto"
        title="Estamos para ayudarte"
        accent="ayudarte"
        lead={`Escríbenos, llámanos o visítanos en ${site.address.district}. Te respondemos en horario de atención.`}
        actions={
          <>
            <a href={clinicWhatsApp()} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon /> Escribir por WhatsApp
            </a>
            <a href={BOOKING_HREF} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Agendar con el formulario
            </a>
          </>
        }
      />

      <section aria-label="Canales de contacto" className="pb-12">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map(({ icon: ChannelIcon, title, value, href, external, note }) => (
              <RevealItem as="li" key={title}>
                <TiltCard className="h-full rounded-[1.75rem]">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex h-full flex-col rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft transition-colors hover:border-primary"
                  >
                    <span className="grid size-12 place-items-center rounded-2xl bg-teal-tint text-primary [&_svg]:size-6">
                      <ChannelIcon aria-hidden />
                    </span>
                    <span className="mt-4 font-display font-semibold text-heading">{title}</span>
                    <span className="mt-1 break-words text-lg font-semibold text-primary">{value}</span>
                    <span className="mt-1 text-sm text-muted">{note}</span>
                  </a>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="llegar-title" className="pb-24">
        <div className="container-page grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-h-80 overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <iframe
              src={site.address.mapsEmbedUrl}
              title={`Mapa de ${site.name}, ${site.address.street}, ${site.address.district}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-80"
            />
          </div>
          <div className="rounded-[2rem] border border-line bg-card-solid p-6 shadow-soft sm:p-8">
            <h2 id="llegar-title" className="text-h3">
              Cómo llegar
            </h2>
            <ul className="mt-4 space-y-3">
              {site.address.howToArrive.map((tip) => (
                <li key={tip} className="flex gap-3 text-fg">
                  <Navigation aria-hidden strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-primary" /> {tip}
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
          </div>
        </div>
      </section>
    </>
  );
}
