"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BioluminescentMaterial, BoneMaterial, GlowMaterial, applyHealing } from "@/components/3d/materials";
import { useMicroClock } from "@/components/3d/micro/clock";
import { ExpandingRings } from "@/components/3d/micro/parts";
import { useSceneEnv } from "@/components/3d/scene-context";
import { themeColors } from "@/components/3d/palette";
import { createRandom } from "@/lib/prng";
import type { ConditionVariant } from "@/lib/micro-variants";
import { DENSITY_BY_LEVEL, buildTrabecularLattice, strutVisibility } from "@/lib/trabecular";

/* Cada condición se muestra "enferma" (coral) y se cura hacia teal cuando energy → 1. */

const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();
const tmpColorB = new THREE.Color();

/** Color y latido bio-luminiscente compartidos por los materiales de una condición. */
function useHealing() {
  const clock = useMicroClock();
  const { theme } = useSceneEnv();
  const colors = themeColors(theme);
  const materials = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  useFrame(() => {
    const { time, energy } = clock.current;
    const pulse = 0.5 + 0.5 * Math.sin(time * (3 - energy * 1.5));
    materials.current.forEach((material) => material && applyHealing(material, energy, pulse, colors));
  });
  const register = (index: number) => (material: THREE.MeshStandardMaterial | null) => {
    materials.current[index] = material;
  };
  return { clock, colors, register };
}

/** Artrosis: cartílago erosionado entre dos huesos que se "rellena". */
function Osteoarthritis() {
  const { clock, register } = useHealing();
  const cartilage = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const thickness = 0.3 + 0.7 * clock.current.energy;
    cartilage.current?.scale.set(1, thickness, 1);
  });
  return (
    <group rotation={[0.35, 0.4, 0]}>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 0.62, 40]} />
        <BoneMaterial />
      </mesh>
      <mesh position={[0, -0.48, 0]}>
        <cylinderGeometry args={[0.42, 0.55, 0.62, 40]} />
        <BoneMaterial />
      </mesh>
      <mesh ref={cartilage}>
        <cylinderGeometry args={[0.56, 0.56, 0.3, 40]} />
        <BioluminescentMaterial ref={register(0)} opacity={0.85} />
      </mesh>
    </group>
  );
}

const FINGER_JOINTS = [0.45, -0.15] as const;

/** Artritis reumatoide: cadena de articulaciones de los dedos con halo inflamatorio que se calma. */
function RheumatoidFingers() {
  const { clock, colors, register } = useHealing();
  const halos = useRef<(THREE.Sprite | null)[]>([]);
  useFrame(() => {
    const { time, energy } = clock.current;
    halos.current.forEach((sprite, index) => {
      if (!sprite) return;
      sprite.scale.setScalar((0.75 + Math.sin(time * 3 + index) * 0.08) * (1 - energy * 0.55));
      const material = sprite.material as THREE.SpriteMaterial;
      material.color.copy(tmpColor.set(colors.inflammation).lerp(tmpColorB.set(colors.health), energy));
      material.opacity = 0.55 - energy * 0.35;
    });
  });
  return (
    <group rotation={[0, 0.3, -0.25]}>
      {[0.75, 0.15, -0.45].map((y, index) => (
        <mesh key={y} position={[0, y, 0]}>
          <capsuleGeometry args={[0.12, 0.34 - index * 0.04, 8, 20]} />
          <BoneMaterial />
        </mesh>
      ))}
      {FINGER_JOINTS.map((y, index) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 24, 16]} />
            <BioluminescentMaterial ref={register(index)} />
          </mesh>
          <sprite ref={(sprite) => { halos.current[index] = sprite; }}>
            <GlowMaterial />
          </sprite>
        </group>
      ))}
    </group>
  );
}

const CRYSTALS = 16;

/** Gota: cristales de urato en forma de aguja que se disuelven. */
function GoutCrystals() {
  const { clock, register } = useHealing();
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const calm = useRef<THREE.Group>(null);
  const crystals = useMemo(() => {
    const random = createRandom(33);
    return Array.from({ length: CRYSTALS }, () => ({
      rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI] as const,
      length: 0.5 + random() * 0.5,
    }));
  }, []);
  useFrame(() => {
    const { time, energy } = clock.current;
    const g = group.current;
    if (!g) return;
    g.rotation.y = time * 0.3;
    const dissolve = 1 - energy;
    g.children.forEach((child) => child.scale.set(dissolve * 0.9 + 0.1, dissolve, dissolve * 0.9 + 0.1));
    core.current?.scale.setScalar(1 + energy * 1.6);
    calm.current?.scale.setScalar(energy);
  });
  return (
    <group>
      <group ref={group}>
        {crystals.map((crystal, index) => (
          <mesh key={index} rotation={[...crystal.rotation]}>
            <coneGeometry args={[0.035, crystal.length, 6]} />
            <meshPhysicalMaterial color="#f8e7e3" roughness={0.1} clearcoat={1} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
      <mesh ref={core}>
        <sphereGeometry args={[0.16, 24, 16]} />
        <BioluminescentMaterial ref={register(0)} />
      </mesh>
      <group ref={calm} scale={0}>
        <ExpandingRings radius={0.55} speed={0.35} />
      </group>
    </group>
  );
}

const BUTTERFLY_POINTS = 160;

/** Lupus: mariposa de partículas que aletea y se serena. */
function LupusButterfly() {
  const { clock, register } = useHealing();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const base = useMemo(
    () =>
      Array.from({ length: BUTTERFLY_POINTS }, (_, index) => {
        const t = (index / BUTTERFLY_POINTS) * Math.PI * 12;
        const r = Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((2 * t - Math.PI) / 24), 5);
        return [Math.sin(t) * r * 0.2, Math.cos(t) * r * 0.2 - 0.05] as const;
      }),
    [],
  );
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { time, energy } = clock.current;
    const flap = Math.sin(time * (4 - energy * 2.5)) * (0.7 - energy * 0.45);
    base.forEach(([x, y], index) => {
      const side = Math.sign(x) || 1;
      dummy.position.set(x * Math.cos(flap), y, Math.abs(x) * Math.sin(flap) * side * side);
      dummy.scale.setScalar(0.028);
      dummy.updateMatrix();
      m.setMatrixAt(index, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BUTTERFLY_POINTS]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 6]} />
      <BioluminescentMaterial ref={register(0)} />
    </instancedMesh>
  );
}

