"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import {
  BioluminescentMaterial,
  BoneMaterial,
  ClinicalGlassMaterial,
  GlowMaterial,
  applyHealing,
} from "@/components/3d/materials";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { useSceneActive, useSceneEnv } from "@/components/3d/scene-context";
import { PALETTE, themeColors } from "@/components/3d/palette";
import { useWindowPointer } from "@/components/3d/pointer";
import type { SceneProps } from "@/components/3d/scene-types";
import { createRandom } from "@/lib/prng";

/* ---------- Anatomía procedural (perfiles de torno: [radio, altura]) ---------- */

type Profile = readonly (readonly [radius: number, y: number])[];

const FEMUR_PROFILE: Profile = [
  [0, 0.1], [0.3, 0.12], [0.46, 0.18], [0.54, 0.28], [0.55, 0.4], [0.5, 0.52], [0.4, 0.62],
  [0.3, 0.74], [0.25, 0.9], [0.23, 1.1], [0.235, 1.25], [0.21, 1.33], [0.12, 1.38], [0, 1.39],
];
const TIBIA_PROFILE: Profile = [
  [0, -1.36], [0.1, -1.35], [0.19, -1.3], [0.21, -1.2], [0.21, -0.95], [0.24, -0.72], [0.3, -0.56],
  [0.4, -0.42], [0.5, -0.3], [0.53, -0.2], [0.5, -0.13], [0.36, -0.1], [0, -0.1],
];

function toPoints(profile: Profile): THREE.Vector2[] {
  return profile.map(([radius, y]) => new THREE.Vector2(radius, y));
}

/* ---------- Partículas de inflamación → órbita serena ---------- */

const PARTICLE_BASE_COUNT = 130;
const PARTICLE_MIN_COUNT = 36;
const PARTICLE_SEED = 1337;
const PARTICLE_SIZE = 0.024;
const ORBIT_RADIUS = 1.12;

interface ParticleSeeds {
  count: number;
  /** Posición caótica alrededor de la articulación (xyz por partícula). */
  chaos: Float32Array;
  /** Fase, velocidad, ángulo de órbita y retraso de curación por partícula. */
  phase: Float32Array;
  speed: Float32Array;
  orbitAngle: Float32Array;
  stagger: Float32Array;
}

function buildParticleSeeds(count: number): ParticleSeeds {
  const random = createRandom(PARTICLE_SEED);
  const seeds: ParticleSeeds = {
    count,
    chaos: new Float32Array(count * 3),
    phase: new Float32Array(count),
    speed: new Float32Array(count),
    orbitAngle: new Float32Array(count),
    stagger: new Float32Array(count),
  };
  for (let i = 0; i < count; i++) {
    const radius = 0.7 + random() * 0.7;
    const theta = random() * Math.PI * 2;
    seeds.chaos.set([Math.cos(theta) * radius, (random() - 0.5) * 1.4, Math.sin(theta) * radius], i * 3);
    seeds.phase[i] = random() * Math.PI * 2;
    seeds.speed[i] = 0.6 + random() * 0.9;
    seeds.orbitAngle[i] = (i / count) * Math.PI * 2;
    seeds.stagger[i] = random();
  }
  return seeds;
}

/* ---------- Narrativa: del dolor (coral) al alivio (teal) ---------- */

const SCROLL_HEAL_GAIN = 1.8;
const POINTER_HEAL_GAIN = 0.9;
const HEAL_LAMBDA = 1.4;
const ROTATION_LAMBDA = 3;
const BASE_ROTATION_Y = -0.55;
const STATIC_TIME = 2.2;

const dummy = new THREE.Object3D();
const tmpChaos = new THREE.Vector3();
const tmpOrbit = new THREE.Vector3();
const tmpColor = new THREE.Color();
const tmpColorB = new THREE.Color();

