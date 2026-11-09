import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLearningHubData, getLearningPathBySlug } from "@/lib/learning-hub-data";
import { PathDetailView } from "@/components/learning-hub/PathDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "data-analysis" },
    { slug: "data-science" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = await getLearningPathBySlug(slug);

  if (!path) {
    return {
      title: "Learning Path Not Found | Brian Muema Michael",
    };
  }

  return {
    title: `${path.title} | Learning Hub | Brian Muema Michael`,
    description: path.description,
    openGraph: {
      title: `${path.title} — Brian Muema Michael`,
      description: path.headline,
      url: `https://brianmuema.com/learning-hub/${path.slug}`,
    },
    alternates: {
      canonical: `https://brianmuema.com/learning-hub/${path.slug}`,
    },
  };
}

export default async function LearningPathDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getLearningHubData();
  const path = data.paths.find((p) => p.slug === slug);

  if (!path) {
    notFound();
  }

  const categoryName = path.slug === "data-analysis" ? "Data Analysis" : "Data Science";

  const relatedProjects = data.projects.filter(
    (p) => p.category === categoryName
  );

  const relatedResources = data.resources.filter(
    (r) => r.category === categoryName || r.category === "General"
  );

  return (
    <PathDetailView
      path={path}
      relatedProjects={relatedProjects}
      relatedResources={relatedResources}
    />
  );
}

