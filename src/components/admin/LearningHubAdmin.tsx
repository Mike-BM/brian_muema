"use client";

import { useState, useEffect } from "react";
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
  MapPin
} from "lucide-react";
import { LearningResource, Workshop, ResourcePlatform } from "@/lib/learning-hub-types";

export function LearningHubAdmin() {
  const [activeTab, setActiveTab] = useState<"upload-resource" | "add-workshop" | "manage-content">("upload-resource");
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/learning-hub?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
        setWorkshops(data.workshops || []);
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
        setMessage({ text: "Workshop created successfully with Google Meet integration!", type: "success" });
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

  const handleDelete = async (id: string, type: "resource" | "workshop") => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

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
    <div className="bg-card border border-border rounded-none shadow-sm p-6 sm:p-8 mt-8">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Learning Hub Studio
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Manage Student Content, Workshops & Meet Links
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload new lesson materials, attach Google Meet links for live sessions, and link to external knowledge sites.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("upload-resource")}
            className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "upload-resource"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload Material
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("add-workshop")}
            className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "add-workshop"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Schedule Workshop / Meet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manage-content")}
            className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "manage-content"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manage Existing ({resources.length + workshops.length})
          </button>
        </div>
      </div>

      {/* Global Message Banner */}
      {message.text && (
        <div
          className={`p-4 my-6 text-sm flex items-center gap-2.5 border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* TAB 1: UPLOAD LEARNING RESOURCE */}
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
                <option value="Premium">Premium / Guided Mentorship</option>
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
                Uploaded files are stored in public/uploads/learning-hub/ and committed to GitHub.
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
                placeholder="e.g. Economics & Statistics Coursemates, Aspiring Data Analysts"
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

          {/* Schedule & Meeting Details */}
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
                    location: fmt === "Online" ? "Google Meet" : "Campus Lab",
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
                  Google Meet URL
                </label>
                <input
                  type="url"
                  value={workshopForm.meetUrl}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, meetUrl: e.target.value })}
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  className="w-full p-2.5 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                />
                <p className="text-[11px] text-muted-foreground">
                  Students will see a prominent &ldquo;Join Google Meet&rdquo; button on the workshop card.
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
                <option value="upcoming">Upcoming (Registration Active)</option>
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

      {/* TAB 3: MANAGE EXISTING CONTENT */}
      {activeTab === "manage-content" && (
        <div className="space-y-8 pt-6">
          {/* Workshops List */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Workshops & Meet Sessions ({workshops.length})
            </h3>
            {workshops.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workshops found.</p>
            ) : (
              <div className="space-y-3">
                {workshops.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-foreground">{w.title}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border">
                          {w.date}
                        </span>
                        {w.meetUrl && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Meet Attached
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                          {w.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{w.description}</p>
                      {w.meetUrl && (
                        <a
                          href={w.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1 font-mono"
                        >
                          <Video className="h-3 w-3" />
                          {w.meetUrl}
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(w.id, "workshop")}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors self-end sm:self-center"
                      title="Delete workshop"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources List */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Learning Resources & Notes ({resources.length})
            </h3>
            {resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {resources.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-background border border-border flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-semibold text-foreground line-clamp-1">{r.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
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
                          {r.externalUrl.substring(0, 35)}...
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
                          Local Uploaded File
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(r.id, "resource")}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete resource"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
