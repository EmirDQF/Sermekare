"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ClinicalGlassMaterial } from "@/components/3d/materials";
import { cycle, useMicroClock } from "@/components/3d/micro/clock";
import { Antibody, ExpandingRings, GlowBead, HealthMaterial, Needle } from "@/components/3d/micro/parts";
import type { PillarVariant } from "@/lib/micro-variants";

/** Apoyo diagnóstico: transductor de ecografía emitiendo ondas. */
function Transducer() {
  return (
    <group rotation={[0, 0, 0.12]} position={[0, 0.25, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <capsuleGeometry args={[0.17, 0.5, 8, 20]} />
        <ClinicalGlassMaterial opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.12, 0]} scale={[1.5, 0.55, 0.9]}>
        <sphereGeometry args={[0.2, 24, 16]} />
        <HealthMaterial />
      </mesh>
      <ExpandingRings position={[0, -0.25, 0]} rotation={[0, 0, Math.PI + 0.5]} arc={Math.PI * 0.55} radius={0.45} />
    </group>
  );
}

const MOLECULES = 6;

/** Apoyo terapéutico: anticuerpo "Y" con moléculas en órbita. */
function AntibodyOrbit() {
  const clock = useMicroClock();
  const orbit = useRef<THREE.Group>(null);
  useFrame(() => {
    if (orbit.current) orbit.current.rotation.y = clock.current.time * (0.6 + clock.current.energy);
  });
  return (
    <group>
      <Antibody scale={1.15} />
      <group ref={orbit} rotation={[0.35, 0, 0.15]}>
        {Array.from({ length: MOLECULES }, (_, index) => {
          const angle = (index / MOLECULES) * Math.PI * 2;
          return <GlowBead key={index} radius={0.06} position={[Math.cos(angle) * 0.85, 0, Math.sin(angle) * 0.85]} />;
        })}
      </group>
    </group>
  );
}

/** Telemedicina: pantalla de cristal con anillos de señal. */
function SignalScreen() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.25, 0.82, 0.07]} />
        <ClinicalGlassMaterial opacity={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.08, 0.66]} />
        <meshStandardMaterial color="#0b192c" emissive="#00a896" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[0.08, 0.32]} />
        <HealthMaterial />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[0.32, 0.08]} />
        <HealthMaterial />
      </mesh>
      <ExpandingRings position={[0.62, 0.42, 0.05]} arc={Math.PI * 0.5} rotation={[0, 0, -0.2]} radius={0.28} />
      <mesh position={[0, -0.56, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 12]} />
        <ClinicalGlassMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}

/** Procedimientos: aguja guiada por un haz. */
function GuidedNeedle() {
  const clock = useMicroClock();
  const beam = useRef<THREE.Mesh>(null);
  const needle = useRef<THREE.Group>(null);
  useFrame(() => {
    const { time, energy } = clock.current;
    if (beam.current) {
      (beam.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + 0.12 * Math.sin(time * 3) + energy * 0.2;
    }
    if (needle.current) needle.current.position.y = 0.15 - cycle(time, 0.35) * 0.25 * (0.4 + energy);
  });
  return (
    <group rotation={[0, 0, 0.6]}>
      <mesh ref={beam} position={[0, -0.15, 0]}>
        <coneGeometry args={[0.32, 1.5, 32, 1, true]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={needle}>
        <Needle />
      </group>
      <GlowBead position={[0, -0.9, 0]} radius={0.09} />
    </group>
  );
}

/** Consulta externa: anillos entrelazados (paciente y especialista). */
function LinkedRings() {
  const clock = useMicroClock();
  const ring = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ring.current) ring.current.rotation.x = Math.PI / 2 + Math.sin(clock.current.time * 0.8) * 0.25;
  });
  return (
    <group rotation={[0.3, 0.4, 0]}>
      <mesh position={[-0.3, 0, 0]}>
        <torusGeometry args={[0.5, 0.09, 20, 64]} />
        <ClinicalGlassMaterial opacity={0.55} />
      </mesh>
      <group ref={ring} position={[0.3, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.09, 20, 64]} />
          <HealthMaterial />
        </mesh>
      </group>
    </group>
  );
}

export const PILLAR_OBJECTS: Record<PillarVariant, () => React.JSX.Element> = {
  "apoyo-diagnostico": Transducer,
  "apoyo-terapeutico": AntibodyOrbit,
  telemedicina: SignalScreen,
  procedimientos: GuidedNeedle,
  "consulta-externa": LinkedRings,
};
