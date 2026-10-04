"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { PerspectiveCamera, useCursor } from "@react-three/drei";
import { easing } from "maath";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GlowMaterial, HologramMaterial, type HologramUniforms } from "@/components/3d/materials";
import { useSceneActive, useSceneEnv } from "@/components/3d/scene-context";
import { PALETTE } from "@/components/3d/palette";
import type { SceneProps } from "@/components/3d/scene-types";
import {
  HOLOGRAM_BODY,
  HOLOGRAM_HEIGHT,
  HOLOGRAM_HOTSPOTS,
  HOLOGRAM_SPINE,
  type BodyPart,
  type Vec3,
} from "@/lib/hologram-anatomy";
import { createRandom } from "@/lib/prng";
import type { BodyZoneId } from "@/types/medical";

/* ---------- Geometría: figura fusionada en una sola malla (un draw call) ---------- */

function partGeometry({ shape }: BodyPart): THREE.BufferGeometry {
  if (shape.kind === "sphere") return new THREE.SphereGeometry(shape.radius, 32, 20);
  if (shape.kind === "capsule") return new THREE.CapsuleGeometry(shape.radius, shape.length, 8, 24);
  return new THREE.CylinderGeometry(shape.radiusTop, shape.radiusBottom, shape.height, 24);
}

const tmpMatrix = new THREE.Matrix4();
const tmpQuaternion = new THREE.Quaternion();
const tmpEuler = new THREE.Euler();
const tmpPosition = new THREE.Vector3();
const tmpScale = new THREE.Vector3();

function buildBodyGeometry(): THREE.BufferGeometry {
  const parts = HOLOGRAM_BODY.map((part) => {
    const geometry = partGeometry(part);
    tmpQuaternion.setFromEuler(tmpEuler.set(...(part.rotation ?? [0, 0, 0])));
    tmpMatrix.compose(tmpPosition.set(...part.position), tmpQuaternion, tmpScale.set(...(part.scale ?? [1, 1, 1])));
    return geometry.applyMatrix4(tmpMatrix);
  });
  const merged = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  return merged;
}

/* ---------- Malla de partículas sobre la superficie ---------- */

const POINT_BASE_COUNT = 2600;
const POINT_MIN_COUNT = 700;
const POINT_SEED = 2024;

type SeededSampler = MeshSurfaceSampler & { setRandomGenerator(random: () => number): MeshSurfaceSampler };

function sampleSurface(geometry: THREE.BufferGeometry, count: number): THREE.BufferGeometry {
  const random = createRandom(POINT_SEED);
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)) as SeededSampler;
  sampler.setRandomGenerator(random);
  sampler.build();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const point = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(point);
    positions.set([point.x, point.y, point.z], i * 3);
    phases[i] = random() * Math.PI * 2;
  }
  const cloud = new THREE.BufferGeometry();
  cloud.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  cloud.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  return cloud;
}

const POINTS_VERTEX = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  uniform float uScanY;
  varying float vAlpha;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * world;
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.0 + aPhase);
    float band = exp(-pow((world.y - uScanY) * 4.0, 2.0));
    vAlpha = twinkle * 0.55 + band * 0.9;
    gl_PointSize = uSize * (1.0 + band * 0.9) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const POINTS_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

/* ---------- Cámara, rotación y escaneo ---------- */

const FULL_VIEW_CAMERA: Vec3 = [0, 0, 8.5];
const ZOOM_DISTANCE = 6.6;
const ZOOM_PAN = 0.55;
const SWAY_IDLE = 0.35;
const SWAY_FOCUSED = 0.1;
const DRAG_LIMIT = 0.75;
const DRAG_SENSITIVITY = 0.006;
const DRAG_RELEASE_LAMBDA = 1.6;
const SCAN_AMPLITUDE = HOLOGRAM_HEIGHT / 2 + 0.1;
const STATIC_TIME = 1.4;
const POINT_SIZE = 26;

const tmpTarget = new THREE.Vector3();
const tmpCamera = new THREE.Vector3();
const tmpColor = new THREE.Color();
const tealColor = new THREE.Color(PALETTE.tealLight);
const coralColor = new THREE.Color(PALETTE.coralLight);

/** Arrastre horizontal limitado; al soltar, la figura vuelve sola a su oscilación. */
function useLimitedDrag() {
  const drag = useRef({ active: false, startX: 0, startOffset: 0, offset: 0 });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    const state = drag.current;
    state.active = true;
    state.startX = event.nativeEvent.clientX;
    state.startOffset = state.offset;
    const handleMove = (move: PointerEvent) => {
      const next = state.startOffset + (move.clientX - state.startX) * DRAG_SENSITIVITY;
      state.offset = THREE.MathUtils.clamp(next, -DRAG_LIMIT, DRAG_LIMIT);
    };
    const handleUp = () => {
      state.active = false;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  }

  /** Avanza un frame: al soltar, el desplazamiento vuelve a 0 con amortiguación. Devuelve el giro extra. */
  function step(delta: number): number {
    const state = drag.current;
    if (!state.active) state.offset = THREE.MathUtils.damp(state.offset, 0, DRAG_RELEASE_LAMBDA, delta);
    return state.offset;
  }

  return { handlePointerDown, step };
}

