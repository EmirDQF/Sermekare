"use client";

import { useSyncExternalStore } from "react";

/** Debe coincidir con THEME_STORAGE_KEY en app/layout.tsx (script anti-destello). */
export const THEME_STORAGE_KEY = "sermekare-theme";
export type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getServerSnapshot = (): Theme | null => null;

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Almacenamiento bloqueado (modo privado): el tema se aplica solo en esta visita.
  }
}

/** Tema activo (observa data-theme en <html>). null en el servidor. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
}
