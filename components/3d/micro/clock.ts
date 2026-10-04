"use client";

import { createContext, useContext, type RefObject } from "react";

/**
 * Estado por frame de una micro escena. `energy` (0..1) es el hover de la tarjeta en pilares
 * y tratamientos, y el progreso "enfermo → sano" en las condiciones del triage.
 */
export interface MicroClock {
  time: number;
  energy: number;
}

const FALLBACK: RefObject<MicroClock> = { current: { time: 0, energy: 0 } };

export const MicroClockContext = createContext<RefObject<MicroClock>>(FALLBACK);

/** Los objetos solo leen el reloj dentro de useFrame; MicroScene es quien lo avanza. */
export function useMicroClock(): RefObject<MicroClock> {
  return useContext(MicroClockContext);
}

/** Fase 0..1 que se repite (pulsos, anillos que se expanden). */
export function cycle(time: number, speed: number, offset = 0): number {
  const value = time * speed + offset;
  return value - Math.floor(value);
}
