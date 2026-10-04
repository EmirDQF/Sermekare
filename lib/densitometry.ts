/**
 * Lógica de lectura de la densitometría (criterios de la OMS). Solo orienta:
 * el resultado siempre lo interpreta el especialista junto con la historia clínica.
 */

import type { BoneDensityLevel } from "@/types/medical";

export type TScoreCategory = BoneDensityLevel;
export type ZScoreCategory = "expected" | "below-expected";
export type ChecklistOutcome = "pending" | "talk-to-specialist" | "guidance";

/** Escala del gauge interactivo. */
export const SCORE_MIN = -4;
export const SCORE_MAX = 2;
export const SCORE_STEP = 0.1;

const NORMAL_FROM = -1;
const OSTEOPOROSIS_UP_TO = -2.5;
const Z_BELOW_EXPECTED_UP_TO = -2;

/** Redondea a 1 decimal para que los límites (−1,0 / −2,5) no fallen por error de coma flotante. */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function classifyTScore(score: number): TScoreCategory {
  const value = round1(score);
  if (value >= NORMAL_FROM) return "normal";
  if (value <= OSTEOPOROSIS_UP_TO) return "osteoporosis";
  return "osteopenia";
}

export function classifyZScore(score: number): ZScoreCategory {
  return round1(score) <= Z_BELOW_EXPECTED_UP_TO ? "below-expected" : "expected";
}

export function clampScore(score: number): number {
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, round1(score)));
}

/** Posición en la barra (0 = −4, 100 = +2). */
export function scoreToPercent(score: number): number {
  return ((clampScore(score) - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;
}

/** Valor del gauge para una posición del puntero (0..1 sobre el ancho de la barra). */
export function percentToScore(fraction: number): number {
  return clampScore(SCORE_MIN + fraction * (SCORE_MAX - SCORE_MIN));
}

/** Avanza `steps` pasos de 0,1 (negativos para bajar), sin salir de la escala. */
export function stepScore(score: number, steps: number): number {
  return clampScore(score + steps * SCORE_STEP);
}

/** "−2,5", "+1,0", "0,0": signo menos tipográfico y coma decimal (es-PE). */
export function formatScore(score: number): string {
  const value = round1(score);
  const digits = Math.abs(value).toFixed(1).replace(".", ",");
  if (value === 0) return digits;
  return `${value < 0 ? "−" : "+"}${digits}`;
}

/**
 * Con al menos un "sí" vale la pena conversarlo; la orientación general solo aparece cuando
 * todas las respuestas son "no". Nunca es un diagnóstico ni un puntaje de riesgo.
 */
export function checklistOutcome(answers: Readonly<Record<string, boolean>>, totalQuestions: number): ChecklistOutcome {
  const values = Object.values(answers);
  if (values.some(Boolean)) return "talk-to-specialist";
  return values.length >= totalQuestions && totalQuestions > 0 ? "guidance" : "pending";
}