/* ---------- Hotspot palpitante ---------- */

interface HotspotProps {
  zone: BodyZoneId;
  position: Vec3;
  selected: boolean;
  dimmed: boolean;
  hovered: boolean;
  flash: { current: number };
  reducedMotion: boolean;
  onHover: (zone: BodyZoneId | null) => void;
  onSelect: (zone: BodyZoneId) => void;
}

const HOTSPOT_HIT_RADIUS = 0.17;

function Hotspot({ zone, position, selected, dimmed, hovered, flash, reducedMotion, onHover, onSelect }: HotspotProps) {
  const coreRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const ringRef = useRef<THREE.Sprite>(null);
  const time = useRef(0);
  const offset = (position[1] + 2) * 0.7;

  useFrame((_, delta) => {
    if (!reducedMotion) time.current += Math.min(delta, 0.1);
    const t = time.current + offset;
    const emphasis = hovered ? 1.45 : selected ? 1.25 : 1;
    if (selected) tmpColor.copy(tealColor).lerp(coralColor, flash.current);
    else tmpColor.copy(coralColor);
    const opacity = dimmed && !hovered ? 0.4 : 1;

    if (coreRef.current) {
      coreRef.current.color.copy(tmpColor);
      coreRef.current.opacity = opacity;
    }
    const glow = glowRef.current;
    if (glow) {
      const breathe = reducedMotion ? 1 : 1 + Math.sin(t * 3) * 0.12;
      glow.scale.setScalar(0.42 * emphasis * breathe);
      const material = glow.material as THREE.SpriteMaterial;
      material.color.copy(tmpColor);
      material.opacity = 0.85 * opacity;
    }
    const ring = ringRef.current;
    if (ring) {
      const cycle = reducedMotion ? 0.35 : (t * 0.6) % 1;
      ring.scale.setScalar((0.2 + cycle * 0.4) * emphasis);
      const material = ring.material as THREE.SpriteMaterial;
      material.color.copy(tmpColor);
      material.opacity = (1 - cycle) * 0.9 * opacity;
    }
  });

  return (
    <group position={position as [number, number, number]}>
      <mesh>
        <sphereGeometry args={[0.045, 16, 12]} />
        <meshBasicMaterial ref={coreRef} toneMapped={false} transparent />
      </mesh>
      <sprite ref={glowRef}>
        <GlowMaterial />
      </sprite>
      <sprite ref={ringRef}>
        <GlowMaterial variant="ring" />
      </sprite>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(zone);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(zone);
        }}
      >
        <sphereGeometry args={[HOTSPOT_HIT_RADIUS, 12, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- Escena ---------- */

/**
 * Triage: figura holográfica (fresnel + líneas de escaneo) con una malla de partículas
 * y hotspots en exactamente las zonas de data/bodyZones.ts. Hover: el punto crece;
 * clic: micro-zoom de cámara, destello coral que se calma a teal.
 */
export default function BodyHologram3D({ selected, onSelect, onHover }: SceneProps["hologram"]) {
  const { settings, reducedMotion } = useSceneEnv();
  const active = useSceneActive();
  const invalidate = useThree((state) => state.invalidate);
  const dpr = useThree((state) => state.viewport.dpr);

  const bodyGeometry = useMemo(() => buildBodyGeometry(), []);
  const pointCount = Math.max(POINT_MIN_COUNT, Math.round(POINT_BASE_COUNT * settings.particleScale));
  const cloudGeometry = useMemo(() => sampleSurface(bodyGeometry, pointCount), [bodyGeometry, pointCount]);
  useEffect(() => () => bodyGeometry.dispose(), [bodyGeometry]);
  useEffect(() => () => cloudGeometry.dispose(), [cloudGeometry]);

  const pointUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: POINT_SIZE },
      uScanY: { value: 0 },
      uColor: { value: new THREE.Color(PALETTE.cyan) },
    }),
    [],
  );

  const [hovered, setHovered] = useState<BodyZoneId | null>(null);
  useCursor(hovered !== null);

  const flash = useRef(0);
  useEffect(() => {
    if (selected) flash.current = 1;
    invalidate();
  }, [selected, invalidate]);

  const { handlePointerDown, step: stepDrag } = useLimitedDrag();
  const figureRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lookAt = useRef(new THREE.Vector3());
  const time = useRef(0);

  useLayoutEffect(() => {
    cameraRef.current?.lookAt(0, 0, 0);
  }, []);

  function handleHover(zone: BodyZoneId | null) {
    setHovered(zone);
    onHover?.(zone);
    invalidate();
  }

  useFrame((_, rawDelta) => {
    if (!active) return;
    const delta = Math.min(rawDelta, 0.1);
    time.current = reducedMotion ? STATIC_TIME : time.current + delta;
    const t = time.current;
    flash.current = reducedMotion ? 0 : Math.max(0, flash.current - delta * 1.1);

    const figure = figureRef.current;
    const dragOffset = stepDrag(delta);
    if (figure) {
      const swayAmplitude = (selected ? SWAY_FOCUSED : SWAY_IDLE) * settings.rotationSpeed;
      const sway = reducedMotion ? 0 : Math.sin(t * 0.25) * swayAmplitude;
      figure.rotation.y = sway + dragOffset;
    }

    const scanY = Math.sin(t * 0.45) * SCAN_AMPLITUDE;
    const body = bodyRef.current;
    if (body) {
      const uniforms = (body.material as THREE.ShaderMaterial).uniforms as HologramUniforms;
      uniforms.uTime.value = t;
      uniforms.uScanY.value = scanY;
    }
    const points = pointsRef.current;
    if (points) {
      const uniforms = (points.material as THREE.ShaderMaterial).uniforms;
      uniforms.uTime.value = t;
      uniforms.uScanY.value = scanY;
      uniforms.uSize.value = POINT_SIZE * dpr;
    }
    if (scanRingRef.current) scanRingRef.current.position.y = scanY;

    const camera = cameraRef.current;
    if (!camera || !figure) return;
    if (selected) {
      figure.localToWorld(tmpTarget.set(...HOLOGRAM_HOTSPOTS[selected])).multiplyScalar(ZOOM_PAN);
      tmpCamera.set(tmpTarget.x, tmpTarget.y, ZOOM_DISTANCE);
    } else {
      tmpTarget.set(0, 0, 0);
      tmpCamera.set(...FULL_VIEW_CAMERA);
    }
    if (reducedMotion) {
      camera.position.copy(tmpCamera);
      lookAt.current.copy(tmpTarget);
    } else {
      easing.damp3(camera.position, tmpCamera, 0.55, delta);
      easing.damp3(lookAt.current, tmpTarget, 0.45, delta);
    }
    camera.lookAt(lookAt.current);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={FULL_VIEW_CAMERA as [number, number, number]} fov={28} />

      {/* Plano invisible para el arrastre (detrás de la figura) */}
      <mesh position={[0, 0, -2]} onPointerDown={handlePointerDown}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={figureRef}>
        <mesh ref={bodyRef} geometry={bodyGeometry}>
          <HologramMaterial color={PALETTE.teal} rimColor={PALETTE.cyan} opacity={0.9} />
        </mesh>
        <points ref={pointsRef} geometry={cloudGeometry}>
          <shaderMaterial
            vertexShader={POINTS_VERTEX}
            fragmentShader={POINTS_FRAGMENT}
            uniforms={pointUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
        <Spine />
        {(Object.entries(HOLOGRAM_HOTSPOTS) as [BodyZoneId, Vec3][]).map(([zone, position]) => (
          <Hotspot
            key={zone}
            zone={zone}
            position={position}
            selected={selected === zone}
            dimmed={selected !== null && selected !== zone}
            hovered={hovered === zone}
            flash={flash}
            reducedMotion={reducedMotion}
            onHover={handleHover}
            onSelect={onSelect}
          />
        ))}
      </group>

      {/* Anillo de escaneo y plataforma del proyector */}
      <mesh ref={scanRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.66, 0.7, 64]} />
        <meshBasicMaterial color={PALETTE.cyan} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <ProjectorBase />
    </>
  );
}

/** Columna vertebral visible a través del holograma (efecto rayos X). */
function Spine() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { from, to, z, vertebrae } = HOLOGRAM_SPINE;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const step = (to - from) / (vertebrae - 1);
    for (let i = 0; i < vertebrae; i++) {
      const lumbar = 1 - i / vertebrae;
      dummy.position.set(0, from + i * step, z);
      dummy.scale.set(1 + lumbar * 0.5, 1, 1 + lumbar * 0.3);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [from, to, z, vertebrae]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, vertebrae]}>
      <cylinderGeometry args={[0.042, 0.046, 0.05, 12]} />
      <meshBasicMaterial color={PALETTE.tealLight} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

const BASE_Y = -HOLOGRAM_HEIGHT / 2 - 0.04;

function ProjectorBase() {
  return (
    <group position={[0, BASE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[0.95, 48]} />
        <meshBasicMaterial color={PALETTE.teal} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.56, 0.585, 64]} />
        <meshBasicMaterial color={PALETTE.tealLight} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.86, 0.872, 64]} />
        <meshBasicMaterial color={PALETTE.cyan} transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
