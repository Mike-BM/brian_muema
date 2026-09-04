"use client";

import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function AboutSection() {
  const [aboutTitle, setAboutTitle] = useState("About Me");
  const [aboutContent, setAboutContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`/api/about?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAboutTitle(data.title || "About Me");
          setAboutContent(data.content || "");
        }
      } catch (error) {
        console.error('Failed to fetch about data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">{aboutTitle}</h2>
            <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              ) : aboutContent ? (
                aboutContent.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  )
                ))
              ) : (
                <p>Failed to load about section.</p>
              )}
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 bg-card border border-border p-6 rounded-lg shadow-sm">
              <span className="font-semibold text-foreground text-center">Economics & Statistics</span>
              <ArrowRight className="text-muted-foreground hidden sm:block h-5 w-5" />
              <ArrowRight className="text-muted-foreground sm:hidden h-5 w-5 rotate-90" />
              <span className="font-semibold text-foreground text-center">Data Analytics</span>
              <ArrowRight className="text-muted-foreground hidden sm:block h-5 w-5" />
              <ArrowRight className="text-muted-foreground sm:hidden h-5 w-5 rotate-90" />
              <span className="font-semibold text-foreground text-center">Data Scientist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
