/**
 * Estado compartido entre los huecos 3D del DOM (Scene3DSlot) y el lienzo WebGL global (CanvasRoot).
 * No importa three: vive en el bundle inicial y pesa unos pocos bytes.
 */

/** idle: nadie pidió 3D · requested: cargando el lienzo · ready: WebGL funcionando · failed: usar fallbacks. */
export type CanvasStatus = "idle" | "requested" | "ready" | "failed";

export interface SceneRegistryState {
  status: CanvasStatus;
  /** Huecos 3D visibles (o a punto de serlo). Si está vacío, el lienzo deja de renderizar. */
  activeSlots: readonly string[];
}

export interface SceneRegistry {
  getState(): SceneRegistryState;
  subscribe(listener: () => void): () => void;
  request(): void;
  markReady(): void;
  markFailed(): void;
  setActive(slotId: string, active: boolean): void;
}

const INITIAL_STATE: SceneRegistryState = { status: "idle", activeSlots: [] };

export function createSceneRegistry(): SceneRegistry {
  let state = INITIAL_STATE;
  const listeners = new Set<() => void>();

  function commit(next: SceneRegistryState): void {
    if (next === state) return;
    state = next;
    listeners.forEach((listener) => listener());
  }

  function withStatus(status: CanvasStatus): SceneRegistryState {
    return status === state.status ? state : { ...state, status };
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    request() {
      if (state.status === "idle") commit(withStatus("requested"));
    },
    markReady() {
      if (state.status === "requested") commit(withStatus("ready"));
    },
    markFailed() {
      commit(withStatus("failed"));
    },
    setActive(slotId, active) {
      const isActive = state.activeSlots.includes(slotId);
      if (active === isActive) return;
      const activeSlots = active
        ? [...state.activeSlots, slotId]
        : state.activeSlots.filter((id) => id !== slotId);
      commit({ ...state, activeSlots });
    },
  };
}

/** Instancia única de la app. */
export const sceneRegistry = createSceneRegistry();
