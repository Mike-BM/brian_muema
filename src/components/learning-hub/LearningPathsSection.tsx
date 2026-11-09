"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Binary, CheckCircle2, Clock, Layers } from "lucide-react";
import { LearningPath } from "@/lib/learning-hub-types";

interface LearningPathsSectionProps {
  paths: LearningPath[];
}

export function LearningPathsSection({ paths }: LearningPathsSectionProps) {
  return (
    <section id="learning-paths" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Core Curriculums
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Structured Learning Paths
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Choose your learning track. Each path includes step-by-step modular lessons, curated notebooks, practice datasets, and hands-on capstone projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {paths.map((path) => {
            const isDataAnalysis = path.slug === "data-analysis";
            return (
              <div
                key={path.id}
                className="flex flex-col justify-between bg-card border border-border p-6 sm:p-8 rounded-none transition-all duration-200 hover:border-primary/50 shadow-sm"
              >
                <div>
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 text-primary">
                        {isDataAnalysis ? (
                          <BarChart3 className="h-6 w-6" />
                        ) : (
                          <Binary className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                          Path {isDataAnalysis ? "A" : "B"}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground">
                          {path.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-muted text-muted-foreground border border-border">
                      {path.level}
                    </span>
                  </div>

                  {/* Headline & Description */}
                  <p className="font-semibold text-foreground text-base mb-2">
                    {path.headline}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {path.description}
                  </p>

                  {/* Metadata strip */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50 text-xs text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span><strong>Duration:</strong> {path.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span><strong>Modules:</strong> {path.lessons.length} Lessons</span>
                    </div>
                  </div>

                  {/* Modules Curriculum List */}
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      Modules Included:
                    </p>
                    <ul className="space-y-2 text-sm">
                      {path.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex items-start gap-2.5 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground/90 font-medium">
                            {lesson.title}
                          </span>
                          {lesson.access === "Free" ? (
                            <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                              Free
                            </span>
                          ) : (
                            <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">
                              Premium
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies tags */}
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Tools & Stack:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {path.featuredTechnologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 bg-muted/60 text-muted-foreground border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-4 border-t border-border/50">
                  <Link
                    href={`/learning-hub/${path.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-3 text-sm font-medium transition-colors"
                  >
                    <span>View Full Syllabus & Exercises</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

