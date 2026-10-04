"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { useSceneActive, useSceneEnv } from "@/components/3d/scene-context";
import { MicroClockContext, type MicroClock } from "@/components/3d/micro/clock";
import { PILLAR_OBJECTS } from "@/components/3d/micro/pillars";
import { TREATMENT_OBJECTS } from "@/components/3d/micro/treatments";
import { CONDITION_OBJECTS } from "@/components/3d/micro/conditions";
import type { SceneProps } from "@/components/3d/scene-types";
import type { MicroVariant } from "@/lib/micro-variants";

const OBJECTS: Record<MicroVariant, () => React.JSX.Element> = {
  ...PILLAR_OBJECTS,
  ...TREATMENT_OBJECTS,
  ...CONDITION_OBJECTS,
};

const ENERGY_LAMBDA = 4;
/** Instante "bonito" para la pose estática (movimiento reducido o móvil). */
const STATIC_TIME = 1.2;

/**
 * Nivel 2: objeto 3D pequeño por pilar, tratamiento o condición. Gira suave; con hover
 * (o al curarse, en el triage) acelera y se ilumina. En móvil queda en un frame estático.
 */
export default function MicroScene({ variant, energy }: SceneProps["micro"]) {
  const { reducedMotion, tier, settings } = useSceneEnv();
  const active = useSceneActive();
  const clock = useRef<MicroClock>({ time: STATIC_TIME, energy: 0 });
  const rig = useRef<THREE.Group>(null);
  const animated = !reducedMotion && tier !== "mobile";
  const Object3D = OBJECTS[variant];

  useFrame((_, rawDelta) => {
    if (!active) return;
    const delta = Math.min(rawDelta, 0.1);
    const c = clock.current;
    const target = energy?.get() ?? 0;
    c.energy = animated ? THREE.MathUtils.damp(c.energy, target, ENERGY_LAMBDA, delta) : target;
    if (animated) c.time += delta * (0.7 + c.energy * 1.3) * settings.rotationSpeed;
    const r = rig.current;
    if (!r) return;
    r.rotation.y = Math.sin(c.time * 0.45) * 0.45 + c.energy * 0.35;
    r.position.y = animated ? Math.sin(c.time * 1.1) * 0.04 : 0;
    r.scale.setScalar(1 + c.energy * 0.08);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.1, 3.6]} fov={30} />
      <SceneLighting intensity={1.05} />
      <MicroClockContext value={clock}>
        <group ref={rig}>
          <Object3D />
        </group>
      </MicroClockContext>
    </>
  );
}
