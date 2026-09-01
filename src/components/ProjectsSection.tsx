"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  filterCategory: string;
  technologies: string[];
  link: string;
  github: string;
  liveUrl?: string;
  image: string | null;
  projectType?: string;
}

export function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Data Analysis", "Data Science", "Machine Learning", "AI"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter(p => !p.projectType || p.projectType === 'Professional')
    .filter(p => filter === "All" || p.filterCategory.includes(filter) || p.category.includes(filter));

  return (
    <section id="projects" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground">
            Real-world problems explored through data, analysis, and technology.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-sm font-medium transition-colors border ${
                filter === cat 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-transparent text-foreground border-border hover:border-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col border border-border bg-card hover:border-foreground transition-all"
              >
                <div className="h-48 bg-muted flex items-center justify-center border-b border-border overflow-hidden relative">
                  {project.image ? (
                    <Image 
                      fill 
                      src={project.image} 
                      alt={`Screenshot of ${project.title}`} 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover" 
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">[Project Image / Visual]</span>
                  )}
                </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{project.category}</span>
                <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.slice(0, 5).map((tech, tIndex) => (
                    <span key={tIndex} className="text-xs px-2 py-1 bg-muted text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border mt-auto">
                  <Link 
                    href={project.link}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-background border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    View Case Study <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
                      title="View Live Site"
                    >
                      Live
                    </a>
                  )}
                  <a 
                    href={project.github}
                    className="inline-flex items-center justify-center border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
                    title="View GitHub Repository"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  </a>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
