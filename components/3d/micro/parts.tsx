"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { BioluminescentMaterial, ClinicalGlassMaterial } from "@/components/3d/materials";
import { cycle, useMicroClock } from "@/components/3d/micro/clock";
import { useSceneEnv } from "@/components/3d/scene-context";
import { themeColors } from "@/components/3d/palette";

/* Piezas compartidas por los objetos de Nivel 2. */

type GroupProps = ThreeElements["group"];

/** Teal "sano" emisivo según el tema. */
export function HealthMaterial(props: ThreeElements["meshStandardMaterial"]) {
  const { theme } = useSceneEnv();
  const color = themeColors(theme).health;
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.35} {...props} />;
}

/** Anticuerpo "Y": tallo y dos brazos de cristal con extremos bio-luminiscentes. */
export function Antibody(props: GroupProps) {
  const ARM_ANGLE = 0.62;
  return (
    <group {...props}>
      <mesh position={[0, -0.28, 0]}>
        <capsuleGeometry args={[0.07, 0.42, 6, 16]} />
        <ClinicalGlassMaterial opacity={0.55} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} rotation={[0, 0, side * -ARM_ANGLE]}>
          <mesh position={[0, 0.22, 0]}>
            <capsuleGeometry args={[0.065, 0.38, 6, 16]} />
            <ClinicalGlassMaterial opacity={0.55} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.085, 16, 12]} />
            <HealthMaterial />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Aguja: cuerpo metálico fino con punta cónica (eje +Y hacia la punta). */
export function Needle(props: GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.3, 12]} />
        <meshStandardMaterial color="#d6dde6" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.36, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.025, 0.12, 12]} />
        <meshStandardMaterial color="#d6dde6" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
        <ClinicalGlassMaterial opacity={0.6} />
      </mesh>
    </group>
  );
}

interface ExpandingRingsProps extends GroupProps {
  count?: number;
  speed?: number;
  radius?: number;
  /** Arco del anillo (2π = completo); los arcos parciales funcionan como ondas acústicas. */
  arc?: number;
}

/** Anillos que se expanden y se desvanecen (ondas, señal, pulsos). */
export function ExpandingRings({ count = 3, speed = 0.45, radius = 0.6, arc = Math.PI * 2, ...props }: ExpandingRingsProps) {
  const clock = useMicroClock();
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const { theme } = useSceneEnv();
  const color = themeColors(theme).health;

  useFrame(() => {
    const { time, energy } = clock.current;
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const phase = cycle(time, speed * (1 + energy * 0.8), index / count);
      mesh.scale.setScalar(0.35 + phase * 0.9);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * (0.5 + energy * 0.5);
    });
  });

  return (
    <group {...props}>
      {Array.from({ length: count }, (_, index) => (
        <mesh key={index} ref={(mesh) => { refs.current[index] = mesh; }}>
          <torusGeometry args={[radius, 0.018, 8, 64, arc]} />
          <meshBasicMaterial color={color} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Esfera bio-luminiscente (núcleo de articulaciones y moléculas). */
export function GlowBead(props: ThreeElements["mesh"] & { radius?: number }) {
  const { radius = 0.08, ...rest } = props;
  return (
    <mesh {...rest}>
      <sphereGeometry args={[radius, 16, 12]} />
      <BioluminescentMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.8} />
    </mesh>
  );
}
