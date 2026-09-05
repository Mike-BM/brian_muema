"use client";

import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="min-h-[60vh] flex flex-col justify-center bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-4xl order-2 lg:order-1">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase mb-4 text-center lg:text-left">
              Brian Muema Michael — Data Analyst | Data Scientist
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight text-center lg:text-left">
              Turning Data Into Insights, <br className="hidden md:block" />
              Insights Into Decisions.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed text-center lg:text-left">
              I analyze data, uncover patterns, and build data-driven solutions
              using statistics, Python, SQL, visualization, and machine learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              >
                View Projects
              </Link>
              <a
                href="/cv.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Download CV
              </a>
            </div>

            <div className="mt-12 lg:mt-16 flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-medium text-muted-foreground">
              <span>Python</span>
              <span className="hidden sm:inline">•</span>
              <span>SQL</span>
              <span className="hidden sm:inline">•</span>
              <span>Statistics</span>
              <span className="hidden sm:inline">•</span>
              <span>Machine Learning</span>
            </div>
          </div>
          
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 xl:w-96 xl:h-96 rounded-full overflow-hidden border-4 border-muted shadow-lg">
              <Image 
                src="/profile.jpg" 
                alt="Brian Muema Michael - Data Analyst" 
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 192px, (max-width: 1024px) 256px, 384px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
