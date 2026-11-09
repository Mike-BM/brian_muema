"use client";

import { useState } from "react";
import { 
  ExternalLink, 
  BookOpen, 
  Code2, 
  Database, 
  FileText, 
  Globe, 
  Sparkles, 
  ArrowUpRight, 
  Terminal 
} from "lucide-react";
import { ExternalKnowledgeSite } from "@/lib/learning-hub-types";

interface ExternalKnowledgeSectionProps {
  sites?: ExternalKnowledgeSite[];
}

const defaultSites: ExternalKnowledgeSite[] = [
  {
    id: "site-colab",
    name: "Google Colab",
    description: "Zero-configuration cloud Jupyter environment with free GPU access, ideal for running data analysis and training ML models without local setup.",
    url: "https://colab.research.google.com",
    category: "Interactive Coding & Notebooks",
    badge: "Cloud Notebooks",
    iconType: "colab",
  },
  {
    id: "site-kaggle",
    name: "Kaggle Datasets & Community",
    description: "Explore over 300,000 public datasets, participate in data competitions, and review community Python notebooks and case studies.",
    url: "https://www.kaggle.com",
    category: "Datasets & Challenges",
    badge: "Datasets & ML",
    iconType: "kaggle",
  },
  {
    id: "site-scikit",
    name: "Scikit-Learn Official User Guide",
    description: "The definitive resource for Python machine learning algorithms, model evaluation metrics, preprocessing pipelines, and practical API documentation.",
    url: "https://scikit-learn.org/stable/user_guide.html",
    category: "Official Documentation",
    badge: "Machine Learning",
    iconType: "docs",
  },
  {
    id: "site-pandas",
    name: "Pandas Official Documentation",
    description: "Comprehensive reference guide for data structures, DataFrame transformations, indexing, grouped aggregations, and reshaping operations.",
    url: "https://pandas.pydata.org/docs/user_guide/index.html",
    category: "Official Documentation",
    badge: "Data Analysis",
    iconType: "docs",
  },
  {
    id: "site-github",
    name: "Brian's GitHub Code Repositories",
    description: "Access open-source code repositories, starter templates, notebooks, and scripts referenced throughout the learning paths and workshop sessions.",
    url: "https://github.com/Mike-BM",
    category: "Interactive Coding & Notebooks",
    badge: "Source Code",
    iconType: "github",
  },
  {
    id: "site-towards",
    name: "Towards Data Science & Real Python",
    description: "Curated industry publications and tutorial archives exploring algorithmic design, data science architecture, and real-world analytics case studies.",
    url: "https://towardsdatascience.com",
    category: "Articles & Research",
    badge: "Industry Insights",
    iconType: "web",
  },
];

export function ExternalKnowledgeSection({ sites = defaultSites }: ExternalKnowledgeSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Interactive Coding & Notebooks",
    "Datasets & Challenges",
    "Official Documentation",
    "Articles & Research",
  ];

  const filteredSites = sites.filter(
    (s) => selectedCategory === "All" || s.category === selectedCategory
  );

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case "colab":
        return <Terminal className="h-5 w-5 text-amber-500" />;
      case "kaggle":
        return <Database className="h-5 w-5 text-cyan-500" />;
      case "docs":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "github":
        return <Code2 className="h-5 w-5 text-foreground" />;
      default:
        return <Globe className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <section id="external-knowledge" className="py-16 sm:py-20 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Ecosystem & References
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            External Knowledge & Learning Sites
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Curated platforms, official documentation, cloud notebook engines, and dataset repositories that I frequently recommend to my students and coursemates.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium transition-colors border ${
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-card text-muted-foreground border-border hover:border-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between bg-card border border-border p-6 rounded-none transition-all hover:border-primary/50 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-2.5 bg-muted/60 border border-border/40">
                    {getPlatformIcon(site.iconType)}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                    {site.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {site.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {site.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate">{site.category}</span>
                <span className="text-primary font-medium group-hover:underline">Visit Platform &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
