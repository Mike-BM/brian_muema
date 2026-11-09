"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  Video, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  Layers,
  MapPin,
  Users,
  GraduationCap,
  FolderGit2,
  ShieldCheck,
  Quote,
  Eye,
  Search
} from "lucide-react";
import { 
  LearningResource, 
  Workshop, 
  ResourcePlatform, 
  LearnerShowcase, 
  PracticalProject 
} from "@/lib/learning-hub-types";

export function LearningHubAdmin() {
  const [activeTab, setActiveTab] = useState<
    "upload-resource" | "add-workshop" | "add-showcase" | "add-project" | "manage-content"
  >("upload-resource");

  const [resources, setResources] = useState<LearningResource[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [projects, setProjects] = useState<PracticalProject[]>([]);
  const [learnerShowcases, setLearnerShowcases] = useState<LearnerShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [manageFilter, setManageFilter] = useState<"all" | "resources" | "workshops" | "showcases" | "projects">("all");

  // Resource Form State
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    category: "Data Analysis",
    type: "notes",
    access: "Free",
    format: "PDF",
    topic: "",
    platform: "Local Download" as ResourcePlatform,
    externalUrl: "",
    tags: "",
  });
  const [resourceFile, setResourceFile] = useState<File | null>(null);

  // Workshop Form State
  const [workshopForm, setWorkshopForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "14:00 - 16:30 EAT",
    format: "Online",
    location: "Google Meet",
    meetUrl: "",
    recordingUrl: "",
    status: "upcoming",
    access: "Free",
    targetAudience: "Coursemates & Students",
    objectives: "Master data preparation workflows\nWrite vectorized Pandas queries\nLive interactive Q&A",
    highlightRecap: "",
  });

  // Learner Showcase Form State
  const [showcaseForm, setShowcaseForm] = useState({
    learnerName: "",
    role: "Computer Science Coursemate",
    cohort: "Cohort 2024 / Campus Tech Hub",
    projectTitle: "",
    description: "",
    technologies: "Python, Pandas, Matplotlib, Streamlit",
    githubUrl: "",
    liveUrl: "",
    quote: "Brian broke down complex data manipulation concepts into actionable steps that helped me complete this project.",
    publishedWithConsent: true,
  });
  const [showcaseImage, setShowcaseImage] = useState<File | null>(null);

  // Practical Project Form State
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Data Analysis",
    difficulty: "Beginner",
    access: "Free",
    problemStatement: "",
    datasetName: "Cleaned E-Commerce Logs",
    datasetDescription: "Real transaction data containing timestamps, customer IDs, and orders.",
    datasetUrl: "",
    datasetSize: "2.4 MB CSV",
    technologies: "Python, Pandas, Seaborn",
    stepByStepInstructions: "Step 1: Load CSV and inspect missing values\nStep 2: Aggregate monthly purchase frequencies\nStep 3: Plot cohort heatmap with Seaborn",
    expectedOutput: "Cleaned cohort retention matrix\nActionable markdown churn analysis summary",
    githubUrl: "",
    resourceLink: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/learning-hub?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
        setWorkshops(data.workshops || []);
        setProjects(data.projects || []);
        setLearnerShowcases(data.learnerShowcase || []);
      }
    } catch (err) {
      console.error("Failed to fetch learning hub data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.description) {
      setMessage({ text: "Title and description are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("entityType", "resource");
    formData.append("title", resourceForm.title);
    formData.append("description", resourceForm.description);
    formData.append("category", resourceForm.category);
    formData.append("type", resourceForm.type);
    formData.append("access", resourceForm.access);
    formData.append("format", resourceForm.format);
    formData.append("topic", resourceForm.topic || "General");
    formData.append("platform", resourceForm.platform);
    formData.append("externalUrl", resourceForm.externalUrl);
    formData.append("tags", resourceForm.tags);

    if (resourceFile) {
      formData.append("file", resourceFile);
    }

    try {
      const res = await fetch("/api/learning-hub", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage({ text: "Learning material uploaded successfully!", type: "success" });
        setResourceForm({
          title: "",
          description: "",
          category: "Data Analysis",
          type: "notes",
          access: "Free",
          format: "PDF",
          topic: "",
          platform: "Local Download",
          externalUrl: "",
          tags: "",
        });
        setResourceFile(null);
        const fileInput = document.getElementById("resource-file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchData();
      } else {
        const err = await res.json();
        setMessage({ text: err.error || "Failed to upload resource.", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred while uploading.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWorkshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopForm.title || !workshopForm.description) {
      setMessage({ text: "Workshop title and description are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("entityType", "workshop");
    formData.append("title", workshopForm.title);
    formData.append("description", workshopForm.description);
    formData.append("date", workshopForm.date);
    formData.append("time", workshopForm.time);
    formData.append("format", workshopForm.format);
    formData.append("location", workshopForm.location);
    formData.append("meetUrl", workshopForm.meetUrl);
    formData.append("recordingUrl", workshopForm.recordingUrl);
    formData.append("status", workshopForm.status);
    formData.append("access", workshopForm.access);
    formData.append("targetAudience", workshopForm.targetAudience);
    formData.append("objectives", workshopForm.objectives);
    formData.append("highlightRecap", workshopForm.highlightRecap);

    try {
      const res = await fetch("/api/learning-hub", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage({ text: "Workshop created successfully with Google Meet link!", type: "success" });
        setWorkshopForm({
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          time: "14:00 - 16:30 EAT",
          format: "Online",
          location: "Google Meet",
          meetUrl: "",
          recordingUrl: "",
          status: "upcoming",
          access: "Free",
          targetAudience: "Coursemates & Students",
          objectives: "Master data preparation workflows\nWrite vectorized Pandas queries\nLive interactive Q&A",
          highlightRecap: "",
        });
        fetchData();
      } else {
        const err = await res.json();
        setMessage({ text: err.error || "Failed to create workshop.", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred while creating workshop.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowcaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseForm.learnerName || !showcaseForm.projectTitle || !showcaseForm.description) {
      setMessage({ text: "Learner name, project title, and description are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("entityType", "showcase");
    formData.append("learnerName", showcaseForm.learnerName);
    formData.append("role", showcaseForm.role);
    formData.append("cohort", showcaseForm.cohort);
    formData.append("projectTitle", showcaseForm.projectTitle);
    formData.append("description", showcaseForm.description);
    formData.append("technologies", showcaseForm.technologies);
    formData.append("githubUrl", showcaseForm.githubUrl);
    formData.append("liveUrl", showcaseForm.liveUrl);
    formData.append("quote", showcaseForm.quote);
    formData.append("publishedWithConsent", showcaseForm.publishedWithConsent ? "true" : "false");

    if (showcaseImage) {
      formData.append("image", showcaseImage);
    }

    try {
      const res = await fetch("/api/learning-hub", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage({ text: "Learner showcase project published successfully!", type: "success" });
        setShowcaseForm({
          learnerName: "",
          role: "Computer Science Coursemate",
          cohort: "Cohort 2024 / Campus Tech Hub",
          projectTitle: "",
          description: "",
          technologies: "Python, Pandas, Matplotlib, Streamlit",
          githubUrl: "",
          liveUrl: "",
          quote: "Brian broke down complex data manipulation concepts into actionable steps that helped me complete this project.",
          publishedWithConsent: true,
        });
        setShowcaseImage(null);
        const fileInput = document.getElementById("showcase-image-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchData();
      } else {
        const err = await res.json();
        setMessage({ text: err.error || "Failed to publish showcase.", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred while publishing showcase.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.problemStatement) {
      setMessage({ text: "Project title and problem statement are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("entityType", "project");
    formData.append("title", projectForm.title);
    formData.append("category", projectForm.category);
    formData.append("difficulty", projectForm.difficulty);
    formData.append("access", projectForm.access);
    formData.append("problemStatement", projectForm.problemStatement);
    formData.append("datasetName", projectForm.datasetName);
    formData.append("datasetDescription", projectForm.datasetDescription);
    formData.append("datasetUrl", projectForm.datasetUrl);
    formData.append("datasetSize", projectForm.datasetSize);
    formData.append("technologies", projectForm.technologies);
    formData.append("stepByStepInstructions", projectForm.stepByStepInstructions);
    formData.append("expectedOutput", projectForm.expectedOutput);
    formData.append("githubUrl", projectForm.githubUrl);
    formData.append("resourceLink", projectForm.resourceLink);

    try {
      const res = await fetch("/api/learning-hub", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage({ text: "Practical hands-on project created successfully!", type: "success" });
        setProjectForm({
          title: "",
          category: "Data Analysis",
          difficulty: "Beginner",
          access: "Free",
          problemStatement: "",
          datasetName: "Cleaned E-Commerce Logs",
          datasetDescription: "Real transaction data containing timestamps, customer IDs, and orders.",
          datasetUrl: "",
          datasetSize: "2.4 MB CSV",
          technologies: "Python, Pandas, Seaborn",
          stepByStepInstructions: "Step 1: Load CSV and inspect missing values\nStep 2: Aggregate monthly purchase frequencies\nStep 3: Plot cohort heatmap with Seaborn",
          expectedOutput: "Cleaned cohort retention matrix\nActionable markdown churn analysis summary",
          githubUrl: "",
          resourceLink: "",
        });
        fetchData();
      } else {
        const err = await res.json();
        setMessage({ text: err.error || "Failed to save project.", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred while creating project.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, type: "resource" | "workshop" | "project" | "learnerShowcase") => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;

    try {
      const res = await fetch("/api/learning-hub", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });

      if (res.ok) {
        setMessage({ text: `Successfully deleted ${type}.`, type: "success" });
        fetchData();
      } else {
        setMessage({ text: `Failed to delete ${type}.`, type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred during deletion.", type: "error" });
    }
  };

  return (
    <div className="bg-card border border-border shadow-sm p-6 sm:p-8">
      {/* Module Title & Tab Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Learning Hub Studio
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Student Portal & Content Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Publish downloadable materials, host live Google Meets, showcase your coursemates, and author hands-on data projects.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-muted/50 border border-border text-xs flex items-center gap-1.5 font-medium">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>{resources.length} Materials</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <Video className="h-3.5 w-3.5" />
            <span>{workshops.length} Workshops</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
            <Users className="h-3.5 w-3.5" />
            <span>{learnerShowcases.length} Showcases</span>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-xs flex items-center gap-1.5 font-medium text-purple-700 dark:text-purple-400">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>{projects.length} Projects</span>
          </div>
        </div>
      </div>

      {/* Primary Action Tabs */}
      <div className="flex flex-wrap border-b border-border mt-4">
        <button
          type="button"
          onClick={() => setActiveTab("upload-resource")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "upload-resource"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Material
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("add-workshop")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "add-workshop"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="h-3.5 w-3.5" />
          Schedule Workshop / Meet
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("add-showcase")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "add-showcase"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Add Learner Showcase
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("add-project")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "add-project"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderGit2 className="h-3.5 w-3.5" />
          Add Practical Project
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manage-content")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ml-auto ${
            activeTab === "manage-content"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Manage All Content ({resources.length + workshops.length + learnerShowcases.length + projects.length})
        </button>
      </div>

      {/* Global Status Message */}
      {message.text && (
        <div
          className={`p-4 my-6 text-sm flex items-center justify-between border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            className="text-xs underline hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: UPLOAD LEARNING MATERIAL */}
      {activeTab === "upload-resource" && (
        <form onSubmit={handleResourceSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Material Title *
              </label>
              <input
                type="text"
                required
                value={resourceForm.title}
                onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                placeholder="e.g. Pandas Time Series & Rolling Window Cheatsheet"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Topic / Subject *
              </label>
              <input
                type="text"
                required
                value={resourceForm.topic}
                onChange={(e) => setResourceForm({ ...resourceForm, topic: e.target.value })}
                placeholder="e.g. Exploratory Data Analysis, Feature Engineering"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Brief Description for Students *
            </label>
            <textarea
              required
              rows={3}
              value={resourceForm.description}
              onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
              placeholder="Explain how students should use this material, what problem it solves, and what skills it strengthens..."
              className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Category
              </label>
              <select
                value={resourceForm.category}
                onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Data Analysis">Data Analysis</option>
                <option value="Data Science">Data Science</option>
                <option value="General">General / Foundational</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Resource Type
              </label>
              <select
                value={resourceForm.type}
                onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="notes">Learning Notes / Cheatsheet</option>
                <option value="pdf">Downloadable PDF</option>
                <option value="notebook">Python Jupyter Notebook (.ipynb)</option>
                <option value="dataset">Practice Dataset (.csv / .xlsx)</option>
                <option value="exercise">Exercise / Assignment</option>
                <option value="tutorial">Recorded Tutorial / Video</option>
                <option value="external_guide">External Reference Guide</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Access Tier
              </label>
              <select
                value={resourceForm.access}
                onChange={(e) => setResourceForm({ ...resourceForm, access: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Free">Open / Free Access</option>
                <option value="Premium">Premium / Mentorship Program</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Platform / Host
              </label>
              <select
                value={resourceForm.platform}
                onChange={(e) => setResourceForm({ ...resourceForm, platform: e.target.value as ResourcePlatform })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Local Download">Direct File Upload / Download</option>
                <option value="Google Colab">Google Colab (Interactive Cloud)</option>
                <option value="Kaggle">Kaggle Dataset / Notebook</option>
                <option value="GitHub">GitHub Repository</option>
                <option value="Official Docs">Official Documentation</option>
                <option value="YouTube">YouTube Video</option>
                <option value="Google Drive">Google Drive Folder</option>
                <option value="Web Link">External Web Link</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Format Badge
              </label>
              <input
                type="text"
                value={resourceForm.format}
                onChange={(e) => setResourceForm({ ...resourceForm, format: e.target.value })}
                placeholder="e.g. PDF, Colab, Jupyter (.ipynb), CSV"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={resourceForm.tags}
                onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })}
                placeholder="Python, Pandas, EDA, Colab"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* External URL or Direct File Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 border border-border">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                External Site / Colab / Kaggle URL
              </label>
              <input
                type="url"
                value={resourceForm.externalUrl}
                onChange={(e) => setResourceForm({ ...resourceForm, externalUrl: e.target.value })}
                placeholder="https://colab.research.google.com/... or https://kaggle.com/..."
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
              <p className="text-[11px] text-muted-foreground">
                For Google Colab, Kaggle datasets, GitHub, or YouTube tutorials.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-primary" />
                Attach File for Download (.pdf, .ipynb, .csv, .zip)
              </label>
              <input
                id="resource-file-input"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResourceFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              <p className="text-[11px] text-muted-foreground">
                Files are stored securely in public/uploads/learning-hub/ and committed to your repo.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-3 px-6 text-sm font-semibold transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading Learning Resource...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Publish Resource to Learning Hub</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 2: SCHEDULE WORKSHOP WITH GOOGLE MEET */}
      {activeTab === "add-workshop" && (
        <form onSubmit={handleWorkshopSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Workshop / Session Title *
              </label>
              <input
                type="text"
                required
                value={workshopForm.title}
                onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                placeholder="e.g. Live Exploratory Data Analysis & Case Study Walkthrough"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Target Audience
              </label>
              <input
                type="text"
                value={workshopForm.targetAudience}
                onChange={(e) => setWorkshopForm({ ...workshopForm, targetAudience: e.target.value })}
                placeholder="e.g. Coursemates, University Tech Club, Aspiring Analysts"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Workshop Overview & Description *
            </label>
            <textarea
              required
              rows={3}
              value={workshopForm.description}
              onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
              placeholder="What will you teach in this session? What dataset will be explored live with students?"
              className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Date *
              </label>
              <input
                type="date"
                required
                value={workshopForm.date}
                onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Time Window *
              </label>
              <input
                type="text"
                required
                value={workshopForm.time}
                onChange={(e) => setWorkshopForm({ ...workshopForm, time: e.target.value })}
                placeholder="e.g. 14:00 - 16:30 EAT"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Session Format *
              </label>
              <select
                value={workshopForm.format}
                onChange={(e) => {
                  const fmt = e.target.value;
                  setWorkshopForm({
                    ...workshopForm,
                    format: fmt,
                    location: fmt === "Online" ? "Google Meet" : "Campus Tech Lab",
                  });
                }}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Online">Online Live Session</option>
                <option value="Physical">Physical In-Person Workshop</option>
              </select>
            </div>
          </div>

          {/* Prominent Google Meet Box */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Video className="h-4 w-4" />
              <span>Google Meet Live Integration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Google Meet Link
                </label>
                <input
                  type="url"
                  value={workshopForm.meetUrl}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, meetUrl: e.target.value })}
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Students will see a prominent &ldquo;Join Google Meet&rdquo; button directly on the workshop card.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Location / Physical Venue Note
                </label>
                <input
                  type="text"
                  value={workshopForm.location}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, location: e.target.value })}
                  placeholder="e.g. Google Meet & Live Colab or Campus Lab 3, Nairobi"
                  className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
          </div>

          {/* Objectives & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Key Learning Objectives (one per line)
              </label>
              <textarea
                rows={3}
                value={workshopForm.objectives}
                onChange={(e) => setWorkshopForm({ ...workshopForm, objectives: e.target.value })}
                placeholder="One objective per line..."
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Status & Recap
              </label>
              <select
                value={workshopForm.status}
                onChange={(e) => setWorkshopForm({ ...workshopForm, status: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground mb-2"
              >
                <option value="upcoming">Upcoming (Registration Open)</option>
                <option value="completed">Completed (Show Attendance Recap)</option>
              </select>

              <input
                type="text"
                value={workshopForm.highlightRecap}
                onChange={(e) => setWorkshopForm({ ...workshopForm, highlightRecap: e.target.value })}
                placeholder="Optional recap note e.g. Trained 22 students with 100% project completion"
                className="w-full p-2 bg-background border border-border text-xs text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-3 px-6 text-sm font-semibold transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Scheduling Workshop...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Publish Workshop to Hub</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 3: ADD LEARNER SHOWCASE (COURSEMATE ACHIEVEMENTS) */}
      {activeTab === "add-showcase" && (
        <form onSubmit={handleShowcaseSubmit} className="space-y-6 pt-6">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
            <span>
              Learner contributions are published with their verified consent to showcase peer growth and real project outcomes.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Learner / Coursemate Name *
              </label>
              <input
                type="text"
                required
                value={showcaseForm.learnerName}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, learnerName: e.target.value })}
                placeholder="e.g. Grace Wanjiku"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Role / Field *
              </label>
              <input
                type="text"
                required
                value={showcaseForm.role}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, role: e.target.value })}
                placeholder="e.g. Economics & Finance Student"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Cohort / Training Context *
              </label>
              <input
                type="text"
                required
                value={showcaseForm.cohort}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, cohort: e.target.value })}
                placeholder="e.g. Cohort 2024 / Campus Tech Hub"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={showcaseForm.projectTitle}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, projectTitle: e.target.value })}
                placeholder="e.g. Mobile Money Fraud Detection Model"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Technologies Used (comma separated)
              </label>
              <input
                type="text"
                value={showcaseForm.technologies}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, technologies: e.target.value })}
                placeholder="Python, Pandas, Scikit-Learn, Streamlit"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Project Description *
            </label>
            <textarea
              required
              rows={3}
              value={showcaseForm.description}
              onChange={(e) => setShowcaseForm({ ...showcaseForm, description: e.target.value })}
              placeholder="What did the learner build? What dataset did they use and what was the outcome?"
              className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground resize-none"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Learner Quote / Feedback
            </label>
            <textarea
              rows={2}
              value={showcaseForm.quote}
              onChange={(e) => setShowcaseForm({ ...showcaseForm, quote: e.target.value })}
              placeholder="What did the student say about your training and mentorship?"
              className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={showcaseForm.githubUrl}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Live App / Demo URL (Optional)
              </label>
              <input
                type="url"
                value={showcaseForm.liveUrl}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, liveUrl: e.target.value })}
                placeholder="https://...streamlit.app"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-muted/20 border border-border">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Project Image / Screenshot
              </label>
              <input
                id="showcase-image-input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setShowcaseImage(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 sm:pt-0">
              <input
                type="checkbox"
                id="consent-check"
                checked={showcaseForm.publishedWithConsent}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, publishedWithConsent: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="consent-check" className="text-xs font-medium text-foreground cursor-pointer">
                Verified learner permission obtained to showcase project and quotes.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-3 px-6 text-sm font-semibold transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing Showcase...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add to Learner Showcase</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 4: ADD PRACTICAL PROJECT */}
      {activeTab === "add-project" && (
        <form onSubmit={handleProjectSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Practical Project Title *
              </label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. Retail Customer Churn Prediction Pipeline"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Category *
              </label>
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Data Analysis">Data Analysis</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Problem Statement *
            </label>
            <textarea
              required
              rows={3}
              value={projectForm.problemStatement}
              onChange={(e) => setProjectForm({ ...projectForm, problemStatement: e.target.value })}
              placeholder="State the real-world business or analytics challenge students will solve..."
              className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Difficulty Level
              </label>
              <select
                value={projectForm.difficulty}
                onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Access Model
              </label>
              <select
                value={projectForm.access}
                onChange={(e) => setProjectForm({ ...projectForm, access: e.target.value })}
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="Free">Free Practical Lab</option>
                <option value="Premium">Premium Mentorship Capstone</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                placeholder="Python, Pandas, Scikit-Learn"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/20 border border-border">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Dataset Name & Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={projectForm.datasetName}
                  onChange={(e) => setProjectForm({ ...projectForm, datasetName: e.target.value })}
                  placeholder="e.g. Telco Churn CSV"
                  className="w-full p-2 bg-background border border-border text-xs text-foreground focus:outline-none focus:border-foreground"
                />
                <input
                  type="text"
                  value={projectForm.datasetSize}
                  onChange={(e) => setProjectForm({ ...projectForm, datasetSize: e.target.value })}
                  placeholder="e.g. 3.2 MB"
                  className="w-full p-2 bg-background border border-border text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Dataset Download / Kaggle URL
              </label>
              <input
                type="url"
                value={projectForm.datasetUrl}
                onChange={(e) => setProjectForm({ ...projectForm, datasetUrl: e.target.value })}
                placeholder="https://kaggle.com/... or Google Drive"
                className="w-full p-2.5 bg-background border border-border text-xs text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Step-by-Step Instructions (one per line)
              </label>
              <textarea
                rows={4}
                value={projectForm.stepByStepInstructions}
                onChange={(e) => setProjectForm({ ...projectForm, stepByStepInstructions: e.target.value })}
                placeholder="Step 1: Clean data&#10;Step 2: Engineer features&#10;Step 3: Evaluate model"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Expected Output / Deliverables (one per line)
              </label>
              <textarea
                rows={4}
                value={projectForm.expectedOutput}
                onChange={(e) => setProjectForm({ ...projectForm, expectedOutput: e.target.value })}
                placeholder="Deliverable 1: Cleaned CSV&#10;Deliverable 2: ROC-AUC > 0.85"
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                GitHub Starter Repository URL
              </label>
              <input
                type="url"
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Google Colab / Additional Guide Link
              </label>
              <input
                type="url"
                value={projectForm.resourceLink}
                onChange={(e) => setProjectForm({ ...projectForm, resourceLink: e.target.value })}
                placeholder="https://colab.research.google.com/..."
                className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-3 px-6 text-sm font-semibold transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Project...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Publish Project to Learning Hub</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 5: MANAGE ALL CONTENT */}
      {activeTab === "manage-content" && (
        <div className="space-y-6 pt-6">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-muted/30 border border-border">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setManageFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium border ${
                  manageFilter === "all"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                All Items ({resources.length + workshops.length + learnerShowcases.length + projects.length})
              </button>
              <button
                type="button"
                onClick={() => setManageFilter("resources")}
                className={`px-3 py-1.5 text-xs font-medium border ${
                  manageFilter === "resources"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                Materials ({resources.length})
              </button>
              <button
                type="button"
                onClick={() => setManageFilter("workshops")}
                className={`px-3 py-1.5 text-xs font-medium border ${
                  manageFilter === "workshops"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                Workshops ({workshops.length})
              </button>
              <button
                type="button"
                onClick={() => setManageFilter("showcases")}
                className={`px-3 py-1.5 text-xs font-medium border ${
                  manageFilter === "showcases"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                Showcases ({learnerShowcases.length})
              </button>
              <button
                type="button"
                onClick={() => setManageFilter("projects")}
                className={`px-3 py-1.5 text-xs font-medium border ${
                  manageFilter === "projects"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                Projects ({projects.length})
              </button>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter titles..."
                className="pl-8 pr-3 py-1.5 bg-background border border-border text-xs text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Section: Workshops */}
          {(manageFilter === "all" || manageFilter === "workshops") && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Video className="h-4 w-4 text-emerald-600" />
                Workshops & Google Meet Sessions ({workshops.length})
              </h3>
              {workshops.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No workshops scheduled yet.</p>
              ) : (
                <div className="space-y-2">
                  {workshops
                    .filter((w) => w.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((w) => (
                      <div
                        key={w.id}
                        className="p-4 bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-foreground text-sm">{w.title}</span>
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground border text-[10px]">
                              {w.date} • {w.time}
                            </span>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px]">
                              {w.format}
                            </span>
                            {w.meetUrl && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] flex items-center gap-1 font-semibold">
                                <Video className="h-3 w-3" />
                                Meet Attached
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground line-clamp-1">{w.description}</p>
                          {w.meetUrl && (
                            <a
                              href={w.meetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {w.meetUrl}
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(w.id, "workshop")}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors self-end sm:self-center"
                          title="Delete workshop"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Learning Resources */}
          {(manageFilter === "all" || manageFilter === "resources") && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Learning Resources & Student Notes ({resources.length})
              </h3>
              {resources.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No learning resources uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resources
                    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-3 bg-background border border-border flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-semibold text-foreground line-clamp-1">{r.title}</span>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{r.category}</span>
                            <span>•</span>
                            <span>{r.format}</span>
                            {r.platform && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-medium">{r.platform}</span>
                              </>
                            )}
                          </div>
                          {r.externalUrl && (
                            <a
                              href={r.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-[10px]"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {r.externalUrl.substring(0, 32)}...
                            </a>
                          )}
                          {r.fileUrl && (
                            <a
                              href={r.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                            >
                              <Download className="h-3 w-3" />
                              Local Upload ({r.fileSize || "File"})
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(r.id, "resource")}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete resource"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Learner Showcase */}
          {(manageFilter === "all" || manageFilter === "showcases") && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-600" />
                Learner Showcase Entries ({learnerShowcases.length})
              </h3>
              {learnerShowcases.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No learner showcase entries published yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {learnerShowcases
                    .filter((s) => (s.projectTitle + s.learnerName).toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((s) => (
                      <div
                        key={s.id}
                        className="p-3 bg-background border border-border flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{s.projectTitle}</span>
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[9px] font-semibold">
                              {s.learnerName}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{s.description}</p>
                          <p className="text-[10px] text-muted-foreground italic">&ldquo;{s.quote.substring(0, 60)}...&rdquo;</p>
                          {s.githubUrl && (
                            <a
                              href={s.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-[10px]"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {s.githubUrl}
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(s.id, "learnerShowcase")}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete showcase"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Practical Projects */}
          {(manageFilter === "all" || manageFilter === "projects") && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-purple-600" />
                Practical Guided Projects ({projects.length})
              </h3>
              {projects.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No practical projects added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects
                    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-background border border-border flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{p.title}</span>
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 text-[9px] font-semibold">
                              {p.difficulty}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{p.problemStatement}</p>
                          <div className="text-[10px] text-muted-foreground">
                            <span>Dataset: {p.datasetName}</span>
                          </div>
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono text-[10px]"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {p.githubUrl}
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(p.id, "project")}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
