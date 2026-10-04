"use client";

import { Suspense, lazy, useRef, type ComponentType } from "react";
import { useFrame } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { SceneActiveContext } from "@/components/3d/scene-context";
import { SceneErrorBoundary } from "@/components/3d/SceneErrorBoundary";
import type { SceneId, SceneProps } from "@/components/3d/scene-types";

/** Cada escena es su propio chunk: una sección solo descarga el 3D que usa. */
const SCENES: { [K in SceneId]: ComponentType<SceneProps[K]> } = {
  joint: lazy(() => import("@/components/3d/JointViewer3D")),
  hologram: lazy(() => import("@/components/3d/BodyHologram3D")),
  ultrasound: lazy(() => import("@/components/3d/UltrasoundScanFX")),
  bone: lazy(() => import("@/components/3d/BoneDensity3D")),
};

interface FirstFrameProps {
  onReady: () => void;
}

/** Avisa al DOM cuando la escena ya dibujó su primer frame (para el fundido desde el fallback). */
function FirstFrame({ onReady }: FirstFrameProps) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
  return null;
}

export interface SceneViewProps<K extends SceneId> {
  scene: K;
  sceneProps: SceneProps[K];
  visible: boolean;
  interactive: boolean;
  className?: string;
  onReady: () => void;
  onError: () => void;
}

/** Hueco del DOM que el lienzo global rastrea (drei <View>) con la escena correspondiente. */
export default function SceneView<K extends SceneId>({
  scene,
  sceneProps,
  visible,
  interactive,
  className,
  onReady,
  onError,
}: SceneViewProps<K>) {
  // TypeScript no puede correlacionar la clave genérica con su componente; el mapa de arriba sí está tipado.
  const Scene = SCENES[scene] as ComponentType<SceneProps[K]>;

  return (
    <div aria-hidden className={className}>
      <View
        className="size-full"
        style={{ pointerEvents: interactive ? "auto" : "none", touchAction: interactive ? "pan-y" : undefined }}
        visible={visible}
      >
        <SceneActiveContext value={visible}>
          <SceneErrorBoundary onError={onError}>
            <Suspense fallback={null}>
              <Scene {...sceneProps} />
              <FirstFrame onReady={onReady} />
            </Suspense>
          </SceneErrorBoundary>
        </SceneActiveContext>
      </View>
    </div>
  );
}
