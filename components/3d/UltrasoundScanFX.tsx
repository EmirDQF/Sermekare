"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useSceneActive, useSceneEnv } from "@/components/3d/scene-context";
import { PALETTE } from "@/components/3d/palette";
import { ULTRASOUND_TARGET, type SceneProps } from "@/components/3d/scene-types";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uSplit;
  uniform float uAspect;
  uniform float uGrain;
  uniform vec2 uTarget;
  uniform vec3 uTeal;
  uniform vec3 uCoral;
  varying vec2 vUv;

  const float HALF_ANGLE = 0.62;
  const vec3 WHITE = vec3(1.0);
  const vec3 NAVY = vec3(0.0033, 0.0097, 0.025);
  const float LINE = 0.0042;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float segment(vec2 p, vec2 a, vec2 b, out float h) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void over(inout vec4 acc, vec3 color, float alpha) {
    alpha = clamp(alpha, 0.0, 1.0);
    acc.rgb = color * alpha + acc.rgb * (1.0 - alpha);
    acc.a = alpha + acc.a * (1.0 - alpha);
  }

  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);
    vec4 acc = vec4(0.0);
    float guided = smoothstep(uSplit - 0.004, uSplit + 0.004, vUv.x);
    float blind = 1.0 - guided;
    float labelFade = smoothstep(0.1, 0.22, vUv.y);
    vec2 target = vec2(uTarget.x * uAspect, uTarget.y);
    float h;

    /* ---------- Guiada por ecografía ---------- */
    if (guided > 0.0) {
      vec2 apex = vec2(0.5 * uAspect, 1.04);
      vec2 d = p - apex;
      float r = length(d);
      float theta = atan(d.x, -d.y);
      float radial = smoothstep(1.0, 0.96, r) * smoothstep(0.06, 0.1, r);
      float inside = smoothstep(HALF_ANGLE + 0.01, HALF_ANGLE - 0.01, abs(theta)) * radial;
      float g = guided * labelFade;

      // Ventana de ecografía: oscurece la foto y le da textura de speckle para que el haz destaque.
      over(acc, NAVY, inside * 0.5 * g);
      float speckle = hash(floor(p * 210.0) + floor(uTime * 9.0));
      over(acc, mix(uTeal, WHITE, 0.5), speckle * speckle * inside * 0.16 * uGrain * g);
      float edge = smoothstep(LINE, 0.0, abs(abs(theta) - HALF_ANGLE) * r) * radial;
      over(acc, uTeal, edge * 0.75 * g);
      float ringDist = abs(fract(r * 5.0 + 0.5) - 0.5) / 5.0;
      over(acc, uTeal, smoothstep(0.003, 0.0, ringDist) * inside * 0.28 * g);

      float sweepAngle = HALF_ANGLE * 0.92 * sin(uTime * 0.9);
      float sweep = abs(theta - sweepAngle) * r;
      over(acc, uTeal, exp(-sweep * 30.0) * inside * 0.32 * g);
      over(acc, WHITE, smoothstep(LINE, 0.0, sweep) * inside * 0.7 * g);

      for (int k = 0; k < 3; k++) {
        float rp = fract(uTime * 0.32 + float(k) / 3.0);
        float pulse = smoothstep(0.01, 0.0, abs(r - rp)) * (1.0 - rp);
        over(acc, uTeal, pulse * inside * 0.7 * g);
      }

      vec2 entry = vec2(0.97 * uAspect, 0.92);
      float cycle = fract(uTime / 5.0);
      float advance = smoothstep(0.05, 0.45, cycle);
      float locked = smoothstep(0.45, 0.5, cycle) * (1.0 - smoothstep(0.9, 1.0, cycle));
      float shown = 1.0 - smoothstep(0.9, 1.0, cycle);
      vec2 tip = mix(entry, target, advance);

      float plan = segment(p, entry, target, h);
      float dash = step(0.5, fract(h * 28.0 - uTime * 0.8));
      over(acc, uTeal, smoothstep(LINE, 0.0, plan) * dash * 0.55 * guided);
      float needle = segment(p, entry, tip, h);
      over(acc, uTeal, smoothstep(LINE * 3.0, 0.0, needle) * 0.35 * shown * guided);
      over(acc, WHITE, smoothstep(LINE, 0.0, needle) * 0.95 * shown * guided);
      over(acc, uTeal, exp(-length(p - tip) * 55.0) * 0.9 * shown * guided);

      float rt = length(p - target);
      float lockBoost = 0.5 + locked * 0.5;
      over(acc, uTeal, smoothstep(LINE, 0.0, abs(rt - 0.05)) * lockBoost * guided);
      float cross = min(abs(p.x - target.x), abs(p.y - target.y));
      float ticks = step(0.065, rt) * step(rt, 0.1);
      over(acc, uTeal, smoothstep(LINE, 0.0, cross) * ticks * lockBoost * guided);
      float lockPhase = fract(uTime * 1.2);
      float lockRing = smoothstep(0.004, 0.0, abs(rt - (0.05 + lockPhase * 0.07))) * locked * (1.0 - lockPhase);
      over(acc, WHITE, lockRing * 0.75 * guided);
    }

    /* ---------- A ciegas ---------- */
    if (blind > 0.0) {
      float grain = hash(floor(p * 260.0) + floor(uTime * 14.0));
      over(acc, vec3(0.78), grain * 0.16 * uGrain * blind);
      float bands = smoothstep(0.985, 1.0, sin(vUv.y * 90.0 + uTime * 5.0));
      over(acc, vec3(0.85), bands * 0.07 * blind);

      vec2 entry = vec2(0.03 * uAspect, 0.9);
      vec2 guess = vec2(0.34 * uAspect + sin(uTime * 1.3) * 0.06, 0.44 + cos(uTime * 1.7) * 0.07);
      for (int k = 0; k < 3; k++) {
        float lag = float(k) * 0.18;
        vec2 ghost = vec2(0.34 * uAspect + sin((uTime - lag) * 1.3) * 0.06, 0.44 + cos((uTime - lag) * 1.7) * 0.07);
        float dist = segment(p, entry, ghost, h);
        float strength = k == 0 ? 0.85 : 0.22;
        over(acc, uCoral, smoothstep(LINE, 0.0, dist) * strength * blind * labelFade);
      }
      float rg = length(p - guess);
      float dashed = step(0.5, fract(atan(p.y - guess.y, p.x - guess.x) * 1.9));
      over(acc, uCoral, smoothstep(0.004, 0.0, abs(rg - 0.08)) * dashed * 0.65 * blind);
    }

    // La telemetría del DOM (esquinas superiores) queda debajo del lienzo: no dibujar encima.
    float hudRight = smoothstep(0.64, 0.68, vUv.x) * smoothstep(0.66, 0.7, vUv.y);
    float hudLeft = (1.0 - smoothstep(0.38, 0.42, vUv.x)) * smoothstep(0.8, 0.84, vUv.y);
    acc *= 1.0 - max(hudRight, hudLeft);

    gl_FragColor = vec4(acc.rgb / max(acc.a, 1e-4), acc.a);
    #include <colorspace_fragment>
  }
