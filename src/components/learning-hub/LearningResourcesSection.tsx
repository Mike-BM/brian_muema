"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  BookOpen, 
  FileSpreadsheet, 
  Code2, 
  Video, 
  Lock, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { LearningResource } from "@/lib/learning-hub-types";

interface LearningResourcesSectionProps {
  resources: LearningResource[];
  onRequestAccess?: (resource: LearningResource) => void;
}

export function LearningResourcesSection({ resources, onRequestAccess }: LearningResourcesSectionProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAccess, setSelectedAccess] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalResource, setModalResource] = useState<LearningResource | null>(null);

  const resourceTypes = [
    { label: "All Types", value: "all" },
    { label: "Learning Notes", value: "notes" },
    { label: "PDF Materials", value: "pdf" },
    { label: "Python Notebooks", value: "notebook" },
    { label: "Practice Datasets", value: "dataset" },
    { label: "Exercises", value: "exercise" },
    { label: "Recorded Tutorials", value: "tutorial" },
  ];

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Data Analysis", value: "Data Analysis" },
    { label: "Data Science", value: "Data Science" },
  ];

  const accessTiers = [
    { label: "All Access", value: "all" },
    { label: "Free Resources", value: "Free" },
    { label: "Premium / Guided", value: "Premium" },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesType = selectedType === "all" || res.type === selectedType;
    const matchesCategory = selectedCategory === "all" || res.category === selectedCategory;
    const matchesAccess = selectedAccess === "all" || res.access === selectedAccess;
    const matchesSearch =
      searchQuery === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesCategory && matchesAccess && matchesSearch;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "notes":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "pdf":
        return <BookOpen className="h-5 w-5 text-red-500" />;
      case "notebook":
        return <Code2 className="h-5 w-5 text-amber-500" />;
      case "dataset":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
      case "exercise":
        return <CheckCircle2 className="h-5 w-5 text-purple-500" />;
      case "tutorial":
        return <Video className="h-5 w-5 text-cyan-500" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const handleResourceClick = (res: LearningResource) => {
    if (res.access === "Premium") {
      setModalResource(res);
      if (onRequestAccess) {
        onRequestAccess(res);
      }
    } else {
      // Simulate/trigger free resource download or notebook open
      if (res.externalUrl && res.externalUrl !== "#") {
        window.open(res.externalUrl, "_blank");
      } else {
        alert(`Opening "${res.title}". In production this opens the repository or downloadable ${res.format} file.`);
      }
    }
  };

  return (
    <section id="resources" className="py-16 sm:py-20 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Knowledge Vault
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Learning Resources
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Curated notes, downloadable PDF cheat sheets, practical Jupyter notebooks, authentic practice datasets, and assignments organized by topic.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-card border border-border p-4 sm:p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, keyword, or tool..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
              />
            </div>

            {/* Category and Access filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-background border border-border text-foreground focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-background border border-border text-foreground focus:outline-none"
              >
                {accessTiers.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Pill Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
            {resourceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-colors border ${
                  selectedType === type.value
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "bg-background text-muted-foreground border-border hover:border-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground">No resources match your filters.</p>
            <p className="text-sm text-muted-foreground mt-1">Try resetting the search query or category filters.</p>
            <button
              onClick={() => {
                setSelectedType("all");
                setSelectedCategory("all");
                setSelectedAccess("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 text-xs font-medium bg-foreground text-background"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const isPremium = resource.access === "Premium";
              return (
                <div
                  key={resource.id}
                  className="flex flex-col justify-between bg-card border border-border p-6 rounded-none transition-all hover:border-primary/50 shadow-sm"
                >
                  <div>
                    {/* Top Row: Icon + Access Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="p-2.5 bg-muted/60 border border-border/40">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-muted text-muted-foreground border border-border">
                          {resource.format}
                        </span>
                        {isPremium ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                            <Lock className="h-3 w-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                            Free
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Topic and Title */}
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {resource.category} • {resource.topic}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-muted/40 text-muted-foreground border border-border/50">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                    {resource.fileSize && (
                      <span className="text-muted-foreground">Size: {resource.fileSize}</span>
                    )}
                    <button
                      onClick={() => handleResourceClick(resource)}
                      className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${
                        isPremium
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      {isPremium ? (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Request Access</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Access Free</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Premium Resource Inquiry */}
        {modalResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Resource Access
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {modalResource.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                This guided material is part of our comprehensive mentoring program. While introductory lessons and notes are completely free, advanced tutorials and curated capstones are paired with 1-on-1 feedback sessions.
              </p>

              <div className="bg-muted/40 border border-border p-4 mb-6 space-y-2 text-xs text-muted-foreground">
                <p><strong>Format:</strong> {modalResource.format}</p>
                <p><strong>Category:</strong> {modalResource.category} ({modalResource.topic})</p>
                <p><strong>Access Model:</strong> Mentorship Cohorts & Guided Projects</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact-registration"
                  onClick={() => setModalResource(null)}
                  className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-2.5 px-5 text-sm font-medium transition-colors"
                >
                  Inquire via Contact Form
                </a>
                <button
                  onClick={() => setModalResource(null)}
                  className="py-2.5 px-5 text-sm font-medium border border-border text-foreground hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
