import { PageShell } from "@/components/layout/PageShell";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { ContactCta } from "@/components/home/ContactCta";
import { ContactSection } from "@/components/home/ContactSection";
import { GroupIntro } from "@/components/home/GroupIntro";
import { HeroSection } from "@/components/home/HeroSection";
import { Marquee } from "@/components/home/Marquee";
import { OrganizationsSection } from "@/components/home/OrganizationsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { VisionSection } from "@/components/home/VisionSection";

export default function Home() {
  return (
    <PageShell variant="home" current="home" footer="home">
      <HeroSection />
      <Marquee />
      <GroupIntro />
      <ActivitiesSection />
      <VisionSection />
      <OrganizationsSection />
      <ProjectsSection />
      <ContactCta />
      <ContactSection />
    </PageShell>
  );
}
