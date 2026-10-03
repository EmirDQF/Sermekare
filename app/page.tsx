import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { InsuranceMarquee } from "@/components/sections/InsuranceMarquee";
import { PainPoints } from "@/components/sections/PainPoints";
import { SymptomTriage } from "@/components/sections/SymptomTriage";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TreatmentsGrid } from "@/components/sections/TreatmentsGrid";
import { GuidedVsBlind } from "@/components/sections/GuidedVsBlind";
import { CareJourney } from "@/components/sections/CareJourney";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoSection } from "@/components/sections/VideoSection";
import { TelemedicineBand } from "@/components/sections/TelemedicineBand";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FAQ } from "@/components/sections/FAQ";
import { LocationCTA } from "@/components/sections/LocationCTA";
import { site } from "@/data/site";
import { DEFAULT_DESCRIPTION, buildMetadata } from "@/lib/seo";

const HOME_TITLE = `Reumatólogo en Lima (San Borja) | ${site.name}`;

export const metadata: Metadata = {
  ...buildMetadata({ title: HOME_TITLE, description: DEFAULT_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

export default function Home() {
  return (
    <>
      <Hero />
      <InsuranceMarquee />
      <PainPoints />
      <SymptomTriage />
      <WhyUs />
      <ServicesGrid />
      <TreatmentsGrid />
      <GuidedVsBlind />
      <CareJourney />
      <DoctorsSection />
      <Testimonials />
      <VideoSection />
      <TelemedicineBand />
      <AppointmentForm />
      <BlogPreview />
      <FAQ />
      <LocationCTA />
    </>
  );
}
