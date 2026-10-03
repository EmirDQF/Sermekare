"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronsLeftRight, Crosshair, EyeOff } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { homeImages } from "@/data/home";

const BENEFITS = [
  "La aguja llega al punto exacto: vemos tendones, líquido y cartílago en tiempo real.",
  "Menos pinchazos y menos molestias durante el procedimiento.",
  "Mejor respuesta al tratamiento al depositar el medicamento donde se necesita.",
  "Queda registro en imagen para tu seguimiento.",
] as const;

const INITIAL_POSITION = 50;

/** Comparador deslizable: infiltración a ciegas vs guiada por ecografía. */
export function GuidedVsBlind() {
  const id = useId();
  const [position, setPosition] = useState(INITIAL_POSITION);

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
            <div aria-hidden className="absolute inset-0 grid place-items-center">
              <Crosshair strokeWidth={1.25} className="size-24 text-teal drop-shadow-[0_0_12px_rgb(0_168_150/0.8)]" />
            </div>
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
              onChange={(e) => setPosition(Number(e.target.value))}
              aria-valuetext={`${position}% a ciegas, ${100 - position}% guiada`}
              className="absolute inset-0 size-full cursor-ew-resize opacity-0"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted">Desliza para comparar · Imagen referencial</p>
        </Reveal>

        <div>
          <SectionHeading
            id="guiada-title"
            align="left"
            eyebrow="Precisión que se siente"
            title="Infiltración guiada por ecografía vs a ciegas"
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
