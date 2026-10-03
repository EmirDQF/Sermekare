"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";
import { getOpenStatus, type OpenStatus } from "@/lib/schedule";

const REFRESH_MS = 60_000;

let cached: OpenStatus | null = null;

function refresh(): void {
  cached = getOpenStatus(site.hours);
}

function subscribe(onChange: () => void): () => void {
  const id = window.setInterval(() => {
    refresh();
    onChange();
  }, REFRESH_MS);
  return () => window.clearInterval(id);
}

function getSnapshot(): OpenStatus | null {
  if (!cached) refresh();
  return cached;
}

const getServerSnapshot = (): OpenStatus | null => null;

/**
 * Estado "Abierto ahora / Cerrado" en hora de Lima.
 * Devuelve null en el servidor y durante la hidratación (evita desajustes), y el estado real en el cliente.
 */
export function useOpenStatus(): OpenStatus | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
