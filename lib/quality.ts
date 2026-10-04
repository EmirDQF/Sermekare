/** Nivel de calidad del 3D: define partículas, DPR, postprocesado y velocidad de rotación. */
export type QualityTier = "high" | "medium" | "mobile";

export interface DeviceSignals {
  cores: number;
  /** navigator.deviceMemory (no existe en Safari/Firefox). */
  memoryGb?: number;
  coarsePointer: boolean;
  viewportWidth: number;
}

const MOBILE_MAX_WIDTH = 768;
const TOUCH_MOBILE_MAX_WIDTH = 1024;
const HIGH_MIN_CORES = 8;
const HIGH_MIN_MEMORY_GB = 8;

export function pickQualityTier({ cores, memoryGb, coarsePointer, viewportWidth }: DeviceSignals): QualityTier {
  if (viewportWidth < MOBILE_MAX_WIDTH) return "mobile";
  if (coarsePointer && viewportWidth < TOUCH_MOBILE_MAX_WIDTH) return "mobile";
  // Tablets y táctiles grandes: GPU móvil aunque la pantalla sea ancha.
  if (coarsePointer) return "medium";
  const enoughMemory = memoryGb === undefined || memoryGb >= HIGH_MIN_MEMORY_GB;
  if (cores >= HIGH_MIN_CORES && enoughMemory) return "high";
  return "medium";
}

/** Lee las señales del dispositivo actual (solo en el cliente). */
export function readDeviceSignals(): DeviceSignals {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    cores: nav.hardwareConcurrency || 4,
    memoryGb: nav.deviceMemory,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    viewportWidth: window.innerWidth,
  };
}

/** Baja un nivel cuando PerformanceMonitor detecta caída de fps. */
export function downgradeTier(tier: QualityTier): QualityTier {
  if (tier === "high") return "medium";
  return "mobile";
}

export interface QualitySettings {
  dpr: [number, number];
  particleScale: number;
  postprocessing: boolean;
  rotationSpeed: number;
}

export const QUALITY_SETTINGS: Record<QualityTier, QualitySettings> = {
  high: { dpr: [1, 1.75], particleScale: 1, postprocessing: true, rotationSpeed: 1 },
  medium: { dpr: [1, 1.5], particleScale: 0.6, postprocessing: false, rotationSpeed: 0.8 },
  mobile: { dpr: [1, 1.25], particleScale: 0.35, postprocessing: false, rotationSpeed: 0.5 },
};
