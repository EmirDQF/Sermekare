/** Objetos 3D de Nivel 2: uno por pilar de servicio, tratamiento y condición del triage. */

export const PILLAR_VARIANTS = [
  "apoyo-diagnostico",
  "apoyo-terapeutico",
  "telemedicina",
  "procedimientos",
  "consulta-externa",
] as const;

export const TREATMENT_VARIANTS = [
  "infiltraciones-ecoguiadas",
  "terapias-biologicas",
  "viscosuplementacion",
  "terapia-fisica",
  "laboratorio-y-densitometria",
  "videocapilaroscopia",
] as const;

export const CONDITION_VARIANTS = [
  "artrosis",
  "artritis-reumatoide",
  "gota",
  "lupus",
  "fibromialgia",
  "osteoporosis",
  "espondiloartritis",
] as const;

export type PillarVariant = (typeof PILLAR_VARIANTS)[number];
export type TreatmentVariant = (typeof TREATMENT_VARIANTS)[number];
export type ConditionVariant = (typeof CONDITION_VARIANTS)[number];
export type MicroVariant = PillarVariant | TreatmentVariant | ConditionVariant;

const ALL: readonly string[] = [...PILLAR_VARIANTS, ...TREATMENT_VARIANTS, ...CONDITION_VARIANTS];

export function isMicroVariant(value: string): value is MicroVariant {
  return ALL.includes(value);
}