function smoothstep(value: number): number {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Hero: rodilla procedural (fémur, tibia, rótula y peroné por torno) dentro de una cápsula
 * articular de cristal clínico. Al cargar, el cartílago late en coral rodeado de partículas
 * de inflamación; con el scroll y el movimiento del mouse se "cura" hacia un teal sereno.
 */
export default function JointViewer3D({ progress }: SceneProps["joint"]) {
  const { settings, reducedMotion, theme, finePointer } = useSceneEnv();
  const active = useSceneActive();
  const colors = themeColors(theme);
  // El brillo aditivo no se ve sobre fondos claros (y blanquea lo que tapa): en modo claro, mezcla normal.
  const haloBlending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
  const pointer = useWindowPointer(finePointer && !reducedMotion);

  const femurPoints = useMemo(() => toPoints(FEMUR_PROFILE), []);
  const tibiaPoints = useMemo(() => toPoints(TIBIA_PROFILE), []);
  const particleCount = Math.max(PARTICLE_MIN_COUNT, Math.round(PARTICLE_BASE_COUNT * settings.particleScale));
  const seeds = useMemo(() => buildParticleSeeds(particleCount), [particleCount]);

  const rigRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const meniscusRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreRef = useRef<THREE.MeshStandardMaterial>(null);
  const haloRef = useRef<THREE.SpriteMaterial>(null);
  const inflammationLightRef = useRef<THREE.PointLight>(null);
  const story = useRef({ time: 0, healing: 0, target: 0, intro: 0 });

  useFrame((_, rawDelta) => {
    if (!active) return;
    const delta = Math.min(rawDelta, 0.1);
    const s = story.current;
    if (reducedMotion) {
      s.time = STATIC_TIME;
      s.healing = 1;
      s.intro = 1;
    } else {
      s.time += delta;
      const scroll = progress?.get() ?? 0;
      s.target = Math.max(s.target, Math.min(1, scroll * SCROLL_HEAL_GAIN), Math.min(1, pointer.current.travel * POINTER_HEAL_GAIN));
      s.healing = THREE.MathUtils.damp(s.healing, s.target, HEAL_LAMBDA, delta);
      s.intro = THREE.MathUtils.damp(s.intro, 1, 2.4, delta);
    }
    const { time, healing } = s;

    const rig = rigRef.current;
    if (rig) {
      const scroll = progress?.get() ?? 0;
      const sway = reducedMotion ? 0 : Math.sin(time * 0.3) * 0.22 * settings.rotationSpeed;
      const follow = finePointer ? pointer.current.x * 0.55 : scroll * 1.1;
      const targetY = BASE_ROTATION_Y + sway + (reducedMotion ? 0 : follow);
      const targetX = 0.08 + (finePointer && !reducedMotion ? pointer.current.y * 0.16 : 0);
      rig.rotation.y = reducedMotion ? targetY : THREE.MathUtils.damp(rig.rotation.y, targetY, ROTATION_LAMBDA, delta);
      rig.rotation.x = reducedMotion ? targetX : THREE.MathUtils.damp(rig.rotation.x, targetX, ROTATION_LAMBDA, delta);
      rig.scale.setScalar(0.86 + 0.14 * s.intro);
      rig.position.y = reducedMotion ? 0 : Math.sin(time * 0.8) * 0.04;
    }

    const pulse = 0.5 + 0.5 * Math.sin(time * (3.2 - healing * 1.6));
    if (meniscusRef.current) applyHealing(meniscusRef.current, healing, pulse, colors);
    if (coreRef.current) applyHealing(coreRef.current, healing, pulse, colors);
    if (haloRef.current) {
      tmpColor.set(colors.inflammation).lerp(tmpColorB.set(colors.health), healing);
      haloRef.current.color.copy(tmpColor);
      const haloStrength = theme === "dark" ? 1 : 0.55;
      haloRef.current.opacity = THREE.MathUtils.lerp(0.5 + pulse * 0.3, 0.32, healing) * haloStrength;
    }
    if (inflammationLightRef.current) inflammationLightRef.current.intensity = (1 - healing) * (0.7 + pulse * 0.8);

    const particles = particlesRef.current;
    if (!particles) return;
    for (let i = 0; i < seeds.count; i++) {
      const phase = seeds.phase[i];
      const speed = seeds.speed[i];
      const local = smoothstep(healing * 1.35 - seeds.stagger[i] * 0.35);
      tmpChaos.set(
        seeds.chaos[i * 3] + Math.sin(time * speed + phase) * 0.09,
        seeds.chaos[i * 3 + 1] + Math.cos(time * speed * 0.8 + phase) * 0.11,
        seeds.chaos[i * 3 + 2] + Math.sin(time * speed * 1.2 + phase * 2) * 0.09,
      );
      const angle = seeds.orbitAngle[i] + time * 0.22 * settings.rotationSpeed;
      tmpOrbit.set(Math.cos(angle) * ORBIT_RADIUS, Math.sin(angle * 3 + time * 0.6) * 0.035, Math.sin(angle) * ORBIT_RADIUS);
      dummy.position.copy(tmpChaos).lerp(tmpOrbit, local);
      const inflamedScale = 1 + 0.55 * Math.sin(time * 3 + phase);
      dummy.scale.setScalar(PARTICLE_SIZE * THREE.MathUtils.lerp(inflamedScale, 0.7, local));
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    const particleMaterial = particles.material as THREE.MeshBasicMaterial;
    particleMaterial.color.set(colors.inflammation).lerp(tmpColorB.set(colors.health), healing);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.05, 6]} fov={30} />
      <SceneLighting />
      <pointLight ref={inflammationLightRef} position={[0.3, 0, 0.9]} distance={2.2} color={PALETTE.coral} />

      <group ref={rigRef} rotation={[0.08, BASE_ROTATION_Y, 0]} scale={0.86}>
        {/* Huesos */}
        <mesh scale={[1.15, 1, 0.92]}>
          <latheGeometry args={[femurPoints, 64]} />
          <BoneMaterial />
        </mesh>
        <mesh scale={[1.12, 1, 0.9]}>
          <latheGeometry args={[tibiaPoints, 64]} />
          <BoneMaterial />
        </mesh>
        <mesh position={[0, 0.36, 0.52]} scale={[1, 1.2, 0.55]}>
          <sphereGeometry args={[0.2, 32, 24]} />
          <BoneMaterial />
        </mesh>
        <mesh position={[0.47, -0.85, -0.12]} rotation={[0, 0, 0.05]}>
          <capsuleGeometry args={[0.06, 0.8, 8, 16]} />
          <BoneMaterial />
        </mesh>

        {/* Cartílago / menisco y núcleo sinovial bio-luminiscentes */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 0.95, 0.7]}>
          <torusGeometry args={[0.42, 0.07, 16, 64]} />
          <BioluminescentMaterial ref={meniscusRef} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 48]} />
          <BioluminescentMaterial ref={coreRef} opacity={0.75} />
        </mesh>
        <sprite scale={2.6}>
          <GlowMaterial ref={haloRef} opacity={0.5} blending={haloBlending} />
        </sprite>

        {/* Cápsula articular de cristal clínico */}
        <mesh scale={[1, 0.62, 1]}>
          <sphereGeometry args={[0.8, 48, 32]} />
          <ClinicalGlassMaterial />
        </mesh>

        {/* Partículas: caos inflamatorio → órbita serena */}
        <group rotation={[0.32, 0, 0.12]}>
          <instancedMesh ref={particlesRef} args={[undefined, undefined, seeds.count]} frustumCulled={false}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial toneMapped={false} transparent opacity={0.9} blending={haloBlending} depthWrite={false} />
          </instancedMesh>
        </group>
      </group>
    </>
  );
}