`;

const SPLIT_LAMBDA = 14;
/** Momento con la aguja ya fijada en la mira (pose estática con movimiento reducido). */
const STATIC_TIME = 3.5;

/**
 * Capa de efectos sobre el comparador "guiada vs a ciegas": abanico de ultrasonido con barrido,
 * pulsos acústicos y aguja que se fija en la mira (lado guiado); ruido y aguja errática (lado a ciegas).
 * Es decorativa: el comparador y su slider accesible siguen en el DOM.
 */
export default function UltrasoundScanFX({ split }: SceneProps["ultrasound"]) {
  const { reducedMotion, tier } = useSceneEnv();
  const active = useSceneActive();
  const size = useThree((state) => state.size);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const state = useRef({ time: 0, split: split.get() });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSplit: { value: 0.5 },
      uAspect: { value: 4 / 3 },
      uGrain: { value: 1 },
      uTarget: { value: new THREE.Vector2(ULTRASOUND_TARGET.x, ULTRASOUND_TARGET.y) },
      uTeal: { value: new THREE.Color(PALETTE.tealLight) },
      uCoral: { value: new THREE.Color(PALETTE.coralLight) },
    }),
    [],
  );

  useFrame((_, rawDelta) => {
    if (!active) return;
    const delta = Math.min(rawDelta, 0.1);
    const s = state.current;
    s.time = reducedMotion ? STATIC_TIME : s.time + delta;
    s.split = reducedMotion ? split.get() : THREE.MathUtils.damp(s.split, split.get(), SPLIT_LAMBDA, delta);
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = s.time;
    material.uniforms.uSplit.value = s.split;
    material.uniforms.uAspect.value = size.width / Math.max(1, size.height);
    material.uniforms.uGrain.value = tier === "mobile" ? 0.6 : 1;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}
