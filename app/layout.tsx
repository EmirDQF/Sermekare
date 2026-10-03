import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { JsonLd } from "@/components/shared/JsonLd";
import { site } from "@/data/site";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import { clinicSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const DEFAULT_TITLE = `Reumatólogo en Lima (San Borja) | ${site.name}`;

/** Debe coincidir con THEME_STORAGE_KEY en components/layout/ThemeToggle.tsx. */
const THEME_STORAGE_KEY = "sermekare-theme";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: DEFAULT_TITLE, template: `%s | ${site.name}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: site.name,
  keywords: [
    "reumatólogo en Lima",
    "reumatólogo San Borja",
    "infiltración ecoguiada Lima",
    "tratamiento artritis reumatoide Lima",
    "viscosuplementación rodilla Lima",
    "artrosis",
    "osteoporosis",
    "teleconsulta reumatología",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: site.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b192c" },
  ],
};

/** Aplica el tema guardado antes del primer pintado (evita el destello de tema incorrecto). */
const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" data-theme="light" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <JsonLd data={clinicSchema()} />
        <Providers>
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <MobileActionBar />
        </Providers>
      </body>
    </html>
  );
}
