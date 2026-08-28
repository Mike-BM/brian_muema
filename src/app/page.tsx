import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceAndSkillsSection } from "@/components/ExperienceAndSkillsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <ExperienceAndSkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
