import type { JSX } from "react";
import type { SocialLink } from "@/types/medical";

interface BrandIconProps {
  className?: string;
}

/* lucide-react v1 ya no incluye logos de marcas: los dibujamos aquí (trazos simplificados). */

export function WhatsAppIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.9.92-2.98-.2-.31a8.2 8.2 0 1 1 6.82 3.72Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.55.12-.17.25-.64.8-.78.96-.15.17-.29.19-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.85 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.93.61.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.45A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.97v2.23H7.8v3h2.6V21h3.1Z" />
    </svg>
  );
}

function TikTokIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M16.6 3h-3.1v12.2a2.7 2.7 0 1 1-2.7-2.7c.27 0 .53.04.78.11V9.45a5.8 5.8 0 1 0 5.02 5.75V9.1a7.3 7.3 0 0 0 4.1 1.26V7.27A4.2 4.2 0 0 1 16.6 3Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialLink["network"], (props: BrandIconProps) => JSX.Element> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
};

interface SocialIconProps extends BrandIconProps {
  network: SocialLink["network"];
}

export function SocialIcon({ network, className }: SocialIconProps) {
  const Component = SOCIAL_ICONS[network];
  return <Component className={className} />;
}

/** Ícono del Libro de Reclamaciones (libro abierto), según el formato usado por Indecopi. */
export function ComplaintsBookIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 36"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinejoin="round"
    >
      <path d="M24 8c-5-4-12-4.5-20-3v25c8-1.5 15-1 20 3 5-4 12-4.5 20-3V5c-8-1.5-15-1-20 3Z" />
      <path d="M24 8v25" />
      <path d="M9 12h9M9 17h9M9 22h6M30 12h9M30 17h9M30 22h6" strokeLinecap="round" strokeWidth={1.8} />
    </svg>
  );
}
