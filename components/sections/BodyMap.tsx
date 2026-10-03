"use client";

import type { BodyZone, BodyZoneId } from "@/types/medical";
import { cn } from "@/lib/utils";

/** Posición de cada zona sobre la silueta (porcentaje del ancho/alto, viewBox 200×400). */
const HOTSPOTS: Record<BodyZoneId, { x: number; y: number }> = {
  cuello: { x: 50, y: 16.5 },
  hombros: { x: 31, y: 21.5 },
  espalda: { x: 50, y: 35 },
  manos: { x: 16, y: 53.5 },
  cadera: { x: 60, y: 50 },
  rodillas: { x: 40, y: 72.5 },
  pies: { x: 63, y: 95.5 },
};

const LIMBS = [
  "M62 90 L44 150 L34 205",
  "M138 90 L156 150 L166 205",
  "M84 205 L80 290 L78 370",
  "M116 205 L120 290 L122 370",
] as const;
const TORSO = "M62 78Q100 70 138 78L146 150Q140 196 132 210H68Q60 196 54 150Z";

function Silhouette({ outline }: { outline: boolean }) {
  const extra = outline ? 3 : 0;
  const color = outline ? "var(--joint-bone-stroke)" : "var(--joint-bone)";
  return (
    <g fill={color} stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="100" cy="38" r={24 + extra / 2} />
      <rect x={90 - extra / 2} y="56" width={20 + extra} height="24" rx="6" />
      <path d={TORSO} strokeWidth={extra} />
      {LIMBS.slice(0, 2).map((d) => (
        <path key={d} d={d} fill="none" strokeWidth={20 + extra} />
      ))}
      {LIMBS.slice(2).map((d) => (
        <path key={d} d={d} fill="none" strokeWidth={30 + extra} />
      ))}
      <circle cx="32" cy="214" r={11 + extra / 2} />
      <circle cx="168" cy="214" r={11 + extra / 2} />
      <ellipse cx="74" cy="382" rx={15 + extra / 2} ry={8 + extra / 2} />
      <ellipse cx="126" cy="382" rx={15 + extra / 2} ry={8 + extra / 2} />
    </g>
  );
}

interface BodyMapProps {
  zones: readonly BodyZone[];
  selected: BodyZoneId | null;
  onSelect: (id: BodyZoneId) => void;
}

/** Mapa corporal interactivo: silueta decorativa + botones accesibles (48 px) sobre cada zona. */
export function BodyMap({ zones, selected, onSelect }: BodyMapProps) {
  return (
    <div className="relative mx-auto aspect-[1/2] w-full max-w-[15rem]">
      <svg viewBox="0 0 200 400" aria-hidden className="absolute inset-0 size-full overflow-visible">
        <Silhouette outline />
        <Silhouette outline={false} />
      </svg>
      <ul className="absolute inset-0" aria-label="Zonas del cuerpo">
        {zones.map((zone) => {
          const { x, y } = HOTSPOTS[zone.id];
          const active = selected === zone.id;
          return (
            <li key={zone.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <button
                type="button"
                onClick={() => onSelect(zone.id)}
                aria-pressed={active}
                className="group relative grid size-12 place-items-center rounded-full"
              >
                <span className="sr-only">{zone.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute size-9 rounded-full transition-colors",
                    active ? "bg-teal/30" : "bg-coral/25 joint-pulse",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "relative size-4 rounded-full ring-4 ring-white transition-[background-color,transform] duration-300 group-hover:scale-125 dark:ring-navy",
                    active ? "scale-125 bg-teal" : "bg-coral",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-navy",
                    active && "opacity-100",
                  )}
                >
                  {zone.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
