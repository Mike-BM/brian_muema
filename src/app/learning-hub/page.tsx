import type { Metadata } from "next";
import { getLearningHubData } from "@/lib/learning-hub-data";
import { LearningHubHero } from "@/components/learning-hub/LearningHubHero";
import { LearningPathsSection } from "@/components/learning-hub/LearningPathsSection";
import { LearningResourcesSection } from "@/components/learning-hub/LearningResourcesSection";
import { WorkshopsSection } from "@/components/learning-hub/WorkshopsSection";
import { PracticalProjectsSection } from "@/components/learning-hub/PracticalProjectsSection";
import { LearnerShowcaseSection } from "@/components/learning-hub/LearnerShowcaseSection";
import { LearningAccessSection } from "@/components/learning-hub/LearningAccessSection";
import { LearningContactSection } from "@/components/learning-hub/LearningContactSection";

export const metadata: Metadata = {
  title: "Learning Hub | Brian Muema Michael",
  description:
    "Learn by Doing. Build with Data. Structured learning paths, open resources, interactive workshops, and hands-on capstone projects in Data Analysis and Data Science.",
  openGraph: {
    title: "Learning Hub | Learn by Doing. Build with Data.",
    description:
      "A dedicated space for practical learning, knowledge sharing and skill development in Data Analysis and Data Science by Brian Muema Michael.",
    url: "https://brianmuema.com/learning-hub",
    siteName: "Brian Muema Michael Portfolio",
    type: "website",
  },
  alternates: {
    canonical: "https://brianmuema.com/learning-hub",
  },
};

export default async function LearningHubPage() {
  const data = await getLearningHubData();

  return (
    <div className="flex flex-col min-h-screen">
      <LearningHubHero />
      <LearningPathsSection paths={data.paths} />
      <LearningResourcesSection resources={data.resources} />
      <WorkshopsSection workshops={data.workshops} />
      <PracticalProjectsSection projects={data.projects} />
      <LearnerShowcaseSection learners={data.learnerShowcase} />
      <LearningAccessSection />
      <LearningContactSection />
    </div>
  );
}
