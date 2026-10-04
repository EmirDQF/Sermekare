"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValue } from "motion/react";
import { ArrowRight, Check, ChevronsLeftRight, Crosshair, EyeOff } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import { ULTRASOUND_TARGET } from "@/components/3d/scene-types";
import { homeImages } from "@/data/home";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "La aguja llega al punto exacto: vemos tendones, líquido y cartílago en tiempo real.",
  "Menos pinchazos y menos molestias durante el procedimiento.",
  "Mejor respuesta al tratamiento al depositar el medicamento donde se necesita.",
  "Queda registro en imagen para tu seguimiento.",
] as const;

const INITIAL_POSITION = 50;
/** Por encima/debajo de estos valores la telemetría de cada lado queda tapada por el otro. */
const GUIDED_HUD_MAX_POSITION = 62;
const BLIND_HUD_MIN_POSITION = 38;

const TELEMETRY = ["Depth: 24 mm", "Freq: 12 MHz", "Ángulo: 41°", "Precisión ±1 mm"] as const;

/** Mira estática (sin WebGL o mientras carga el efecto 3D). */
function TargetFallback() {
  return (
    <div
      aria-hidden
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${ULTRASOUND_TARGET.x * 100}%`, top: `${(1 - ULTRASOUND_TARGET.y) * 100}%` }}
    >
      <Crosshair strokeWidth={1.25} className="size-20 text-teal drop-shadow-[0_0_12px_rgb(0_168_150/0.8)] sm:size-24" />
    </div>
  );
}

interface HudProps {
  position: number;
}

/** Telemetría médica decorativa (monoespaciada) de cada lado del comparador. */
function ScanHud({ position }: HudProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 font-mono text-[0.7rem] leading-relaxed sm:inset-x-4 sm:top-4 sm:text-xs">
      <span
        className={cn(
          "rounded-lg bg-navy/75 px-2.5 py-1.5 font-semibold uppercase tracking-wider text-coral backdrop-blur-sm transition-opacity duration-300",
          position < BLIND_HUD_MIN_POSITION && "opacity-0",
        )}
      >
        Sin guía de imagen
      </span>
      <span
        className={cn(
          "grid rounded-lg bg-navy/75 px-2.5 py-1.5 text-right text-teal-200 backdrop-blur-sm transition-opacity duration-300",
          position > GUIDED_HUD_MAX_POSITION && "opacity-0",
        )}
      >
        {TELEMETRY.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
    </div>
  );
}

/** Comparador deslizable: infiltración a ciegas vs guiada por ecografía. */
export function GuidedVsBlind() {
  const id = useId();
  const [position, setPosition] = useState(INITIAL_POSITION);
  const split = useMotionValue(INITIAL_POSITION / 100);
  const ultrasoundProps = useMemo(() => ({ split }), [split]);

  function handlePositionChange(next: number) {
    setPosition(next);
    split.set(next / 100);
  }

  return (
    <section aria-labelledby="guiada-title" className="section-y bg-bg-alt">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] select-none overflow-hidden rounded-[2rem] shadow-lift">
            {/* Guiada por ecografía (capa base) */}
            <Image
              src={homeImages.guided}
              alt={homeImages.guidedAlt}
              fill
              sizes="(min-width: 1024px) 600px, 92vw"
              className="object-cover"
            />
            {/* Efecto 3D: abanico de ultrasonido, aguja guiada y ruido del lado a ciegas */}
            <Scene3DSlot
              scene="ultrasound"
              sceneProps={ultrasoundProps}
              className="pointer-events-none absolute inset-0"
              fallback={<TargetFallback />}
            />
            <span className="glass absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-heading">
              <Crosshair aria-hidden className="size-4 text-primary" /> Guiada por ecografía
            </span>

            {/* A ciegas (capa recortada) */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={homeImages.guided}
                alt=""
                fill
                sizes="(min-width: 1024px) 600px, 92vw"
                className="scale-105 object-cover blur-md grayscale"
              />
              <div className="absolute inset-0 bg-navy/55" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-sm font-semibold text-white">
                <EyeOff aria-hidden className="size-4 text-coral" /> A ciegas
              </span>
            </div>

            <ScanHud position={position} />

            {/* Divisor */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${position}%` }}>
              <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-lift">
                <ChevronsLeftRight className="size-6" />
              </span>
            </div>

            <label htmlFor={`${id}-range`} className="sr-only">
              Desliza para comparar una infiltración a ciegas con una guiada por ecografía
            </label>
            <input
              id={`${id}-range`}
              type="range"
              min={0}
              max={100}
              value={position}
              onChange={(e) => handlePositionChange(Number(e.target.value))}
              aria-valuetext={`${position}% a ciegas, ${100 - position}% guiada`}
              className="absolute inset-0 size-full cursor-ew-resize opacity-0"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted">Desliza para comparar · Imagen referencial · Simulación ilustrativa</p>
        </Reveal>

        <div>
          <SectionHeading
            id="guiada-title"
            align="left"
            eyebrow="Precisión que se siente"
            title="Infiltración guiada por ecografía vs a ciegas"
            accent="guiada por ecografía"
            description="En una infiltración a ciegas, el médico se guía solo por referencias externas. Con ecografía, vemos el interior de la articulación mientras aplicamos el tratamiento."
          />
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-tint text-primary">
                  <Check aria-hidden strokeWidth={2.25} className="size-4" />
                </span>
                <span className="text-fg">{benefit}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/tratamientos/infiltraciones-ecoguiadas"
            className="mt-8 inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Conoce las infiltraciones ecoguiadas <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
