export type Modality = "presencial" | "teleconsulta";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface OpeningHours {
  /** Días abiertos (0 = domingo … 6 = sábado). */
  days: readonly Weekday[];
  /** Hora de apertura, en minutos desde medianoche. */
  opensAt: number;
  /** Hora de cierre, en minutos desde medianoche. */
  closesAt: number;
  timeZone: string;
  label: string;
  closedLabel: string;
}

export interface SocialLink {
  network: "instagram" | "facebook" | "tiktok" | "youtube";
  label: string;
  href: string;
}

export interface TrustStat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface SiteConfig {
  name: string;
  legalTagline: string;
  slogan: string;
  domain: string;
  url: string;
  address: {
    street: string;
    district: string;
    city: string;
    country: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
    howToArrive: readonly string[];
  };
  phone: { display: string; tel: string };
  whatsapp: { display: string; number: string; defaultMessage: string };
  email: string;
  hours: OpeningHours;
  socials: readonly SocialLink[];
  stats: {
    consultations: TrustStat;
    rating: TrustStat;
    years: TrustStat;
    specialists: TrustStat;
    reviewsCount: number;
  };
  youtubeVideoId: string;
  provisional: boolean;
}

export type SpecialtySlug =
  | "artrosis"
  | "artritis-reumatoide"
  | "gota"
  | "lupus"
  | "fibromialgia"
  | "osteoporosis"
  | "espondiloartritis";

export interface Specialty {
  slug: SpecialtySlug;
  name: string;
  shortName: string;
  summary: string;
  symptoms: readonly string[];
  alertSigns: readonly string[];
  approach: string;
  doctorSlug: string;
  /** Si aparece como chip en el triage por condición. */
  inTriage: boolean;
  provisional: boolean;
}

export interface Service {
  name: string;
  description?: string;
}

export interface ServicePillar {
  slug: string;
  name: string;
  tagline: string;
  icon: IconName;
  services: readonly Service[];
  /** Tamaño en la grilla bento de la Home. */
  size: "lg" | "md" | "sm";
}

export interface Treatment {
  slug: string;
  name: string;
  summary: string;
  indicatedFor: string;
  benefits: readonly string[];
  duration: string;
  icon: IconName;
  provisional: boolean;
}

export interface DoctorSchedule {
  day: string;
  hours: string;
  modality: Modality | "ambas";
}

export interface Doctor {
  slug: string;
  name: string;
  title: string;
  specialty: string;
  cmp: string;
  rne: string;
  yearsOfExperience: number;
  education: readonly string[];
  focus: readonly string[];
  photo: string;
  photoAlt: string;
  schedule: readonly DoctorSchedule[];
  provisional: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  age: number;
  condition: string;
  specialtySlug: SpecialtySlug;
  treatmentTime: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  featured?: boolean;
  provisional: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  authorSlug: string;
  publishedAt: string;
  cover: string;
  coverAlt: string;
}

export type BodyZoneId =
  | "cuello"
  | "hombros"
  | "manos"
  | "espalda"
  | "cadera"
  | "rodillas"
  | "pies";

export interface BodyZone {
  id: BodyZoneId;
  label: string;
  possibleCauses: string;
  alertSigns: readonly string[];
  approach: string;
  specialtySlug: SpecialtySlug;
  doctorSlug: string;
}

export interface PainPoint {
  id: string;
  quote: string;
  context: string;
  target: { kind: "zone"; zone: BodyZoneId } | { kind: "condition"; slug: SpecialtySlug };
}

export interface Insurer {
  id: string;
  label: string;
  kind: "eps" | "seguro" | "alianza";
}

export type AppointmentFor = "mi" | "familiar";

export interface Appointment {
  modality: Modality;
  forWhom: AppointmentFor;
  specialty: string;
  doctorName?: string;
  fullName: string;
  phone: string;
  reason: string;
  preferredDate?: string;
}

export type IconName =
  | "scan"
  | "syringe"
  | "video"
  | "crosshair"
  | "stethoscope"
  | "activity"
  | "flask"
  | "pill"
  | "waves"
  | "dumbbell"
  | "microscope"
  | "calendar"
  | "clipboard"
  | "file-check";

/* ---------- Densitometría ósea ---------- */

/** Categorías de la OMS para el T-score. */
export type BoneDensityLevel = "normal" | "osteopenia" | "osteoporosis";

export interface BoneDensityState {
  id: BoneDensityLevel;
  label: string;
  /** Rango del T-score en texto (p. ej. "−1,0 o más"). */
  range: string;
  /** Explicación en una frase, sin jerga. */
  explanation: string;
}

export interface DensitometryAudience {
  id: "para-ti" | "para-tus-padres";
  title: string;
  items: readonly string[];
}

export interface DensitometryStep {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface DensitometryQuestion {
  id: string;
  question: string;
}

export interface DensitometryContent {
  whatIs: string;
  technicalName: string;
  measuredAt: string;
  purpose: readonly string[];
  howItWorks: readonly string[];
  safety: readonly string[];
  preparation: readonly string[];
  states: readonly BoneDensityState[];
  tScoreNote: string;
  zScore: { range: string; explanation: string; note: string };
  interpretationNote: string;
  audiences: readonly DensitometryAudience[];
  followUp: string;
  relatedServices: readonly string[];
  steps: readonly DensitometryStep[];
  checklist: readonly DensitometryQuestion[];
  faq: readonly FAQItem[];
  cta: { label: string; message: string; support: string };
  disclaimer: string;
  hud: readonly string[];
}

/* ---------- Detalle de páginas internas (servicios y tratamientos) ---------- */

export interface ServiceDetail {
  intro: string;
  highlights: readonly string[];
  /** Descripción breve de cada subservicio, por su nombre exacto en data/services.ts. */
  serviceNotes: Readonly<Record<string, string>>;
  relatedTreatments: readonly string[];
}

export interface TreatmentDetail {
  pillarSlug: string;
  kind: "therapeutic" | "diagnostic";
  procedure: readonly string[];
  /** Cuidados posteriores (y preparación, cuando aplica). */
  aftercare: readonly string[];
}
