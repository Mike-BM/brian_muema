"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Trash2, Settings, FileText } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  filterCategory: string;
  technologies: string[];
  link: string;
  github: string;
  image: string | null;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [cvMessage, setCvMessage] = useState({ text: "", type: "" });
  
  const [maintenance, setMaintenance] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    filterCategory: "Data Analysis",
    technologies: "",
    link: "",
    github: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setMaintenance(data.maintenance);
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === 'image') setImageFile(e.target.files[0]);
      if (e.target.name === 'cv') setCvFile(e.target.files[0]);
    }
  };

  const handleMaintenanceToggle = async () => {
    const newValue = !maintenance;
    setMaintenance(newValue);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenance: newValue }),
      });
    } catch (error) {
      console.error('Failed to update maintenance mode', error);
      setMaintenance(!newValue); // revert
    }
  };

  const handleCvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;
    
    setCvMessage({ text: "Uploading...", type: "" });
    const data = new FormData();
    data.append('cv', cvFile);

    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setCvMessage({ text: "CV updated successfully!", type: "success" });
        setCvFile(null);
        const fileInput = document.getElementById('cv') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const errData = await res.json();
        setCvMessage({ text: errData.error || "Failed to upload CV", type: "error" });
      }
    } catch {
      setCvMessage({ text: "An error occurred", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setMessage({ text: "Project added successfully!", type: "success" });
        setFormData({
          title: "",
          description: "",
          category: "",
          filterCategory: "Data Analysis",
          technologies: "",
          link: "",
          github: ""
        });
        setImageFile(null);
        // Reset file input visually
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchProjects();
      } else {
        const errData = await res.json();
        setMessage({ text: errData.error || "Failed to add project", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground">Manage your portfolio projects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Site Settings & CV */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Maintenance Mode */}
            <div className="bg-card border border-border p-6 rounded-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center mb-1">
                  <Settings className="mr-2 h-5 w-5" /> Maintenance Mode
                </h2>
                <p className="text-sm text-muted-foreground">
                  When enabled, visitors will see a &quot;Site under maintenance&quot; screen.
                </p>
              </div>
              <button
                onClick={handleMaintenanceToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  maintenance ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    maintenance ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* CV Upload */}
            <div className="bg-card border border-border p-6 rounded-lg">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <FileText className="mr-2 h-5 w-5" /> Update CV / Resume
              </h2>
              {cvMessage.text && (
                <div className={`p-3 mb-4 rounded text-xs ${cvMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : cvMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-muted-foreground'}`}>
                  {cvMessage.text}
                </div>
              )}
              <form onSubmit={handleCvUpload} className="flex gap-4 items-end">
                <div className="flex-grow">
                  <label htmlFor="cv" className="block text-sm font-medium mb-1">Upload PDF</label>
                  <input type="file" id="cv" name="cv" accept=".pdf" onChange={handleFileChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <button type="submit" disabled={!cvFile} className="bg-foreground text-background font-medium px-4 py-2 rounded hover:bg-foreground/90 transition-colors disabled:opacity-50">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Project Form */}
          <div className="lg:col-span-1 bg-card border border-border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Plus className="mr-2 h-5 w-5" /> Add New Project
            </h2>
            
            {message.text && (
              <div className={`p-4 mb-6 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                <input required type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
                <textarea required id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category Label (e.g. Data Science / AI) *</label>
                <input required type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label htmlFor="filterCategory" className="block text-sm font-medium mb-1">Filter Category *</label>
                <select required id="filterCategory" name="filterCategory" value={formData.filterCategory} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary">
                  <option value="All">All</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              <div>
                <label htmlFor="technologies" className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
                <input type="text" id="technologies" name="technologies" value={formData.technologies} onChange={handleInputChange} placeholder="Python, React, API" className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="link" className="block text-sm font-medium mb-1">Project Link</label>
                  <input type="text" id="link" name="link" value={formData.link} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium mb-1">GitHub Link</label>
                  <input type="text" id="github" name="github" value={formData.github} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">Project Image</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <button disabled={submitting} type="submit" className="w-full bg-foreground text-background font-medium py-2 rounded hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4">
                {submitting ? "Saving..." : "Add Project"}
              </button>
            </form>
          </div>

          {/* Existing Projects List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Existing Projects</h2>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
                No projects found. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center group">
                    <div className="h-16 w-24 bg-muted flex-shrink-0 rounded overflow-hidden relative">
                      {project.image ? (
                        <Image fill src={project.image} alt={project.title} className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No image</div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-bold text-foreground">{project.title}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-md">{project.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">{project.filterCategory}</span>
                      </div>
                    </div>
                    
                    <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Project (Not implemented)">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
