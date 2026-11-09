"use client";

import { Check, Sparkles, BookOpen, Users } from "lucide-react";

export function LearningAccessSection() {
  return (
    <section id="access-model" className="py-16 sm:py-20 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Open Access & Mentorship
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transparent Learning Access Model
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Education should be accessible. Foundational resources are free for everyone, while structured 1-on-1 mentorship, guided capstones, and bespoke workshops are available for dedicated learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {/* Free Tier */}
          <div className="bg-card border border-border p-6 sm:p-8 rounded-none flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Open Community
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                  Always Free
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">Free Resources</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Self-paced learning materials designed to help you start your journey in data analytics and data science with zero financial barrier.
              </p>

              <div className="h-px bg-border/60 my-6" />

              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                Included in Free Access:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Introductory lessons:</strong> Foundations of Python, Pandas, and Data Science framing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Selected learning notes:</strong> Quick-reference PDFs, EDA checklists, and syntax guides</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Sample datasets:</strong> Real-world public health, retail, and socio-economic datasets</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Beginner exercises:</strong> Self-guided problem sets with sample solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Open community workshops:</strong> Free registration to public webinar sessions</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#resources"
                className="w-full inline-flex items-center justify-center gap-2 border border-border bg-background hover:bg-muted text-foreground py-3 text-sm font-medium transition-colors"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Browse Free Resources</span>
              </a>
            </div>
          </div>

          {/* Premium / Mentorship Tier */}
          <div className="bg-card border-2 border-primary/40 p-6 sm:p-8 rounded-none flex flex-col justify-between shadow-md relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-sm">
              Mentorship Track
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Structured Growth
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary border border-primary/20">
                  Guided Access
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">Premium & Mentorship</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Hands-on mentorship, code reviews, guided capstones, and intensive workshops tailored for serious skill acceleration.
              </p>

              <div className="h-px bg-border/60 my-6" />

              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                What Premium Access Unlocks:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Complete learning programs:</strong> Full 8-12 week structured curriculums with milestones</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Advanced tutorials & notebooks:</strong> In-depth feature engineering, ensemble modeling, and SHAP explainability</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Guided projects:</strong> Step-by-step capstones with personalized code review and feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Selected recorded workshops:</strong> Complete video archives, slides, and annotated lab notebooks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Structured mentorship sessions:</strong> 1-on-1 career, portfolio, and technical coaching</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#contact-registration"
                className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-3 text-sm font-medium transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Express Interest in Mentorship</span>
              </a>
              <p className="text-center text-[11px] text-muted-foreground mt-2">
                * No payment required now. Express your interest and discuss your learning goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

