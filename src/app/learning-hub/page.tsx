import type { Metadata } from "next";
import { getLearningHubData, isLearningHubLive } from "@/lib/learning-hub-data";
import { LearningHubComingSoon } from "@/components/learning-hub/LearningHubComingSoon";
import { LearningHubHero } from "@/components/learning-hub/LearningHubHero";
import { LearningPathsSection } from "@/components/learning-hub/LearningPathsSection";
import { LearningResourcesSection } from "@/components/learning-hub/LearningResourcesSection";
import { WorkshopsSection } from "@/components/learning-hub/WorkshopsSection";
import { PracticalProjectsSection } from "@/components/learning-hub/PracticalProjectsSection";
import { LearnerShowcaseSection } from "@/components/learning-hub/LearnerShowcaseSection";
import { ExternalKnowledgeSection } from "@/components/learning-hub/ExternalKnowledgeSection";
import { LearningAccessSection } from "@/components/learning-hub/LearningAccessSection";
import { LearningContactSection } from "@/components/learning-hub/LearningContactSection";

export const metadata: Metadata = {
  title: "Learning Hub | Brian Muema Michael",
  description:
    "Learning Hub coming soon. A space for practical learning in Data Analysis and Data Science. Stay tuned.",
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

// Always evaluate on the server per request so the admin switch takes effect immediately.
export const dynamic = "force-dynamic";

export default async function LearningHubPage() {
  // Not live yet: show the "Stay tuned" page and never even load the content.
  if (!(await isLearningHubLive())) {
    return <LearningHubComingSoon />;
  }

  const data = await getLearningHubData();

  return (
    <div className="flex flex-col min-h-screen">
      <LearningHubHero />
      <LearningPathsSection paths={data.paths} />
      <LearningResourcesSection resources={data.resources} />
      <WorkshopsSection workshops={data.workshops} />
      <PracticalProjectsSection projects={data.projects} />
      <LearnerShowcaseSection learners={data.learnerShowcase} />
      <ExternalKnowledgeSection sites={data.externalKnowledgeSites} />
      <LearningAccessSection />
      <LearningContactSection />
    </div>
  );
}

