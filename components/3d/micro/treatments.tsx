"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BoneMaterial, ClinicalGlassMaterial } from "@/components/3d/materials";
import { cycle, useMicroClock } from "@/components/3d/micro/clock";
import { Antibody, GlowBead, HealthMaterial, Needle } from "@/components/3d/micro/parts";
import { PALETTE } from "@/components/3d/palette";
import type { TreatmentVariant } from "@/lib/micro-variants";

/** Infiltración ecoguiada: aguja + abanico de ultrasonido que barre. */
function GuidedInjection() {
  const clock = useMicroClock();
  const sweep = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (sweep.current) sweep.current.rotation.z = Math.sin(clock.current.time * 1.4) * 0.45;
  });
  return (
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI]}>
        <circleGeometry args={[1.1, 48, Math.PI / 2 - 0.55, 1.1]} />
        <meshBasicMaterial color={PALETTE.tealLight} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={sweep} position={[0, 0.55, 0.01]}>
        <planeGeometry args={[0.02, 2.2]} />
        <meshBasicMaterial color={PALETTE.tealLight} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <Needle position={[0.55, -0.1, 0.05]} rotation={[0, 0, 0.75]} scale={0.7} />
      <GlowBead position={[0.05, -0.32, 0.05]} radius={0.07} />
    </group>
  );
}

/** Terapias biológicas: anticuerpos "Y" flotando. */
function FloatingAntibodies() {
  const clock = useMicroClock();
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, index) => {
      child.position.y = child.userData.baseY + Math.sin(clock.current.time * 1.2 + index * 2) * 0.08;
      child.rotation.y = clock.current.time * (0.4 + index * 0.15);
    });
  });
  const items = [
    { position: [-0.55, 0.15, 0] as const, scale: 0.75 },
    { position: [0.5, 0.35, -0.2] as const, scale: 0.6 },
    { position: [0.15, -0.35, 0.2] as const, scale: 0.85 },
  ];
  return (
    <group ref={group}>
      {items.map((item, index) => (
        <Antibody key={index} position={[...item.position]} scale={item.scale} userData={{ baseY: item.position[1] }} />
      ))}
    </group>
  );
}

/** Viscosuplementación: gota de gel translúcida que se deforma. */
function GelDrop() {
  const clock = useMicroClock();
  const drop = useRef<THREE.Group>(null);
  useFrame(() => {
    const { time, energy } = clock.current;
    const wobble = Math.sin(time * 2.2) * (0.06 + energy * 0.06);
    drop.current?.scale.set(1 + wobble, 1 - wobble, 1 + wobble);
  });
  return (
    <group ref={drop}>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.62, 48, 32]} />
        <ClinicalGlassMaterial opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.48, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.36, 0.55, 48, 1, true]} />
        <ClinicalGlassMaterial opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <GlowBead position={[0, -0.15, 0]} radius={0.24} />
    </group>
  );
}

/** Terapia física: articulación que flexiona en su rango de movimiento. */
function FlexingJoint() {
  const clock = useMicroClock();
  const upper = useRef<THREE.Group>(null);
  useFrame(() => {
    const { time, energy } = clock.current;
    if (upper.current) upper.current.rotation.z = 0.2 + (Math.sin(time * 1.3) * 0.5 + 0.5) * (0.6 + energy * 0.5);
  });
  return (
    <group position={[-0.1, -0.1, 0]} rotation={[0, 0.4, 0]}>
      <mesh position={[0, -0.45, 0]}>
        <capsuleGeometry args={[0.13, 0.7, 8, 20]} />
        <BoneMaterial />
      </mesh>
      <group ref={upper}>
        <mesh position={[0, 0.45, 0]}>
          <capsuleGeometry args={[0.13, 0.7, 8, 20]} />
          <BoneMaterial />
        </mesh>
      </group>
      <GlowBead radius={0.17} />
    </group>
  );
}

/** Laboratorio y densitometría: hueso escaneado por una línea láser. */
function ScannedBone() {
  const clock = useMicroClock();
  const laser = useRef<THREE.Group>(null);
  useFrame(() => {
    if (laser.current) laser.current.position.x = (cycle(clock.current.time, 0.35) - 0.5) * 1.5;
  });
  return (
    <group rotation={[0.2, 0.3, 0.15]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.13, 1.1, 8, 20]} />
        <BoneMaterial />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0, 0]} scale={[0.9, 1.15, 1]}>
          <sphereGeometry args={[0.22, 24, 16]} />
          <BoneMaterial />
        </mesh>
      ))}
      <group ref={laser}>
        <mesh>
          <boxGeometry args={[0.015, 0.75, 0.75]} />
          <meshBasicMaterial color={PALETTE.tealLight} transparent opacity={0.35} toneMapped={false} depthWrite={false} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.012, 0.8, 0.02]} />
          <HealthMaterial />
        </mesh>
      </group>
    </group>
  );
}

const CAPILLARY_PATHS: readonly (readonly [number, number, number])[][] = [
  [[-0.6, -0.5, 0], [-0.55, 0.35, 0], [-0.35, 0.45, 0], [-0.3, -0.5, 0]],
  [[-0.15, -0.5, 0], [-0.1, 0.4, 0], [0.12, 0.5, 0], [0.15, -0.5, 0]],
  [[0.32, -0.5, 0], [0.36, 0.3, 0], [0.56, 0.4, 0], [0.6, -0.5, 0]],
];

/** Videocapilaroscopía: capilares bajo una lente. */
function Capillaries() {
  const clock = useMicroClock();
  const lens = useRef<THREE.Group>(null);
  const curves = useMemo(
    () => CAPILLARY_PATHS.map((points) => new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))),
    [],
  );
  useFrame(() => {
    if (lens.current) lens.current.position.x = Math.sin(clock.current.time * 0.7) * 0.35;
  });
  return (
    <group rotation={[-0.35, 0, 0]}>
      {curves.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 48, 0.035, 8, false]} />
          <meshStandardMaterial color={PALETTE.coral} emissive={PALETTE.coral} emissiveIntensity={0.25} roughness={0.4} />
        </mesh>
      ))}
      <group ref={lens} position={[0, 0.1, 0.55]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 48]} />
          <ClinicalGlassMaterial opacity={0.35} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.43, 0.035, 12, 48]} />
          <HealthMaterial />
        </mesh>
      </group>
    </group>
  );
}

export const TREATMENT_OBJECTS: Record<TreatmentVariant, () => React.JSX.Element> = {
  "infiltraciones-ecoguiadas": GuidedInjection,
  "terapias-biologicas": FloatingAntibodies,
  viscosuplementacion: GelDrop,
  "terapia-fisica": FlexingJoint,
  "laboratorio-y-densitometria": ScannedBone,
  videocapilaroscopia: Capillaries,
};
