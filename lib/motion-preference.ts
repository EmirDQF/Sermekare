"use client";

import { useSyncExternalStore } from "react";

/** auto: sigue al sistema · reduce: el usuario pidió menos movimiento · full: el usuario reactivó animaciones. */
export type MotionPreference = "auto" | "reduce" | "full";

export const MOTION_STORAGE_KEY = "sermekare-motion";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

export function parseStoredPreference(value: string | null): MotionPreference {
  return value === "reduce" || value === "full" || value === "auto" ? value : "auto";
}

/** Una petición del sistema operativo de reducir movimiento siempre se respeta. */
export function shouldReduceMotion(preference: MotionPreference, systemReduces: boolean): boolean {
  if (systemReduces) return true;
  return preference === "reduce";
}

/* ---------- Store en el cliente (localStorage + media query) ---------- */

const listeners = new Set<() => void>();
let preference: MotionPreference | null = null;

function readPreference(): MotionPreference {
  if (preference) return preference;
  try {
    preference = parseStoredPreference(localStorage.getItem(MOTION_STORAGE_KEY));
  } catch {
    preference = "auto";
  }
  return preference;
}

function applyToDocument(reduce: boolean): void {
  document.documentElement.dataset.reduceMotion = reduce ? "true" : "false";
}

function snapshot(): boolean {
  return shouldReduceMotion(readPreference(), window.matchMedia(REDUCE_QUERY).matches);
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const media = window.matchMedia(REDUCE_QUERY);
  const handle = () => {
    applyToDocument(snapshot());
    onChange();
  };
  media.addEventListener("change", handle);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", handle);
  };
}

export function setMotionPreference(next: MotionPreference): void {
  preference = next;
  try {
    localStorage.setItem(MOTION_STORAGE_KEY, next);
  } catch {
    // Almacenamiento bloqueado: la preferencia dura solo esta visita.
  }
  applyToDocument(snapshot());
  listeners.forEach((listener) => listener());
}

/** true si hay que reducir animaciones (sistema o interruptor del footer). null en el servidor. */
export function useReducedMotionPreference(): boolean | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

/** Preferencia elegida en el interruptor (para mostrar su estado). */
export function useMotionPreferenceValue(): MotionPreference | null {
  return useSyncExternalStore(subscribe, readPreference, () => null);
}