const NERVE_NODES = 22;

/** Fibromialgia: red de filamentos nerviosos con pulsos de luz que se suavizan. */
function NerveNetwork() {
  const { clock, colors } = useHealing();
  const lines = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const random = createRandom(9);
    const nodes = Array.from({ length: NERVE_NODES }, () => {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const r = 0.45 + random() * 0.45;
      return new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    });
    const positions: number[] = [];
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach((b) => a.distanceTo(b) < 0.62 && positions.push(a.x, a.y, a.z, b.x, b.y, b.z)));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame(() => {
    const l = lines.current;
    if (!l) return;
    const { time, energy } = clock.current;
    const material = l.material as THREE.LineBasicMaterial;
    const flicker = (1 - energy) * (0.5 + 0.5 * Math.sin(time * 9) * Math.sin(time * 3.7));
    material.opacity = 0.45 + flicker * 0.5;
    material.color.copy(tmpColor.set(colors.inflammation).lerp(tmpColorB.set(colors.health), energy));
    l.rotation.y = time * 0.25;
  });
  return (
    <lineSegments ref={lines} geometry={geometry}>
      <lineBasicMaterial transparent toneMapped={false} />
    </lineSegments>
  );
}

/** Osteoporosis: hueso trabecular poroso que se densifica. */
const UP = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

function DensifyingBone() {
  const { clock, colors } = useHealing();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const lastDensity = useRef(-1);
  const lattice = useMemo(() => buildTrabecularLattice({ radius: 0.62, height: 0.9, spacing: 0.22, seed: 4 }), []);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { time, energy } = clock.current;
    m.rotation.y = time * 0.25;
    (m.material as THREE.MeshStandardMaterial).color.copy(tmpColor.set(colors.inflammation).lerp(tmpColorB.set(colors.health), energy));
    const density = THREE.MathUtils.lerp(DENSITY_BY_LEVEL.osteoporosis, DENSITY_BY_LEVEL.normal, energy);
    if (Math.abs(density - lastDensity.current) < 1e-4) return;
    lastDensity.current = density;
    lattice.struts.forEach((strut, index) => {
      tmpA.set(...lattice.nodes[strut.from]);
      tmpB.set(...lattice.nodes[strut.to]);
      tmpDir.subVectors(tmpB, tmpA);
      const length = tmpDir.length();
      const radius = 0.026 * (0.4 + 0.6 * density) * strutVisibility(strut.threshold, density);
      dummy.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(UP, tmpDir.normalize());
      dummy.scale.set(radius, length, radius);
      dummy.updateMatrix();
      m.setMatrixAt(index, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, lattice.struts.length]} frustumCulled={false} rotation={[0.25, 0, 0]}>
      <cylinderGeometry args={[1, 1, 1, 6, 1]} />
      <meshStandardMaterial roughness={0.45} />
    </instancedMesh>
  );
}

const VERTEBRAE = 5;

/** Espondiloartritis: vértebras desalineadas que se alinean. */
function AligningSpine() {
  const { clock, register } = useHealing();
  const group = useRef<THREE.Group>(null);
  const offsets = useMemo(() => [0.16, -0.12, 0.2, -0.18, 0.1], []);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { energy } = clock.current;
    g.children.forEach((child) => {
      const index = child.userData.index as number | undefined;
      if (index === undefined) return;
      child.position.x = offsets[index] * (1 - energy);
      child.rotation.z = offsets[index] * 1.4 * (1 - energy);
    });
  });
  return (
    <group ref={group} rotation={[0.25, 0.5, 0]}>
      {Array.from({ length: VERTEBRAE }, (_, index) => (
        <group key={index} userData={{ index }} position={[0, (index - 2) * 0.34, 0]}>
          <mesh>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 32]} />
            <BoneMaterial />
          </mesh>
          <mesh position={[0, 0, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.3, 12]} />
            <BoneMaterial />
          </mesh>
          {index < VERTEBRAE - 1 ? (
            <mesh position={[0, 0.17, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.1, 32]} />
              <BioluminescentMaterial ref={register(index)} opacity={0.85} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}

export const CONDITION_OBJECTS: Record<ConditionVariant, () => React.JSX.Element> = {
  artrosis: Osteoarthritis,
  "artritis-reumatoide": RheumatoidFingers,
  gota: GoutCrystals,
  lupus: LupusButterfly,
  fibromialgia: NerveNetwork,
  osteoporosis: DensifyingBone,
  espondiloartritis: AligningSpine,
};
