"use client";

import { useEffect, useMemo } from "react";
import { animate, useMotionValue } from "motion/react";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import { JointMotif } from "@/components/shared/JointMotif";
import { CONDITION_VARIANTS, type ConditionVariant } from "@/lib/micro-variants";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import type { SpecialtySlug } from "@/types/medical";

const DEFAULT_CONDITION: ConditionVariant = "artrosis";
const HEAL_DELAY_S = 0.5;
const HEAL_DURATION_S = 2.6;

function toVariant(slug: SpecialtySlug | null): ConditionVariant {
  return (CONDITION_VARIANTS as readonly string[]).includes(slug ?? "") ? (slug as ConditionVariant) : DEFAULT_CONDITION;
}

interface ConditionShowcaseProps {
  selected: SpecialtySlug | null;
}

/**
 * Triage "Por condición": objeto 3D de la condición elegida. Aparece "enfermo" (coral)
 * y, al seleccionarla, se cura hacia teal: el hilo "del dolor al alivio".
 */
export function ConditionShowcase({ selected }: ConditionShowcaseProps) {
  const energy = useMotionValue(0);
  const reduceMotion = useReducedMotionPreference() !== false;
  const variant = toVariant(selected);
  const sceneProps = useMemo(() => ({ variant, energy }), [variant, energy]);

  useEffect(() => {
    energy.set(0);
    if (!selected) return;
    if (reduceMotion) {
      energy.set(1);
      return;
    }
    const controls = animate(energy, 1, { delay: HEAL_DELAY_S, duration: HEAL_DURATION_S, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [selected, energy, reduceMotion]);

  return (
    <div aria-hidden className="mx-auto mb-6 w-full max-w-sm">
      <Scene3DSlot
        scene="micro"
        sceneProps={sceneProps}
        className="aspect-[4/3] w-full"
        fallback={
          <div className="grid size-full place-items-center">
            <JointMotif mode="loop" className="h-[70%] w-auto" />
          </div>
        }
      />
      <p className="text-center font-display text-sm font-semibold tracking-wide text-teal-200">
        {selected ? "Del dolor al alivio: así actúa un tratamiento a tiempo" : "Elige una condición para verla en 3D"}
      </p>
    </div>
  );
}
