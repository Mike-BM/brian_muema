"use client";

import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="min-h-[60vh] flex flex-col justify-center bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase mb-4">
              Brian Muema Michael — Data Analyst | Data Science
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Turning Data Into Insights, <br className="hidden md:block" />
              Insights Into Decisions.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              I analyze data, uncover patterns, and build data-driven solutions
              using statistics, Python, SQL, visualization, and machine learning.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              >
                View Projects
              </Link>
              <a
                href="/cv.pdf"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Download CV
              </a>
            </div>

            <div className="mt-16 flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
              <span>Python</span>
              <span className="hidden sm:inline">•</span>
              <span>SQL</span>
              <span className="hidden sm:inline">•</span>
              <span>Statistics</span>
              <span className="hidden sm:inline">•</span>
              <span>Machine Learning</span>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-72 xl:w-96 xl:h-96 rounded-full overflow-hidden border-4 border-muted">
              {/* Add your image to public/profile.jpg */}
              <Image 
                src="/profile.jpg" 
                alt="Brian Muema Michael - Data Analyst" 
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 384px"
                className="object-cover bg-muted"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
