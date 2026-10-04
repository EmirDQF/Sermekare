import type { Theme } from "@/lib/theme";

/** Colores de marca para WebGL (los mismos de globals.css; three no lee variables CSS). */
export const PALETTE = {
  teal: "#00a896",
  tealLight: "#2dd4bf",
  coral: "#f97362",
  coralLight: "#fb8a7b",
  sky: "#0284c7",
  skyLight: "#7dd3fc",
  cyan: "#67e8f9",
  navy: "#0b192c",
  navy2: "#1e3e62",
} as const;

export interface ThemeColors {
  bone: string;
  boneSheen: string;
  glassTint: string;
  /** Teal "sano" que mejor contrasta con el fondo de cada tema. */
  health: string;
  /** Coral "inflamación" de cada tema. */
  inflammation: string;
}

const LIGHT: ThemeColors = {
  bone: "#e9e2d6",
  boneSheen: "#cdeee8",
  glassTint: "#e6fbf7",
  health: PALETTE.teal,
  inflammation: PALETTE.coral,
};

const DARK: ThemeColors = {
  bone: "#c9d6e3",
  boneSheen: "#7dd3fc",
  glassTint: "#bfeee7",
  health: PALETTE.tealLight,
  inflammation: PALETTE.coralLight,
};

export function themeColors(theme: Theme): ThemeColors {
  return theme === "dark" ? DARK : LIGHT;
}
