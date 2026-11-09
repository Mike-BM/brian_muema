"use client";

import { FolderGit2, Quote, ShieldCheck, UserCheck } from "lucide-react";
import { LearnerShowcase } from "@/lib/learning-hub-types";

interface LearnerShowcaseSectionProps {
  learners: LearnerShowcase[];
}

export function LearnerShowcaseSection({ learners }: LearnerShowcaseSectionProps) {
  return (
    <section id="learner-showcase" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Real Impact & Mentorship
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Learner Showcase & Achievements
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Selected projects built by coursemates and mentees I have trained. Each learner developed real technical competence, solving practical problems with code and data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learners.map((learner) => (
            <div
              key={learner.id}
              className="flex flex-col justify-between bg-card border border-border p-6 sm:p-8 rounded-none transition-all hover:border-primary/50 shadow-sm"
            >
              <div>
                {/* Attribution Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {learner.learnerName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base">
                        {learner.learnerName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {learner.role} • {learner.cohort}
                      </p>
                    </div>
                  </div>

                  {learner.publishedWithConsent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 bg-muted text-muted-foreground border border-border">
                      <ShieldCheck className="h-3 w-3 text-green-500" />
                      Consent Verified
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <div className="p-3 bg-muted/40 border border-border/60 mb-4">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-primary">
                    Featured Project
                  </span>
                  <p className="font-bold text-foreground text-sm sm:text-base">
                    {learner.projectTitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {learner.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {learner.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 bg-background border border-border text-foreground font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Testimonial Quote */}
                <div className="relative p-4 bg-muted/20 border-l-2 border-primary text-xs text-muted-foreground italic mb-4">
                  <Quote className="h-4 w-4 text-primary/40 absolute right-3 top-3" />
                  &ldquo;{learner.quote}&rdquo;
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  Trained & Mentored by Brian
                </span>
                {learner.githubUrl && (
                  <a
                    href={learner.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    <FolderGit2 className="h-3.5 w-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note on learner consent */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            * Learner projects and testimonials are published strictly with voluntary written consent. If you are a former or current mentee and would like your project featured or updated, please reach out via the contact form.
          </p>
        </div>
      </div>
    </section>
  );
}

