"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Code2, 
  Terminal, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Briefcase, 
  Target, 
  Copy, 
  Check, 
  Share2 
} from "lucide-react";
import { LearningPath, LearningLesson, PracticalProject, LearningResource } from "@/lib/learning-hub-types";

interface PathDetailViewProps {
  path: LearningPath;
  relatedProjects: PracticalProject[];
  relatedResources: LearningResource[];
}

export function PathDetailView({ path, relatedProjects, relatedResources }: PathDetailViewProps) {
  const [activeLessonId, setActiveLessonId] = useState<string>(path.lessons[0]?.id || "");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curriculum" | "exercises" | "resources">("curriculum");

  const currentLesson = path.lessons.find((l) => l.id === activeLessonId) || path.lessons[0];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="py-8 sm:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/learning-hub" className="hover:text-foreground transition-colors">
            Learning Hub
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{path.shortTitle}</span>
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/learning-hub"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Learning Paths
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="bg-card border border-border p-6 sm:p-10 mb-12 shadow-sm">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary border border-primary/20">
                Official Curriculum
              </span>
              <span className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground border border-border">
                {path.level}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground border border-border flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {path.duration}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground border border-border flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                {path.lessons.length} Modules
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              {path.title}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-primary mb-4">
              {path.headline}
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
              {path.detailedOverview}
            </p>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#curriculum-breakdown"
                className="px-6 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Explore Modules
              </a>
              <a
                href="#path-registration"
                className="px-6 py-2.5 border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors"
              >
                Join Track Mentorship
              </a>
            </div>
          </div>

          {/* Prerequisites and Target Audience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-border/50 text-xs">
            <div>
              <p className="font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                Prerequisites:
              </p>
              <ul className="space-y-1.5 text-muted-foreground">
                {path.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                Who Should Take This:
              </p>
              <ul className="space-y-1.5 text-muted-foreground">
                {path.targetAudience.map((aud, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{aud}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-primary" />
                Target Career Roles:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {path.careerOpportunities.map((role, i) => (
                  <span key={i} className="px-2 py-0.5 bg-muted text-foreground border border-border">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Learning Objectives */}
        <div className="bg-muted/30 border border-border p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Path Learning Objectives
          </h2>
          <div className="h-1 w-16 bg-primary rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {path.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-card border border-border text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/90 font-medium">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs for Path Content */}
        <div id="curriculum-breakdown" className="mb-8">
          <div className="flex border-b border-border gap-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "curriculum"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Curriculum & Lessons ({path.lessons.length})
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "exercises"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Practical Exercises & Capstones ({relatedProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "resources"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Path Resources & Notebooks ({relatedResources.length})
            </button>
          </div>
        </div>

        {/* TAB 1: CURRICULUM & LESSONS */}
        {activeTab === "curriculum" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Lesson Modules List */}
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Select Module to Inspect
              </p>
              {path.lessons.map((lesson) => {
                const isSelected = lesson.id === currentLesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full text-left p-4 border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-card border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {lesson.lessonNumber}
                      </span>
                      <div>
                        <h4
                          className={`text-sm font-bold leading-snug ${
                            isSelected ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                          <span>{lesson.duration}</span>
                          <span>•</span>
                          <span>{lesson.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 border flex-shrink-0 ${
                        lesson.access === "Free"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {lesson.access}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed Lesson Viewer */}
            <div className="lg:col-span-7 bg-card border border-border p-6 sm:p-8 rounded-none shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Module {currentLesson.lessonNumber} of {path.lessons.length}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-1">
                    {currentLesson.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 bg-muted text-muted-foreground border border-border">
                    {currentLesson.duration}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 border ${
                      currentLesson.access === "Free"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    {currentLesson.access} Lesson
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Module Summary
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {currentLesson.summary}
                </p>
              </div>

              {/* Learning Objectives */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5">
                  What You Will Learn:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {currentLesson.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Topics in Syllabus */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5">
                  Syllabus Breakdown:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentLesson.keyTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-muted/40 border border-border/60 text-xs text-foreground font-medium"
                    >
                      • {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet Highlight */}
              {currentLesson.codeSnippet && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      {currentLesson.codeSnippet.caption}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCode(
                          currentLesson.codeSnippet!.code,
                          currentLesson.id
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedCodeId === currentLesson.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-muted/80 text-foreground font-mono text-xs overflow-x-auto border border-border leading-relaxed">
                    <code>{currentLesson.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Practical Exercise Box */}
              {currentLesson.practicalExercise && (
                <div className="p-4 bg-primary/5 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Code2 className="h-4 w-4" />
                    <span>Hands-on Lab Exercise: {currentLesson.practicalExercise.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {currentLesson.practicalExercise.instructions}
                  </p>
                  {currentLesson.practicalExercise.datasetHint && (
                    <p className="text-xs text-muted-foreground italic">
                      Dataset hint: {currentLesson.practicalExercise.datasetHint}
                    </p>
                  )}
                </div>
              )}

              {/* Attached Resources */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <div className="pt-4 border-t border-border/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                    Attached Lesson Materials:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-background border border-border hover:border-foreground transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-primary" />
                        <span>{res.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRACTICAL PROJECTS & CAPSTONES */}
        {activeTab === "exercises" && (
          <div className="space-y-6">
            <div className="max-w-2xl mb-4">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Path Projects & Portfolio Capstones
              </h3>
              <p className="text-sm text-muted-foreground">
                Apply the concepts learned in this path to build fully functioning portfolio assets.
              </p>
            </div>

            {relatedProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects currently tagged under this path.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map((p) => (
                  <div key={p.id} className="bg-card border border-border p-6 rounded-none space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                        {p.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.access} Project</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{p.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                      {p.problemStatement}
                    </p>
                    <div className="p-3 bg-muted/40 text-xs border border-border">
                      <p className="font-semibold text-foreground">Dataset: {p.datasetName}</p>
                      <p className="text-muted-foreground">{p.datasetDescription}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.technologies.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 bg-background border border-border">
                            {t}
                          </span>
                        ))}
                      </div>
                      <Link
                        href="/learning-hub#practical-projects"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View Full Project →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PATH RESOURCES */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div className="max-w-2xl mb-4">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Path Datasets, Notes, & Notebooks
              </h3>
              <p className="text-sm text-muted-foreground">
                Downloadable reference materials curated specifically for this curriculum.
              </p>
            </div>

            {relatedResources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources specifically tagged for this path.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedResources.map((res) => (
                  <div key={res.id} className="bg-card border border-border p-5 rounded-none flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono text-muted-foreground uppercase">{res.format}</span>
                        <span className="font-bold text-primary">{res.access}</span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm mb-2">{res.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{res.description}</p>
                    </div>
                    <Link
                      href="/learning-hub#resources"
                      className="inline-flex items-center justify-center gap-1.5 text-xs py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>Access Material</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* In-page Registration Callout */}
        <div id="path-registration" className="mt-16 bg-muted/40 border border-border p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Mentorship & Code Reviews
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 mb-4">
            Ready to Accelerate Your {path.shortTitle} Skills?
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Join our peer cohorts or request structured 1-on-1 guidance from Brian to work through these modules, review your code, and prepare for industry interviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learning-hub#contact-registration"
              className="w-full sm:w-auto px-8 py-3 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-colors"
            >
              Enroll in {path.shortTitle} Mentorship
            </Link>
            <Link
              href="/learning-hub#workshops"
              className="w-full sm:w-auto px-8 py-3 border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors"
            >
              View Upcoming Workshops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
