"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, Code2, Database } from "lucide-react";

export function LearningHubHero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>Brian&apos;s Training & Mentorship Platform</span>
          </div>

          {/* Title and Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Learn by Doing. <br className="hidden sm:inline" />
            <span className="text-primary">Build with Data.</span>
          </h1>

          {/* Required exact description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Welcome to my Learning Hub, a space dedicated to practical learning, knowledge sharing and skill development in Data Analysis and Data Science. Explore learning resources, practical exercises, workshops and projects designed to help you develop real-world technical skills.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#learning-paths"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 shadow-sm"
            >
              Explore Learning Paths
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#workshops"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70 shadow-sm"
            >
              Join a Learning Session
              <Users className="h-4 w-4 text-primary" />
            </a>
          </div>

          {/* Key highlights / Value props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/40 text-left">
            <div className="p-4 rounded-lg bg-card/60 border border-border/40">
              <div className="flex items-center gap-2.5 mb-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Method</span>
              </div>
              <p className="text-sm font-bold text-foreground">Hands-on Code First</p>
              <p className="text-xs text-muted-foreground mt-0.5">Real Python scripts & notebooks</p>
            </div>

            <div className="p-4 rounded-lg bg-card/60 border border-border/40">
              <div className="flex items-center gap-2.5 mb-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Data</span>
              </div>
              <p className="text-sm font-bold text-foreground">Authentic Datasets</p>
              <p className="text-xs text-muted-foreground mt-0.5">Real business & health data</p>
            </div>

            <div className="p-4 rounded-lg bg-card/60 border border-border/40">
              <div className="flex items-center gap-2.5 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Curriculum</span>
              </div>
              <p className="text-sm font-bold text-foreground">2 Guided Paths</p>
              <p className="text-xs text-muted-foreground mt-0.5">15 structured modular lessons</p>
            </div>

            <div className="p-4 rounded-lg bg-card/60 border border-border/40">
              <div className="flex items-center gap-2.5 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Community</span>
              </div>
              <p className="text-sm font-bold text-foreground">Peer Mentorship</p>
              <p className="text-xs text-muted-foreground mt-0.5">Physical & online sessions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
