"use client";

import { FormattedText } from "@/components/FormattedText";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  dateCompleted?: string;
  featured?: boolean;
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const dataCategories = ["All", "Data Analysis", "Data Science", "Machine Learning", "AI", "Hackathon"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?t=${Date.now()}`, { cache: 'no-store' });
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

  const dataTypes = ["Data Analysis", "Data Science", "Machine Learning", "AI", "Hackathon"];
  
  // Sort function: newest first based on dateCompleted, fallback to id timestamp
  const sortByDate = (a: Project, b: Project) => {
    const dateA = a.dateCompleted ? new Date(a.dateCompleted).getTime() : parseInt(a.id);
    const dateB = b.dateCompleted ? new Date(b.dateCompleted).getTime() : parseInt(b.id);
    return dateB - dateA;
  };

  const dataProjects = projects
    .filter(p => dataTypes.includes(p.filterCategory) || dataTypes.includes(p.projectType || ''))
    .sort(sortByDate);

  const filteredProjects = dataProjects
    .filter(p => filter === "All" || p.filterCategory.includes(filter) || p.category.includes(filter) || p.projectType === filter);

  return (
    <section id="projects" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Projects
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground">
            Explore my featured professional work, side projects, and experiments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {dataCategories.map((cat, index) => (
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
        ) : filteredProjects.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
            No projects found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group flex flex-col border transition-all ${
                  project.featured
                    ? "border-primary bg-card/50 shadow-md ring-1 ring-primary/20" 
                    : "border-border bg-card hover:border-foreground"
                }`}
              >
                <div className="h-48 bg-muted flex items-center justify-center border-b border-border overflow-hidden relative">
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow z-10">
                      FEATURED
                    </div>
                  )}
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
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{project.category}</span>
                    {project.dateCompleted && (
                      <span className="text-xs text-muted-foreground">{new Date(project.dateCompleted).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                  <FormattedText text={project.description} className="text-muted-foreground mb-4" />
                  
                  {project.fullDescription && (
                    <div className="mb-4">
                      <button 
                        onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        {expandedId === project.id ? 'Hide details' : 'Read full description'}
                        {expandedId === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {expandedId === project.id && (
                        <div className="mt-3 p-4 bg-muted/50 rounded-md text-sm text-foreground border border-border">
                          <FormattedText text={project.fullDescription} />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-6 flex-grow">
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center border border-border p-2 text-foreground hover:bg-foreground hover:text-background transition-colors"
                      title="View GitHub Repository"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
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
