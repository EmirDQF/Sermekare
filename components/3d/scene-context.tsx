"use client";

import { createContext, useContext } from "react";
import { QUALITY_SETTINGS, type QualitySettings, type QualityTier } from "@/lib/quality";
import type { Theme } from "@/lib/theme";

/** Entorno que CanvasRoot comparte con todas las escenas (dentro del árbol del Canvas). */
export interface SceneEnv {
  tier: QualityTier;
  settings: QualitySettings;
  reducedMotion: boolean;
  theme: Theme;
  /** Puntero fino (mouse/trackpad): habilita la rotación que sigue al cursor. */
  finePointer: boolean;
}

const DEFAULT_ENV: SceneEnv = {
  tier: "medium",
  settings: QUALITY_SETTINGS.medium,
  reducedMotion: false,
  theme: "light",
  finePointer: true,
};

export const SceneEnvContext = createContext<SceneEnv>(DEFAULT_ENV);

export function useSceneEnv(): SceneEnv {
  return useContext(SceneEnvContext);
}

/** false cuando el hueco de la escena salió de pantalla: las escenas saltan su trabajo por frame. */
export const SceneActiveContext = createContext(true);

export function useSceneActive(): boolean {
  return useContext(SceneActiveContext);
}
