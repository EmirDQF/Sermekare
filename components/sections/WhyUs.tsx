import { CalendarClock, MessageCircle, ScanLine, Users, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

interface Differentiator {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
}

const DIFFERENTIATORS: readonly Differentiator[] = [
  {
    icon: ScanLine,
    title: "Diagnóstico de precisión en consultorio",
    text: "Ecografía musculoesquelética durante tu consulta: vemos la articulación en tiempo real, sin derivarte a otro lugar.",
    className: "lg:col-span-2",
  },
  {
    icon: Users,
    title: "Equipo multidisciplinario",
    text: "Reumatología, terapia física, nutrición y psicología trabajando sobre un mismo plan.",
  },
  {
    icon: Video,
    title: "Teleconsulta",
    text: "Controles desde tu casa u oficina, con receta digital.",
  },
  {
    icon: MessageCircle,
    title: "Seguimiento cercano por WhatsApp",
    text: "Resolvemos dudas entre consultas y te recordamos tus controles.",
    className: "lg:col-span-2",
  },
  {
    icon: CalendarClock,
    title: "Horario extendido",
    text: `${site.hours.label}. Para que no tengas que pedir el día libre.`,
    className: "lg:col-span-2",
  },
];

const STATS = [site.stats.consultations, site.stats.rating, site.stats.years, site.stats.specialists] as const;

export function WhyUs() {
  return (
    <section aria-labelledby="por-que-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="por-que-title"
          eyebrow={`Por qué ${site.name}`}
          title="Medicina especializada, cercana y sin vueltas"
          description="Todo lo que necesitas para entender tu dolor y tratarlo, en una sola sede y con el mismo equipo."
        />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RevealItem className="relative overflow-hidden rounded-[1.75rem] bg-navy p-7 text-white sm:col-span-2 lg:row-span-2 dark:bg-navy-3">
            <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-teal/25 blur-3xl" />
            <p className="relative font-display text-lg font-semibold text-teal-200">Nuestros números</p>
            <dl className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <AnimatedCounter
                      stat={stat}
                      className="block font-display text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-none tracking-tight"
                    />
                    <span aria-hidden className="mt-2 block text-slate-300">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="relative mt-8 text-sm text-slate-400">Cifras referenciales de la sede (provisionales).</p>
          </RevealItem>

          {DIFFERENTIATORS.map(({ icon: ItemIcon, title, text, className }) => (
            <RevealItem
              key={title}
              className={cn("rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft", className)}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-tint text-primary">
                <ItemIcon aria-hidden strokeWidth={1.75} className="size-6" />
              </span>
              <h3 className="text-h3 mt-4">{title}</h3>
              <p className="mt-2 text-muted">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
