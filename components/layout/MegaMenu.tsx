"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenu } from "radix-ui";
import { specialties } from "@/data/specialties";
import { servicePillars } from "@/data/services";
import { TRIAGE_HREF } from "@/data/navigation";
import { IconBadge } from "@/components/shared/Icon";
import { JointMotif } from "@/components/shared/JointMotif";

const PANEL =
  "absolute left-1/2 top-full z-50 mt-3 w-[min(56rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-lift data-[state=open]:animate-fade-in";

const ITEM_LINK =
  "block rounded-2xl p-3 transition-colors hover:bg-teal-tint focus-visible:bg-teal-tint";

export function SpecialtiesMenu() {
  return (
    <NavigationMenu.Content className={PANEL}>
      <div className="grid gap-6 md:grid-cols-[1fr_15rem]">
        <ul className="grid gap-1 sm:grid-cols-2">
          {specialties.map((specialty) => (
            <li key={specialty.slug}>
              <NavigationMenu.Link asChild>
                <Link href={`/especialidades/${specialty.slug}`} className={ITEM_LINK}>
                  <span className="block font-display font-semibold text-heading">{specialty.name}</span>
                  <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{specialty.summary}</span>
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
        <div className="group flex flex-col rounded-3xl bg-navy p-5 text-white">
          <JointMotif mode="hover" className="mx-auto h-28 w-auto" />
          <p className="mt-3 font-display text-lg font-bold">¿No sabes por dónde empezar?</p>
          <p className="mt-1 text-sm text-slate-300">Indícanos dónde te duele y te orientamos con el especialista adecuado.</p>
          <NavigationMenu.Link asChild>
            <Link
              href={TRIAGE_HREF}
              className="mt-auto inline-flex min-h-12 items-center gap-2 pt-3 font-display font-semibold text-teal-200 hover:text-white"
            >
              ¿Dónde te duele? <ArrowRight aria-hidden className="size-4" />
            </Link>
          </NavigationMenu.Link>
        </div>
      </div>
    </NavigationMenu.Content>
  );
}

export function ServicesMenu() {
  return (
    <NavigationMenu.Content className={PANEL}>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {servicePillars.map((pillar) => (
          <li key={pillar.slug}>
            <NavigationMenu.Link asChild>
              <Link href={`/servicios/${pillar.slug}`} className={`${ITEM_LINK} flex gap-3`}>
                <IconBadge name={pillar.icon} />
                <span>
                  <span className="block font-display font-semibold text-heading">{pillar.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">{pillar.tagline}</span>
                </span>
              </Link>
            </NavigationMenu.Link>
          </li>
        ))}
        <li>
          <NavigationMenu.Link asChild>
            <Link href="/servicios" className={`${ITEM_LINK} flex h-full items-center gap-2 font-display font-semibold text-primary`}>
              Ver todos los servicios <ArrowRight aria-hidden className="size-4" />
            </Link>
          </NavigationMenu.Link>
        </li>
      </ul>
    </NavigationMenu.Content>
  );
}
