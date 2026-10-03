import type { SiteConfig } from "@/types/medical";

const MINUTES_PER_HOUR = 60;

export const site: SiteConfig = {
  name: "SERMEKARE",
  legalTagline: "Centro Especializado en Reumatología y Salud Articular",
  slogan: "Mejorar la vida de nuestros pacientes",
  domain: "sermekare.com", // PROVISIONAL
  url: "https://sermekare.com", // PROVISIONAL
  address: {
    street: "Av. Aviación 2450", // PROVISIONAL
    district: "San Borja", // PROVISIONAL
    city: "Lima",
    country: "Perú",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Aviaci%C3%B3n+2450+San+Borja+Lima", // PROVISIONAL
    mapsEmbedUrl: "https://www.google.com/maps?q=Av.+Aviaci%C3%B3n+2450+San+Borja+Lima&output=embed", // PROVISIONAL
    howToArrive: [
      "A pocas cuadras de la estación La Cultura de la Línea 1 del Metro.", // PROVISIONAL
      "Estacionamiento para pacientes en el sótano.", // PROVISIONAL
      "Acceso con rampa y ascensor.", // PROVISIONAL
    ],
  },
  phone: { display: "(01) 640 0000", tel: "+5116400000" }, // PROVISIONAL
  whatsapp: {
    display: "+51 999 000 000", // PROVISIONAL
    number: "51999000000", // PROVISIONAL
    defaultMessage: "Hola SERMEKARE, quisiera agendar una consulta.",
  },
  email: "contacto@sermekare.com", // PROVISIONAL
  hours: {
    days: [1, 2, 3, 4, 5, 6],
    opensAt: 8 * MINUTES_PER_HOUR,
    closesAt: 20 * MINUTES_PER_HOUR,
    timeZone: "America/Lima",
    label: "Lunes a sábado · 8:00 a.m. – 8:00 p.m.",
    closedLabel: "Domingo cerrado",
  },
  socials: [
    { network: "instagram", label: "Instagram", href: "https://instagram.com/sermekare" }, // PROVISIONAL
    { network: "facebook", label: "Facebook", href: "https://facebook.com/sermekare" }, // PROVISIONAL
    { network: "tiktok", label: "TikTok", href: "https://tiktok.com/@sermekare" }, // PROVISIONAL
    { network: "youtube", label: "YouTube", href: "https://youtube.com/@sermekare" }, // PROVISIONAL
  ],
  stats: {
    consultations: { value: 15000, prefix: "+", label: "consultas realizadas" }, // PROVISIONAL
    rating: { value: 4.9, decimals: 1, label: "calificación promedio" }, // PROVISIONAL
    years: { value: 12, prefix: "+", label: "años de experiencia" }, // PROVISIONAL
    specialists: { value: 8, label: "especialistas" }, // PROVISIONAL
    reviewsCount: 640, // PROVISIONAL
  },
  youtubeVideoId: "aqz-KE-bpKQ", // PROVISIONAL: video de muestra, reemplazar por el video institucional
  provisional: true,
};

export const MEDICAL_DISCLAIMER =
  "La información de esta web es orientativa y no reemplaza una consulta médica. Ante una emergencia, acude al servicio de emergencias más cercano.";
