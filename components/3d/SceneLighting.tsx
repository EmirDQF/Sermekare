"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useSceneEnv } from "@/components/3d/scene-context";
import { PALETTE } from "@/components/3d/palette";

const ORIGIN: [number, number, number] = [0, 0, 0];

interface SceneLightingProps {
  /** Multiplica todas las intensidades (escenas más oscuras o más brillantes). */
  intensity?: number;
  /** Luz de contorno teal (rim light) para separar el objeto del fondo. */
  rim?: boolean;
  /** Mapa de entorno procedural para reflejos en cristal y hueso (sin descargas). */
  environment?: boolean;
}

/**
 * Iluminación cinematográfica común: key light blanca, rim light teal, fill azul
 * y un entorno de estudio generado con Lightformers (se renderiza una sola vez).
 */
export function SceneLighting({ intensity = 1, rim = true, environment = true }: SceneLightingProps) {
  const { theme, tier } = useSceneEnv();
  const dark = theme === "dark";

  return (
    <>
      <ambientLight intensity={(dark ? 0.22 : 0.28) * intensity} />
      <hemisphereLight args={["#ffffff", PALETTE.navy2, (dark ? 0.35 : 0.45) * intensity]} />
      <directionalLight position={[3, 5, 4]} intensity={(dark ? 1.6 : 2.4) * intensity} />
      {rim ? (
        <directionalLight position={[-4, 2, -3]} intensity={(dark ? 3 : 2.2) * intensity} color={PALETTE.tealLight} />
      ) : null}
      <pointLight position={[0, -2.5, 2.5]} intensity={0.8 * intensity} distance={9} color={PALETTE.skyLight} />
      {environment ? (
        <Environment resolution={tier === "mobile" ? 32 : 64} frames={1} environmentIntensity={dark ? 0.55 : 0.65}>
          <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[8, 3, 1]} target={ORIGIN} />
          <Lightformer form="ring" intensity={3} color={PALETTE.tealLight} position={[-4, 0.5, 1]} scale={2.2} target={ORIGIN} />
          <Lightformer form="rect" intensity={1.4} color={PALETTE.skyLight} position={[4, -1, -2]} scale={[3, 5, 1]} target={ORIGIN} />
          <Lightformer form="circle" intensity={0.8} position={[0, -4, 0]} scale={4} target={ORIGIN} />
        </Environment>
      ) : null}
    </>
  );
}

interface SceneShadowProps {
  y: number;
  scale?: number;
  opacity?: number;
}

/** Sombra de contacto suave. En calidad media/móvil o con movimiento reducido se calcula una sola vez. */
export function SceneShadow({ y, scale = 4, opacity = 0.35 }: SceneShadowProps) {
  const { tier, theme, reducedMotion } = useSceneEnv();
  const live = tier === "high" && !reducedMotion;
  return (
    <ContactShadows
      position={[0, y, 0]}
      scale={scale}
      opacity={theme === "dark" ? opacity * 1.4 : opacity}
      blur={2.6}
      far={3}
      resolution={tier === "high" ? 512 : 256}
      frames={live ? Infinity : 1}
      color={PALETTE.navy}
    />
  );
}
