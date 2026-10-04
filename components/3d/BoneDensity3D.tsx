"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { BoneMaterial } from "@/components/3d/materials";
import { SceneLighting, SceneShadow } from "@/components/3d/SceneLighting";
import { useSceneActive, useSceneEnv } from "@/components/3d/scene-context";
import { themeColors } from "@/components/3d/palette";
import type { SceneProps } from "@/components/3d/scene-types";
import { DENSITY_BY_LEVEL, buildTrabecularLattice, strutVisibility, type TrabecularLattice } from "@/lib/trabecular";
import type { BoneDensityLevel } from "@/types/medical";

/* ---------- Corte de hueso: corteza (cilindro) + panal trabecular (puntales instanciados) ---------- */

const BONE_RADIUS = 1;
const BONE_HEIGHT = 1.1;
const CORTEX_RADIUS = 1.08;
const LATTICE_SEED = 11;
const STRUT_RADIUS = 0.034;
const NODE_RADIUS = 0.05;
const DENSITY_LAMBDA = 3.2;
const SPIN_SPEED = 0.18;
const STATIC_ANGLE = 0.6;
/** Ámbar intermedio para la osteopenia (el coral queda reservado al riesgo alto). */
const OSTEOPENIA_COLOR = "#e9a23b";

/** Grosor de la corteza (anillo exterior) por estado: se adelgaza con la pérdida de masa ósea. */
const CORTEX_THICKNESS: Record<BoneDensityLevel, number> = {
  normal: 0.12,
  osteopenia: 0.08,
  osteoporosis: 0.045,
};

const UP = new THREE.Vector3(0, 1, 0);
/** Punto al que mira la cámara (se reaplica cada frame: sobrevive a cambios de posición). */
const CAMERA_TARGET = new THREE.Vector3(0, -0.05, 0);
const dummy = new THREE.Object3D();
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpDir = new THREE.Vector3();
const tmpColor = new THREE.Color();

function levelColor(level: BoneDensityLevel, health: string, inflammation: string): string {
  if (level === "normal") return health;
  if (level === "osteopenia") return OSTEOPENIA_COLOR;
  return inflammation;
}

/**
 * Densitometría: corte 3D de hueso trabecular. El estado (Normal / Osteopenia / Osteoporosis)
 * adelgaza las trabéculas, abre poros (desaparecen los puntales más frágiles) y lleva el color
 * de teal a coral con una transición amortiguada.
 */
export default function BoneDensity3D({ level }: SceneProps["bone"]) {
  const { tier, reducedMotion, settings, theme } = useSceneEnv();
  const active = useSceneActive();
  const colors = themeColors(theme);
  const targetColor = levelColor(level, colors.health, colors.inflammation);

  const lattice = useMemo(
    () => buildTrabecularLattice({ radius: BONE_RADIUS, height: BONE_HEIGHT, spacing: tier === "mobile" ? 0.34 : 0.28, seed: LATTICE_SEED }),
    [tier],
  );

  const groupRef = useRef<THREE.Group>(null);
  const strutsRef = useRef<THREE.InstancedMesh>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const state = useRef<{ density: number; angle: number; lattice: TrabecularLattice | null }>({
    density: -1,
    angle: STATIC_ANGLE,
    lattice: null,
  });

  useFrame((_, rawDelta) => {
    if (!active) return;
    cameraRef.current?.lookAt(CAMERA_TARGET);
    const delta = Math.min(rawDelta, 0.1);
    const s = state.current;
    const target = DENSITY_BY_LEVEL[level];
    const previous = s.density;
    s.density = reducedMotion || previous < 0 ? target : THREE.MathUtils.damp(previous, target, DENSITY_LAMBDA, delta);
    if (!reducedMotion) s.angle += delta * SPIN_SPEED * settings.rotationSpeed;
    if (groupRef.current) groupRef.current.rotation.y = s.angle;

    const struts = strutsRef.current;
    const nodes = nodesRef.current;
    if (struts) {
      const material = struts.material as THREE.MeshStandardMaterial;
      tmpColor.set(targetColor);
      if (reducedMotion) material.color.copy(tmpColor);
      else material.color.lerp(tmpColor, 1 - Math.exp(-DENSITY_LAMBDA * delta));
      material.emissive.copy(material.color);
      if (nodes) {
        const nodeMaterial = nodes.material as THREE.MeshStandardMaterial;
        nodeMaterial.color.copy(material.color);
        nodeMaterial.emissive.copy(material.color);
      }
    }

    // Recalcula las matrices si cambió la densidad o la red (al bajar de nivel de calidad).
    const latticeChanged = s.lattice !== lattice;
    s.lattice = lattice;
    if (!latticeChanged && Math.abs(s.density - previous) < 1e-4) return;
    const thickness = 0.35 + 0.65 * s.density;
    if (struts) {
      lattice.struts.forEach((strut, index) => {
        tmpA.set(...lattice.nodes[strut.from]);
        tmpB.set(...lattice.nodes[strut.to]);
        tmpDir.subVectors(tmpB, tmpA);
        const length = tmpDir.length();
        const radius = STRUT_RADIUS * thickness * strutVisibility(strut.threshold, s.density);
        dummy.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
        dummy.quaternion.setFromUnitVectors(UP, tmpDir.normalize());
        dummy.scale.set(radius, length, radius);
        dummy.updateMatrix();
        struts.setMatrixAt(index, dummy.matrix);
      });
      struts.instanceMatrix.needsUpdate = true;
    }
    if (nodes) {
      dummy.quaternion.identity();
      lattice.nodes.forEach((node, index) => {
        dummy.position.set(...node);
        dummy.scale.setScalar(NODE_RADIUS * (0.45 + 0.55 * s.density));
        dummy.updateMatrix();
        nodes.setMatrixAt(index, dummy.matrix);
      });
      nodes.instanceMatrix.needsUpdate = true;
    }
  });

  const cortex = CORTEX_THICKNESS[level];
  const capY = BONE_HEIGHT / 2;

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[2.7, 1.25, 3.3]} fov={32} />
      <SceneLighting />
      <SceneShadow y={-capY - 0.25} scale={4} opacity={0.3} />

      <group ref={groupRef} rotation={[0, STATIC_ANGLE, 0]}>
        {/* Panal trabecular */}
        <instancedMesh key={`struts-${lattice.struts.length}`} ref={strutsRef} args={[undefined, undefined, lattice.struts.length]} frustumCulled={false}>
          <cylinderGeometry args={[1, 1, 1, 6, 1]} />
          <meshStandardMaterial roughness={0.45} metalness={0} emissiveIntensity={0.18} />
        </instancedMesh>
        <instancedMesh key={`nodes-${lattice.nodes.length}`} ref={nodesRef} args={[undefined, undefined, lattice.nodes.length]} frustumCulled={false}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial roughness={0.45} metalness={0} emissiveIntensity={0.18} />
        </instancedMesh>

        {/* Corteza: pared translúcida y anillos de corte que se adelgazan */}
        <mesh>
          <cylinderGeometry args={[CORTEX_RADIUS, CORTEX_RADIUS, BONE_HEIGHT, 64, 1, true]} />
          <BoneMaterial transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {[capY, -capY].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[CORTEX_RADIUS - cortex, CORTEX_RADIUS, 64]} />
            <BoneMaterial side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </>
  );
}
