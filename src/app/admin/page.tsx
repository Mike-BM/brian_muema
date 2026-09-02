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
  projectType?: string;
}

interface Certification {
  id: string;
  institution: string;
  course: string;
  year: string;
  certificateUrl: string;
}

interface Experience {
  id: string;
  role: string;
  organization: string;
  description: string;
  dateJoined: string;
  refereeNumber: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittingCert, setSubmittingCert] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [certMessage, setCertMessage] = useState({ text: "", type: "" });
  const [cvMessage, setCvMessage] = useState({ text: "", type: "" });
  const [aboutMessage, setAboutMessage] = useState({ text: "", type: "" });
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [submittingExp, setSubmittingExp] = useState(false);
  const [expMessage, setExpMessage] = useState({ text: "", type: "" });
  
  const [credentialsData, setCredentialsData] = useState({ username: "", password: "", email: "" });
  const [credentialsMessage, setCredentialsMessage] = useState({ text: "", type: "" });

  const [maintenance, setMaintenance] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [aboutContent, setAboutContent] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    filterCategory: "Data Analysis",
    technologies: "",
    link: "",
    github: "",
    liveUrl: "",
    projectType: "Professional"
  });
  const [certFormData, setCertFormData] = useState({
    institution: "",
    course: "",
    year: "",
    certificateUrl: ""
  });
  const [expFormData, setExpFormData] = useState({
    role: "",
    organization: "",
    description: "",
    dateJoined: "",
    refereeNumber: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [certImageFile, setCertImageFile] = useState<File | null>(null);

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

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) {
        const data = await res.json();
        setCertifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch certifications', error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Failed to fetch experiences', error);
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

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setAboutContent(data.content || "");
      }
    } catch (error) {
      console.error('Failed to fetch about data', error);
    }
  };

  const fetchCredentials = async () => {
    try {
      const res = await fetch('/api/credentials');
      if (res.ok) {
        const data = await res.json();
        setCredentialsData(prev => ({ ...prev, email: data.email || "", username: data.username || "" }));
      }
    } catch (error) {
      console.error('Failed to fetch credentials', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
     
    fetchCertifications();
     
    fetchSettings();
     
    fetchAbout();
     
    fetchExperiences();
     
    if (isAuthenticated) fetchCredentials();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        const errData = await res.json();
        setLoginError(errData.error || "Invalid username or password");
      }
    } catch {
      setLoginError("An error occurred");
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsMessage({ text: "Saving...", type: "" });
    try {
      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialsData),
      });
      if (res.ok) {
        setCredentialsMessage({ text: "Settings updated successfully!", type: "success" });
        setCredentialsData(prev => ({ ...prev, password: "" })); // clear password field
      } else {
        setCredentialsMessage({ text: "Failed to update settings", type: "error" });
      }
    } catch {
      setCredentialsMessage({ text: "An error occurred", type: "error" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCertInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCertFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === 'image') setImageFile(e.target.files[0]);
      if (e.target.name === 'cv') setCvFile(e.target.files[0]);
      if (e.target.name === 'certImage') setCertImageFile(e.target.files[0]);
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

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutMessage({ text: "Saving...", type: "" });
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: aboutContent }),
      });
      if (res.ok) {
        setAboutMessage({ text: "About section updated!", type: "success" });
      } else {
        setAboutMessage({ text: "Failed to update About section", type: "error" });
      }
    } catch {
      setAboutMessage({ text: "An error occurred", type: "error" });
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCert(true);
    setCertMessage({ text: "", type: "" });

    const data = new FormData();
    Object.entries(certFormData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    if (certImageFile) {
      data.append('image', certImageFile);
    }

    try {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setCertMessage({ text: "Certification added successfully!", type: "success" });
        setCertFormData({
          institution: "",
          course: "",
          year: "",
          certificateUrl: ""
        });
        setCertImageFile(null);
        
        const fileInput = document.getElementById('certImage') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchCertifications();
      } else {
        const errData = await res.json();
        setCertMessage({ text: errData.error || "Failed to add certification", type: "error" });
      }
    } catch {
      setCertMessage({ text: "An error occurred", type: "error" });
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingExp(true);
    setExpMessage({ text: "", type: "" });

    const data = new FormData();
    Object.entries(expFormData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setExpMessage({ text: "Experience added successfully!", type: "success" });
        setExpFormData({
          role: "",
          organization: "",
          description: "",
          dateJoined: "",
          refereeNumber: ""
        });
        fetchExperiences();
      } else {
        const errData = await res.json();
        setExpMessage({ text: errData.error || "Failed to add experience", type: "error" });
      }
    } catch {
      setExpMessage({ text: "An error occurred", type: "error" });
    } finally {
      setSubmittingExp(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    const data = new FormData();
    data.append('action', 'delete');
    data.append('id', id);
    try {
      const res = await fetch('/api/experiences', { method: 'POST', body: data });
      if (res.ok) fetchExperiences();
    } catch (error) {
      console.error('Failed to delete experience', error);
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
          github: "",
          liveUrl: "",
          projectType: "Professional"
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-card border border-border p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-foreground mb-6">Admin Access</h1>
          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full p-3 bg-background border border-border rounded focus:outline-none focus:border-primary"
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 bg-background border border-border rounded focus:outline-none focus:border-primary"
            />
            <button 
              type="submit"
              className="w-full bg-foreground text-background font-medium py-3 rounded hover:bg-foreground/90 transition-colors"
            >
              Login
            </button>
          </form>
          <Link href="/" className="inline-block mt-6 text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

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
            
            {/* About Section Editor */}
            <div className="bg-card border border-border p-6 rounded-lg md:col-span-2">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <FileText className="mr-2 h-5 w-5" /> Edit About Section
              </h2>
              {aboutMessage.text && (
                <div className={`p-3 mb-4 rounded text-xs ${aboutMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : aboutMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-muted-foreground'}`}>
                  {aboutMessage.text}
                </div>
              )}
              <form onSubmit={handleAboutSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="aboutContent" className="block text-sm font-medium mb-1">About Me Text (Supports **bold**)</label>
                  <textarea id="aboutContent" rows={5} value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
                <button type="submit" className="bg-foreground text-background font-medium px-4 py-2 rounded hover:bg-foreground/90 transition-colors self-start">
                  Save Changes
                </button>
              </form>
            </div>

            {/* Credentials Update */}
            <div className="bg-card border border-border p-6 rounded-lg md:col-span-2">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <Settings className="mr-2 h-5 w-5" /> Admin Settings
              </h2>
              {credentialsMessage.text && (
                <div className={`p-3 mb-4 rounded text-xs ${credentialsMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : credentialsMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-muted-foreground'}`}>
                  {credentialsMessage.text}
                </div>
              )}
              <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adminUsername" className="block text-sm font-medium mb-1">Admin Username</label>
                    <input type="text" id="adminUsername" value={credentialsData.username} onChange={(e) => setCredentialsData(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter new username" />
                  </div>
                  <div>
                    <label htmlFor="adminEmail" className="block text-sm font-medium mb-1">Contact Email</label>
                    <input type="email" id="adminEmail" value={credentialsData.email} onChange={(e) => setCredentialsData(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" placeholder="email@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="adminPassword" className="block text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
                    <input type="password" id="adminPassword" value={credentialsData.password} onChange={(e) => setCredentialsData(prev => ({ ...prev, password: e.target.value }))} className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter new password" />
                  </div>
                </div>
                <button type="submit" className="bg-foreground text-background font-medium px-4 py-2 rounded hover:bg-foreground/90 transition-colors self-start">
                  Save Settings
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
                <label htmlFor="projectType" className="block text-sm font-medium mb-1">Project Type *</label>
                <select required id="projectType" name="projectType" value={formData.projectType} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary">
                  <option value="Professional">Professional (Featured)</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Client Website">Client Website</option>
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
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="liveUrl" className="block text-sm font-medium mb-1">Live URL (Optional)</label>
                  <input type="text" id="liveUrl" name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
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
                        <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">{project.projectType || 'Professional'}</span>
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

        {/* Certifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
          {/* Add Certification Form */}
          <div className="lg:col-span-1 bg-card border border-border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Plus className="mr-2 h-5 w-5" /> Add Certification
            </h2>
            
            {certMessage.text && (
              <div className={`p-4 mb-6 rounded text-sm ${certMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {certMessage.text}
              </div>
            )}

            <form onSubmit={handleCertSubmit} className="space-y-4">
              <div>
                <label htmlFor="course" className="block text-sm font-medium mb-1">Course / Certificate Name *</label>
                <input required type="text" id="course" name="course" value={certFormData.course} onChange={handleCertInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label htmlFor="institution" className="block text-sm font-medium mb-1">Institution *</label>
                <input required type="text" id="institution" name="institution" value={certFormData.institution} onChange={handleCertInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">Year *</label>
                <input required type="text" id="year" name="year" value={certFormData.year} onChange={handleCertInputChange} placeholder="2024" className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label htmlFor="certificateUrl" className="block text-sm font-medium mb-1">Certificate Link (Optional)</label>
                <input type="text" id="certificateUrl" name="certificateUrl" value={certFormData.certificateUrl} onChange={handleCertInputChange} placeholder="https://..." className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label htmlFor="certImage" className="block text-sm font-medium mb-1">Or Upload Certificate PDF/Image</label>
                <input type="file" id="certImage" name="certImage" accept="image/*,.pdf" onChange={handleFileChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <button disabled={submittingCert} type="submit" className="w-full bg-foreground text-background font-medium py-2 rounded hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4">
                {submittingCert ? "Saving..." : "Add Certification"}
              </button>
            </form>
          </div>

          {/* Existing Certifications List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Existing Certifications</h2>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : certifications.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
                No certifications found. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center group">
                    <div className="flex-grow">
                      <h3 className="font-bold text-foreground">{cert.course}</h3>
                      <p className="text-sm text-muted-foreground">{cert.institution}</p>
                      <div className="flex gap-2 mt-2 items-center">
                        <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">{cert.year}</span>
                        {cert.certificateUrl && cert.certificateUrl !== "#" && (
                          <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View File/Link</a>
                        )}
                      </div>
                    </div>
                    
                    <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Certification (Not implemented)">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experiences Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
          {/* Add Experience Form */}
          <div className="lg:col-span-1 bg-card border border-border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Plus className="mr-2 h-5 w-5" /> Add Experience
            </h2>
            
            {expMessage.text && (
              <div className={`p-4 mb-6 rounded text-sm ${expMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {expMessage.text}
              </div>
            )}

            <form onSubmit={handleExpSubmit} className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Role (e.g., Ambassador, Graphic Designer) *</label>
                <input required type="text" id="role" name="role" value={expFormData.role} onChange={handleExpInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium mb-1">Organization *</label>
                <input required type="text" id="organization" name="organization" value={expFormData.organization} onChange={handleExpInputChange} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea id="description" name="description" value={expFormData.description} onChange={handleExpInputChange} rows={3} className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label htmlFor="dateJoined" className="block text-sm font-medium mb-1">Date Joined</label>
                <input type="text" id="dateJoined" name="dateJoined" value={expFormData.dateJoined} onChange={handleExpInputChange} placeholder="e.g. Jan 2024" className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label htmlFor="refereeNumber" className="block text-sm font-medium mb-1">Referee Number</label>
                <input type="text" id="refereeNumber" name="refereeNumber" value={expFormData.refereeNumber} onChange={handleExpInputChange} placeholder="e.g. +1234567890" className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>

              <button disabled={submittingExp} type="submit" className="w-full bg-foreground text-background font-medium py-2 rounded hover:bg-foreground/90 transition-colors disabled:opacity-50 mt-4">
                {submittingExp ? "Saving..." : "Add Experience"}
              </button>
            </form>
          </div>

          {/* Existing Experiences List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Existing Experiences</h2>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : experiences.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
                No experiences found. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 items-center group">
                    <div className="flex-grow">
                      <h3 className="font-bold text-foreground">{exp.role}</h3>
                      <p className="text-sm font-semibold text-primary">{exp.organization}</p>
                      {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                        {exp.dateJoined && <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">Joined: {exp.dateJoined}</span>}
                        {exp.refereeNumber && <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">Ref: {exp.refereeNumber}</span>}
                      </div>
                    </div>
                    
                    <button onClick={() => handleDeleteExperience(exp.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Experience">
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
