"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, PersonStanding, Stethoscope, Tags } from "lucide-react";
import type { BodyZoneId, Doctor, SpecialtySlug } from "@/types/medical";
import { BodyMap } from "@/components/sections/BodyMap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MedicalDisclaimer } from "@/components/shared/MedicalDisclaimer";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { bodyZones, getBodyZone } from "@/data/bodyZones";
import { getSpecialty, specialties } from "@/data/specialties";
import { getDoctor } from "@/data/doctors";
import { TRIAGE_EVENT, TRIAGE_SECTION_ID, type TriageTarget } from "@/lib/triage-events";
import { clinicWhatsApp, messageAbout } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type TriageMode = "zona" | "condicion";

interface TriageResult {
  key: string;
  title: string;
  description: string;
  alertSigns: readonly string[];
  approach: string;
  specialtyName: string;
  specialtySlug: SpecialtySlug;
  doctor: Doctor;
  topic: string;
}

const triageSpecialties = specialties.filter((s) => s.inTriage);

function resultForTarget(target: TriageTarget): TriageResult {
  if (target.kind === "zone") {
    const zone = getBodyZone(target.zone);
    const specialty = getSpecialty(zone.specialtySlug);
    return {
      key: `zone-${zone.id}`,
      title: `Dolor en ${zone.label.toLowerCase()}`,
      description: `Puede deberse a: ${zone.possibleCauses}`,
      alertSigns: zone.alertSigns,
      approach: zone.approach,
      specialtyName: specialty.shortName,
      specialtySlug: specialty.slug,
      doctor: getDoctor(zone.doctorSlug),
      topic: `dolor en ${zone.label}`,
    };
  }
  const specialty = getSpecialty(target.slug);
  return {
    key: `condition-${specialty.slug}`,
    title: specialty.name,
    description: specialty.summary,
    alertSigns: specialty.alertSigns,
    approach: specialty.approach,
    specialtyName: specialty.shortName,
    specialtySlug: specialty.slug,
    doctor: getDoctor(specialty.doctorSlug),
    topic: specialty.shortName,
  };
}

function ResultCard({ result }: { result: TriageResult }) {
  return (
    <motion.article
      key={result.key}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      className="gradient-border rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-lift sm:p-8"
    >
      <h3 className="text-h3">{result.title}</h3>
      <p className="mt-2 text-muted">{result.description}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-coral-tint p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-heading">
            <AlertTriangle aria-hidden strokeWidth={1.75} className="size-5 text-coral" />
            Señales de alerta
          </p>
          <ul className="mt-2 space-y-1.5 text-[0.95rem] text-fg">
            {result.alertSigns.map((sign) => (
              <li key={sign} className="flex gap-2">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" />
                {sign}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-teal-tint p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-heading">
            <Stethoscope aria-hidden strokeWidth={1.75} className="size-5 text-primary" />
            Cómo te ayudamos
          </p>
          <p className="mt-2 text-[0.95rem] text-fg">{result.approach}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line p-4 sm:flex-row sm:items-center">
        <Image
          src={result.doctor.photo}
          alt={result.doctor.photoAlt}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-2xl object-cover object-top"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">Especialista recomendado · {result.specialtyName}</p>
          <Link
            href={`/staff/${result.doctor.slug}`}
            className="inline-flex items-center gap-1 font-display font-semibold text-heading hover:text-primary"
          >
            {result.doctor.name}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <p className="text-sm text-muted">{result.doctor.specialty}</p>
        </div>
      </div>

      <a
        href={clinicWhatsApp(messageAbout(result.topic, result.doctor.name))}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "mt-6 w-full")}
      >
        <WhatsAppIcon />
        Agendar con el especialista
      </a>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full min-h-72 place-items-center rounded-[1.75rem] border border-dashed border-line-strong p-8 text-center">
      <div>
        <PersonStanding aria-hidden strokeWidth={1.5} className="mx-auto size-12 text-teal" />
        <p className="mt-4 font-display text-xl font-bold text-heading">Elige una zona o una condición</p>
        <p className="mt-2 text-muted">Te mostraremos señales de alerta, cómo lo tratamos y qué especialista te puede ayudar.</p>
      </div>
    </div>
  );
}

/** "¿Dónde te duele?": triage orientativo por zona del cuerpo o por condición. */
export function SymptomTriage() {
  const [mode, setMode] = useState<TriageMode>("zona");
  const [target, setTarget] = useState<TriageTarget | null>(null);

  useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<TriageTarget>).detail;
      setMode(detail.kind === "zone" ? "zona" : "condicion");
      setTarget(detail);
    };
    window.addEventListener(TRIAGE_EVENT, handle);
    return () => window.removeEventListener(TRIAGE_EVENT, handle);
  }, []);

  const result = target ? resultForTarget(target) : null;
  const selectedZone: BodyZoneId | null = target?.kind === "zone" ? target.zone : null;
  const selectedCondition: SpecialtySlug | null = target?.kind === "condition" ? target.slug : null;

  return (
    <section id={TRIAGE_SECTION_ID} aria-labelledby="triage-title" className="section-y relative isolate overflow-hidden bg-bg-alt">
      <div aria-hidden className="mesh-bg -z-10 opacity-60" />
      <div className="container-page">
        <SectionHeading
          id="triage-title"
          eyebrow="Orientación en 1 minuto"
          title="¿Dónde te duele?"
          description="Toca la zona de tu cuerpo o elige una condición. Te orientamos sobre qué puede ser y con quién atenderte."
        />

        <Tabs value={mode} onValueChange={(value) => setMode(value as TriageMode)} className="mt-10">
          <div className="flex justify-center">
            <TabsList aria-label="Modo de búsqueda">
              <TabsTrigger value="zona">
                <PersonStanding aria-hidden strokeWidth={1.75} /> Por zona
              </TabsTrigger>
              <TabsTrigger value="condicion">
                <Tags aria-hidden strokeWidth={1.75} /> Por condición
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <TabsContent value="zona">
                <BodyMap
                  zones={bodyZones}
                  selected={selectedZone}
                  onSelect={(zone) => setTarget({ kind: "zone", zone })}
                />
              </TabsContent>
              <TabsContent value="condicion">
                <ul className="flex flex-wrap justify-center gap-3 lg:justify-start" aria-label="Condiciones">
                  {triageSpecialties.map((specialty) => {
                    const active = selectedCondition === specialty.slug;
                    return (
                      <li key={specialty.slug}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setTarget({ kind: "condition", slug: specialty.slug })}
                          className={cn(
                            "min-h-12 rounded-full border px-5 font-display font-semibold transition-colors",
                            active
                              ? "border-transparent bg-navy text-white dark:bg-teal dark:text-navy"
                              : "border-line-strong bg-card-solid text-heading hover:border-primary hover:text-primary",
                          )}
                        >
                          {specialty.shortName}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </TabsContent>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {result ? <ResultCard key={result.key} result={result} /> : <EmptyState key="empty" />}
              </AnimatePresence>
              <MedicalDisclaimer />
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
