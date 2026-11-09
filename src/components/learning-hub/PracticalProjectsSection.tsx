"use client";

import { useState } from "react";
import { 
  FolderGit2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  CheckCircle2, 
  Terminal, 
  Sparkles,
  ArrowUpRight 
} from "lucide-react";
import { PracticalProject } from "@/lib/learning-hub-types";

interface PracticalProjectsSectionProps {
  projects: PracticalProject[];
}

export function PracticalProjectsSection({ projects }: PracticalProjectsSectionProps) {
  const [filter, setFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["All", "Data Analysis", "Data Science"];

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="practical-projects" className="py-16 sm:py-20 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Hands-on Portfolio Capstones
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Practical Project-Based Learning
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Real data challenges designed to help you bridge the gap between theory and execution. Each project provides authentic datasets, guided milestones, and tangible portfolio deliverables.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors border ${
                filter === cat
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-card text-muted-foreground border-border hover:border-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const isExpanded = expandedId === project.id;
            const isPremium = project.access === "Premium";

            return (
              <div
                key={project.id}
                className="bg-card border border-border rounded-none p-6 sm:p-8 transition-all hover:border-primary/50 shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary border border-primary/20">
                      {project.category}
                    </span>
                    <span className="text-xs px-2.5 py-1 bg-muted text-muted-foreground border border-border">
                      {project.difficulty}
                    </span>
                    {isPremium ? (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                        Guided Project (Premium)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                        Open Project (Free)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FolderGit2 className="h-4 w-4" />
                        <span>Source Code</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  {project.title}
                </h3>

                {/* Problem Statement */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Problem Statement
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </div>

                {/* Dataset metadata box */}
                <div className="p-4 bg-muted/40 border border-border text-xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Database className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">{project.datasetName}</p>
                      <p className="text-muted-foreground">{project.datasetDescription}</p>
                    </div>
                  </div>
                  {project.datasetSize && (
                    <span className="text-muted-foreground whitespace-nowrap self-end sm:self-center">
                      Size: {project.datasetSize}
                    </span>
                  )}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap items-center gap-1.5 mb-6">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">Tools:</span>
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-0.5 bg-background border border-border text-foreground font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Accordion toggle for instructions & expected output */}
                <div className="pt-4 border-t border-border/50">
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>
                      {isExpanded ? "Hide Implementation Milestones" : "View Step-by-Step Instructions & Deliverables"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-border/50 space-y-6 animate-fadeIn">
                      {/* Step by step instructions */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-primary" />
                          Step-by-Step Instructions:
                        </h4>
                        <ol className="space-y-2.5">
                          {project.stepByStepInstructions.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Expected Outputs */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Expected Deliverables & Artifacts:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {project.expectedOutput.map((output, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-background border border-border text-xs text-foreground/90 flex items-start gap-2"
                            >
                              <span className="text-primary font-bold">✓</span>
                              <span>{output}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mentorship note / CTA */}
                      {isPremium && (
                        <div className="p-4 bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>Want code review and architecture feedback on your project submission?</span>
                          </div>
                          <a
                            href="#contact-registration"
                            className="whitespace-nowrap px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                          >
                            Request Code Review
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
