import type { PainPoint } from "@/types/medical";

export const TRIAGE_EVENT = "sermekare:triage";
export const TRIAGE_SECTION_ID = "donde-te-duele";

export type TriageTarget = PainPoint["target"];

/** Pide al triage "¿Dónde te duele?" que preseleccione una zona o condición. */
export function requestTriage(target: TriageTarget): void {
  window.dispatchEvent(new CustomEvent<TriageTarget>(TRIAGE_EVENT, { detail: target }));
}
