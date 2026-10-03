"use client";

import { useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Mail, MapPin, ShieldCheck, User, Users, Video } from "lucide-react";
import type { Appointment, AppointmentFor, Modality } from "@/types/medical";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { specialties } from "@/data/specialties";
import { todayISO } from "@/lib/schedule";
import {
  FIELD_LIMITS,
  buildAppointmentMessage,
  buildMailtoLink,
  clinicWhatsApp,
  validateAppointment,
  type AppointmentErrors,
  type AppointmentField,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const NOT_SURE = "Aún no lo sé (orientación general)";
const SPECIALTY_OPTIONS = [...specialties.map((s) => s.name), "Dolor de espalda o cuello", "Lesión deportiva", NOT_SURE];
const FIELD_ORDER: readonly AppointmentField[] = ["specialty", "fullName", "phone", "reason", "preferredDate", "consent"];

const INPUT =
  "min-h-12 w-full rounded-2xl border border-line-strong bg-card-solid px-4 text-fg placeholder:text-subtle transition-colors focus:border-primary focus:outline-none aria-[invalid=true]:border-coral";

const noopSubscribe = () => () => {};

interface ChoiceProps<T extends string> {
  name: string;
  value: T;
  current: T;
  onChange: (value: T) => void;
  icon: ReactNode;
  title: string;
  hint: string;
}

function Choice<T extends string>({ name, value, current, onChange, icon, title, hint }: ChoiceProps<T>) {
  const checked = value === current;
  return (
    <label
      className={cn(
        "flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring",
        checked ? "border-primary bg-teal-tint" : "border-line-strong bg-card-solid hover:border-primary",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl [&_svg]:size-5", checked ? "bg-primary text-on-primary" : "bg-bg-alt text-primary")}>
        {icon}
      </span>
      <span>
        <span className="block font-display font-semibold text-heading">{title}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-[#b42318] dark:text-coral">
      {message}
    </p>
  );
}

/** Agendamiento sin backend: valida, arma un mensaje estructurado y abre WhatsApp (o el correo como alternativa). */
export function AppointmentForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const minDate = useSyncExternalStore(noopSubscribe, () => todayISO(site.hours.timeZone), () => undefined);

  const [modality, setModality] = useState<Modality>("presencial");
  const [forWhom, setForWhom] = useState<AppointmentFor>("mi");
  const [specialty, setSpecialty] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<AppointmentErrors>({});
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const fieldId = (field: AppointmentField) => `${id}-${field}`;
  const errorId = (field: AppointmentField) => `${id}-${field}-error`;
  const describedBy = (field: AppointmentField) => (errors[field] ? errorId(field) : undefined);

  function buildAppointment(): Appointment {
    return {
      modality,
      forWhom,
      specialty,
      fullName,
      phone,
      reason,
      preferredDate: preferredDate || undefined,
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const appointment = buildAppointment();
    const found = validateAppointment(appointment, consent);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      return;
    }
    const message = buildAppointmentMessage(appointment);
    window.open(clinicWhatsApp(message), "_blank", "noopener,noreferrer");
    setSentMessage(message);
  }

  function resetForm() {
    setSpecialty("");
    setFullName("");
    setPhone("");
    setReason("");
    setPreferredDate("");
    setConsent(false);
    setErrors({});
    setSentMessage(null);
  }

  return (
    <section id="agendar" aria-labelledby="agendar-title" className="section-y bg-bg-alt">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            id="agendar-title"
            align="left"
            eyebrow="Agenda en menos de 30 segundos"
            title="Reserva tu cita médica"
            description="Completa tus datos y te abrimos WhatsApp con tu solicitud lista. Nuestro equipo confirma tu horario por ese mismo chat."
          />
          <ul className="mt-8 space-y-4">
            <li className="flex gap-3">
              <Clock aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-primary" />
              <span>
                <strong className="block font-display text-heading">Te respondemos en horario de atención</strong>
                <span className="text-muted">{site.hours.label}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-primary" />
              <span>
                <strong className="block font-display text-heading">Sede {site.address.district}</strong>
                <span className="text-muted">
                  {site.address.street}, {site.address.district}
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-primary" />
              <span>
                <strong className="block font-display text-heading">Tus datos están protegidos</strong>
                <span className="text-muted">Solo los usamos para coordinar tu atención (Ley N.° 29733).</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-line bg-card-solid p-6 shadow-lift sm:p-8">
          {sentMessage ? (
            <div role="status" className="text-center">
              <CheckCircle2 aria-hidden strokeWidth={1.5} className="mx-auto size-16 text-primary" />
              <h3 className="text-h3 mt-4">¡Listo! Tu solicitud está en WhatsApp</h3>
              <p className="mt-2 text-muted">
                Envía el mensaje que se abrió y te confirmaremos tu cita. Te respondemos en horario de atención (
                {site.hours.label.toLowerCase()}).
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={clinicWhatsApp(sentMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "whatsapp" })}
                >
                  <WhatsAppIcon /> Abrir WhatsApp de nuevo
                </a>
                <a
                  href={buildMailtoLink(site.email, "Solicitud de cita", sentMessage)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Mail aria-hidden strokeWidth={1.75} /> Enviar por correo
                </a>
              </div>
              <button type="button" onClick={resetForm} className="mt-5 min-h-12 font-semibold text-primary hover:underline">
                Agendar otra cita
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-7">
              <fieldset>
                <legend className="font-display font-semibold text-heading">1. ¿Cómo prefieres atenderte?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Choice
                    name="modality"
                    value="presencial"
                    current={modality}
                    onChange={setModality}
                    icon={<MapPin aria-hidden strokeWidth={1.75} />}
                    title="Presencial"
                    hint={`Sede ${site.address.district}`}
                  />
                  <Choice
                    name="modality"
                    value="teleconsulta"
                    current={modality}
                    onChange={setModality}
                    icon={<Video aria-hidden strokeWidth={1.75} />}
                    title="Teleconsulta"
                    hint="Desde tu casa u oficina"
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display font-semibold text-heading">2. ¿Para quién es la cita?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Choice
                    name="forWhom"
                    value="mi"
                    current={forWhom}
                    onChange={setForWhom}
                    icon={<User aria-hidden strokeWidth={1.75} />}
                    title="Para mí"
                    hint="Soy el paciente"
                  />
                  <Choice
                    name="forWhom"
                    value="familiar"
                    current={forWhom}
                    onChange={setForWhom}
                    icon={<Users aria-hidden strokeWidth={1.75} />}
                    title="Para un familiar"
                    hint="Agendo por mi mamá, papá u otro"
                  />
                </div>
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="font-display font-semibold text-heading">3. Cuéntanos sobre la consulta</legend>
                <div>
                  <label htmlFor={fieldId("specialty")} className="block text-sm font-semibold text-heading">
                    Especialidad o motivo principal
                  </label>
                  <select
                    id={fieldId("specialty")}
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    aria-invalid={Boolean(errors.specialty)}
                    aria-describedby={describedBy("specialty")}
                    className={cn(INPUT, "mt-1.5 appearance-none bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10")}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                    }}
                  >
                    <option value="">Selecciona una opción</option>
                    {SPECIALTY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FieldError id={errorId("specialty")} message={errors.specialty} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={fieldId("fullName")} className="block text-sm font-semibold text-heading">
                      Nombre completo {forWhom === "familiar" ? "del paciente" : ""}
                    </label>
                    <input
                      id={fieldId("fullName")}
                      type="text"
                      autoComplete={forWhom === "mi" ? "name" : "off"}
                      maxLength={FIELD_LIMITS.nameMax}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={describedBy("fullName")}
                      className={cn(INPUT, "mt-1.5")}
                    />
                    <FieldError id={errorId("fullName")} message={errors.fullName} />
                  </div>
                  <div>
                    <label htmlFor={fieldId("phone")} className="block text-sm font-semibold text-heading">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      id={fieldId("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="987 654 321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={describedBy("phone")}
                      className={cn(INPUT, "mt-1.5")}
                    />
                    <FieldError id={errorId("phone")} message={errors.phone} />
                  </div>
                </div>

                <div>
                  <label htmlFor={fieldId("reason")} className="block text-sm font-semibold text-heading">
                    Motivo de consulta
                  </label>
                  <textarea
                    id={fieldId("reason")}
                    rows={3}
                    maxLength={FIELD_LIMITS.reasonMax}
                    placeholder="Ej.: dolor de rodilla al subir escaleras desde hace 3 meses"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    aria-invalid={Boolean(errors.reason)}
                    aria-describedby={describedBy("reason")}
                    className={cn(INPUT, "mt-1.5 py-3")}
                  />
                  <FieldError id={errorId("reason")} message={errors.reason} />
                </div>

                <div className="sm:max-w-xs">
                  <label htmlFor={fieldId("preferredDate")} className="block text-sm font-semibold text-heading">
                    Fecha preferida <span className="font-normal text-muted">(opcional)</span>
                  </label>
                  <input
                    id={fieldId("preferredDate")}
                    type="date"
                    min={minDate}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    aria-invalid={Boolean(errors.preferredDate)}
                    aria-describedby={describedBy("preferredDate")}
                    className={cn(INPUT, "mt-1.5")}
                  />
                  <FieldError id={errorId("preferredDate")} message={errors.preferredDate} />
                </div>
              </fieldset>

              <div>
                <label className="flex items-start gap-3 text-[0.95rem] text-muted">
                  <input
                    id={fieldId("consent")}
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={describedBy("consent")}
                    className="mt-0.5 size-5 shrink-0 accent-[var(--teal-strong)]"
                  />
                  <span>
                    Autorizo a {site.name} a usar mis datos para coordinar mi atención, según la{" "}
                    <Link href="/politica-de-privacidad" className="font-semibold text-link underline underline-offset-2">
                      política de privacidad
                    </Link>{" "}
                    (Ley N.° 29733).
                  </span>
                </label>
                <FieldError id={errorId("consent")} message={errors.consent} />
              </div>

              <button type="submit" className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "w-full")}>
                <WhatsAppIcon />
                Enviar solicitud por WhatsApp
              </button>
              <p className="text-center text-sm text-muted">
                ¿Prefieres llamar?{" "}
                <a href={`tel:${site.phone.tel}`} className="font-semibold text-link hover:underline">
                  {site.phone.display}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
