"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { homeImages } from "@/data/home";
import { site } from "@/data/site";

const VIDEO_TITLE = "¿Dolor de rodilla? ¿Artrosis? Te explicamos tus opciones";

/** Miniatura propia + modal de YouTube que solo se carga al abrirlo (youtube-nocookie). */
export function VideoSection() {
  return (
    <section aria-labelledby="video-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <SectionHeading
          id="video-title"
          eyebrow="En 3 minutos"
          title="¿Dolor de rodilla? ¿Artrosis?"
          description="Nuestra especialista te explica qué está pasando en tu articulación y qué tratamientos existen hoy."
        />
        <Reveal className="mx-auto mt-12 max-w-5xl">
          <Dialog>
            <DialogTrigger className="group relative block aspect-video w-full overflow-hidden rounded-[2rem] shadow-lift">
              <Image
                src={homeImages.video}
                alt={homeImages.videoAlt}
                fill
                sizes="(min-width: 1024px) 1024px, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="relative grid size-20 place-items-center rounded-full bg-white text-navy shadow-lift transition-transform duration-300 group-hover:scale-110 sm:size-24">
                  <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-white/60" />
                  <Play aria-hidden className="relative ml-1 size-8 fill-current" />
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-8">
                <span className="block font-display text-lg font-bold text-white sm:text-2xl">{VIDEO_TITLE}</span>
                <span className="mt-1 block text-sm text-slate-200">Reproducir video · 3 min</span>
              </span>
            </DialogTrigger>
            <DialogContent bare className="max-w-5xl">
              <DialogTitle className="sr-only">{VIDEO_TITLE}</DialogTitle>
              <DialogDescription className="sr-only">Video informativo de {site.name}.</DialogDescription>
              <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${site.youtubeVideoId}?autoplay=1&rel=0`}
                  title={VIDEO_TITLE}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            </DialogContent>
          </Dialog>
        </Reveal>
      </div>
    </section>
  );
}
