"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Settings, 
  FileText, 
  FolderGit2, 
  Award, 
  Briefcase, 
  Edit, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  LogOut, 
  GraduationCap,
  Layers,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { LearningHubAdmin } from "@/components/admin/LearningHubAdmin";

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
  image: string | null;
  projectType?: string;
  liveUrl?: string;
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
  type?: 'Formal' | 'Freelance';
  role: string;
  organization: string;
  description: string;
  dateJoined?: string;
  refereeNumber?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  link?: string;
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

  const [activeSection, setActiveSection] = useState<'learning-hub' | 'projects' | 'certifications' | 'experiences' | 'settings' | 'all'>('learning-hub');
  const [learningStats, setLearningStats] = useState({ resources: 0, workshops: 0, showcases: 0, projects: 0 });

  const [maintenance, setMaintenance] = useState(false);
  const [learningHubLive, setLearningHubLive] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [aboutTitle, setAboutTitle] = useState("About Me");
  const [aboutContent, setAboutContent] = useState("");
  
  const dataTypes = ["Data Analysis", "Data Science", "Machine Learning", "AI", "Hackathon"];
  
  const sortByDate = (a: Project, b: Project) => {
    const dateA = a.dateCompleted ? new Date(a.dateCompleted).getTime() : parseInt(a.id);
    const dateB = b.dateCompleted ? new Date(b.dateCompleted).getTime() : parseInt(b.id);
    return dateB - dateA;
  };

  const dataProjects = projects
    .filter(p => dataTypes.includes(p.filterCategory) || dataTypes.includes(p.projectType || ''))
    .sort(sortByDate);

  const formalExperiences = experiences.filter(e => e.type !== 'Freelance');
  const freelanceExperiences = experiences
    .filter(e => e.type === 'Freelance')
    .sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    dateCompleted: new Date().toISOString().split('T')[0],
    featured: false,
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
    type: "Formal" as "Formal" | "Freelance",
    role: "",
    organization: "",
    description: "",
    dateJoined: "",
    refereeNumber: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    current: false,
    link: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [certImageFile, setCertImageFile] = useState<File | null>(null);

  // New UI States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null);
  const [certImagePreview, setCertImagePreview] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{visible: boolean, message: string, type: 'success'|'error'}>({visible: false, message: '', type: 'success'});
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, type: 'project'|'cert'|'exp'|null, id: string|null}>({isOpen: false, type: null, id: null});

  const showToast = (message: string, type: 'success'|'error') => {
    setToast({visible: true, message, type});
    setTimeout(() => setToast(prev => ({...prev, visible: false})), 3000);
  };


  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?t=${Date.now()}`, { cache: 'no-store' });
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
      const res = await fetch(`/api/certifications?t=${Date.now()}`, { cache: 'no-store' });
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
      const res = await fetch(`/api/experiences?t=${Date.now()}`, { cache: 'no-store' });
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
      const res = await fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMaintenance(data.maintenance === true);
        setLearningHubLive(data.learningHubLive === true);
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchCredentials = async () => {
    try {
      const res = await fetch(`/api/credentials?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCredentialsData(prev => ({ ...prev, email: data.email || "", username: data.username || "" }));
      }
    } catch (error) {
      console.error('Failed to fetch credentials', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`/api/auth?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.error('Failed to check auth', e);
      }
    };
    checkAuth();
  }, []);

  const fetchLearningStats = async () => {
    try {
      const res = await fetch(`/api/learning-hub?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLearningStats({
          resources: data.resources?.length || 0,
          workshops: data.workshops?.length || 0,
          showcases: data.learnerShowcase?.length || 0,
          projects: data.projects?.length || 0,
        });
      }
    } catch (e) {
      console.error('Failed to fetch learning hub stats', e);
    }
  };

  useEffect(() => {
    fetchProjects();
     
    fetchCertifications();
     
    fetchSettings();
     
    fetchAbout();
     
    fetchExperiences();

    fetchLearningStats();
     
    if (isAuthenticated) fetchCredentials();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.error('Logout error', e);
    }
    setIsAuthenticated(false);
  };

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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCertInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCertFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setExpFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setExpFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      if (e.target.name === 'image') {
        setImageFile(file);
        setProjectImagePreview(previewUrl);
      }
      if (e.target.name === 'cv') setCvFile(file);
      if (e.target.name === 'certImage') {
        setCertImageFile(file);
        setCertImagePreview(previewUrl);
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setActiveSection('projects');
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription || "",
      dateCompleted: project.dateCompleted || new Date().toISOString().split('T')[0],
      featured: project.featured || false,
      category: project.category,
      filterCategory: project.filterCategory,
      technologies: project.technologies.join(', '),
      link: project.link,
      github: project.github,
      liveUrl: project.liveUrl || "",
      projectType: project.projectType || "Professional"
    });
    setProjectImagePreview(project.image);
    // Scroll to form (assuming we have an ID on the section)
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditCert = (cert: Certification) => {
    setActiveSection('certifications');
    setEditingCertId(cert.id);
    setCertFormData({
      institution: cert.institution,
      course: cert.course,
      year: cert.year,
      certificateUrl: cert.certificateUrl
    });
    setCertImagePreview(cert.certificateUrl);
    document.getElementById('certifications-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditExp = (exp: Experience) => {
    setActiveSection('experiences');
    setEditingExpId(exp.id);
    setExpFormData({
      type: exp.type || "Formal",
      role: exp.role,
      organization: exp.organization,
      description: exp.description || "",
      dateJoined: exp.dateJoined || "",
      refereeNumber: exp.refereeNumber || "",
      startDate: exp.startDate || new Date().toISOString().split('T')[0],
      endDate: exp.endDate || "",
      current: exp.current || false,
      link: exp.link || ""
    });
    document.getElementById('experiences-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const confirmDelete = (type: 'project'|'cert'|'exp', id: string) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const executeDelete = async () => {
    const { type, id } = deleteModal;
    if (!type || !id) return;
    
    setDeleteModal({ isOpen: false, type: null, id: null });
    
    try {
      let endpoint = '';
      if (type === 'project') endpoint = '/api/projects';
      if (type === 'cert') endpoint = '/api/certifications';
      if (type === 'exp') endpoint = '/api/experiences';

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        showToast(`Successfully deleted item.`, 'success');
        if (type === 'project') fetchProjects();
        if (type === 'cert') fetchCertifications();
        if (type === 'exp') fetchExperiences();
      } else {
        showToast('Failed to delete item.', 'error');
      }
    } catch {
      showToast('An error occurred during deletion.', 'error');
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

  const handleLearningHubToggle = async () => {
    const newValue = !learningHubLive;
    setLearningHubLive(newValue);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learningHubLive: newValue }),
      });
      if (!res.ok) throw new Error('Request failed');
    } catch (error) {
      console.error('Failed to update Learning Hub visibility', error);
      setLearningHubLive(!newValue); // revert
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
        body: JSON.stringify({ title: aboutTitle, content: aboutContent }),
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
    
    // Basic validation
    if (!certFormData.institution || !certFormData.course || !certFormData.year) {
      setCertMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }
    
    setSubmittingCert(true);
    setCertMessage({ text: "", type: "" });

    const data = new FormData();
    if (editingCertId) data.append('id', editingCertId);
    
    Object.entries(certFormData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    if (certImageFile) {
      data.append('image', certImageFile);
    }

    try {
      const res = await fetch('/api/certifications', {
        method: editingCertId ? 'PUT' : 'POST',
        body: data,
      });

      if (res.ok) {
        showToast(editingCertId ? "Certification updated successfully!" : "Certification added successfully!", 'success');
        setCertFormData({
          institution: "",
          course: "",
          year: "",
          certificateUrl: ""
        });
        setCertImageFile(null);
        setCertImagePreview(null);
        setEditingCertId(null);
        
        const fileInput = document.getElementById('certImage') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchCertifications();
      } else {
        const errData = await res.json();
        setCertMessage({ text: errData.error || "Failed to save certification", type: "error" });
      }
    } catch {
      setCertMessage({ text: "An error occurred", type: "error" });
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!expFormData.role || !expFormData.organization) {
      setExpMessage({ text: "Role and Organization are required.", type: "error" });
      return;
    }
    
    setSubmittingExp(true);
    setExpMessage({ text: "", type: "" });

    const data = new FormData();
    if (editingExpId) data.append('id', editingExpId);
    
    Object.entries(expFormData).forEach(([key, value]) => {
      data.append(key, typeof value === 'boolean' ? String(value) : value);
    });
    
    try {
      const res = await fetch('/api/experiences', {
        method: editingExpId ? 'PUT' : 'POST',
        body: data,
      });

      if (res.ok) {
        showToast(editingExpId ? "Experience updated successfully!" : "Experience added successfully!", 'success');
        setExpFormData({
          type: "Formal",
          role: "",
          organization: "",
          description: "",
          dateJoined: "",
          refereeNumber: "",
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          current: false,
          link: ""
        });
        setEditingExpId(null);
        fetchExperiences();
      } else {
        const errData = await res.json();
        setExpMessage({ text: errData.error || "Failed to save experience", type: "error" });
      }
    } catch {
      setExpMessage({ text: "An error occurred", type: "error" });
    } finally {
      setSubmittingExp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.filterCategory) {
      setMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }
    
    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    if (editingProjectId) data.append('id', editingProjectId);
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, typeof value === 'boolean' ? String(value) : value);
    });
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/projects', {
        method: editingProjectId ? 'PUT' : 'POST',
        body: data,
      });

      if (res.ok) {
        showToast(editingProjectId ? "Project updated successfully!" : "Project added successfully!", 'success');
        setFormData({
          title: "",
          description: "",
          fullDescription: "",
          dateCompleted: new Date().toISOString().split('T')[0],
          featured: false,
          category: "",
          filterCategory: "Data Analysis",
          technologies: "",
          link: "",
          github: "",
          liveUrl: "",
          projectType: "Professional"
        });
        setImageFile(null);
        setProjectImagePreview(null);
        setEditingProjectId(null);
        
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchProjects();
      } else {
        const errData = await res.json();
        setMessage({ text: errData.error || "Failed to save project", type: "error" });
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dashboard Topbar */}
      <header className="bg-slate-900 text-slate-50 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors" title="Back to Portfolio">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400 hidden sm:inline">Logged in as Admin</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="Log out of admin session"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & KPI Summary */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Portfolio & Learning Hub Operations
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Centralized control for student training materials, Google Meet workshops, coursemate showcases, and portfolio projects.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/learning-hub"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Open Learning Hub</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                <span>View Live Site</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            <button
              type="button"
              onClick={() => setActiveSection('learning-hub')}
              className={`p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                activeSection === 'learning-hub'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                <GraduationCap className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 rounded">Hub</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {learningStats.resources + learningStats.workshops}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {learningStats.resources} Notes/PDFs • {learningStats.workshops} Meets
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('projects')}
              className={`p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                activeSection === 'projects'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
                <FolderGit2 className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">Projects</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {projects.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {dataProjects.length} Data & ML Projects
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('certifications')}
              className={`p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                activeSection === 'certifications'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                <Award className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded">Certs</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {certifications.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified Credentials
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('experiences')}
              className={`p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                activeSection === 'experiences'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                <Briefcase className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 rounded">Roles</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {experiences.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {formalExperiences.length} Formal • {freelanceExperiences.length} Freelance
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('settings')}
              className={`p-4 rounded-xl border text-left transition-all hover:shadow-md col-span-2 sm:col-span-1 ${
                activeSection === 'settings'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
                <Settings className="h-5 w-5" />
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  maintenance ? 'bg-red-100 dark:bg-red-900/50 text-red-600' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600'
                }`}>
                  {maintenance ? 'Maintenance' : 'Live'}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {maintenance ? 'Maintenance Mode' : 'Website Online'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                CV & Site Preferences
              </div>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 mb-8 py-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveSection('learning-hub')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSection === 'learning-hub'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Learning Hub Studio</span>
              <span className="px-1.5 py-0.5 bg-indigo-500/30 text-[10px] rounded">
                {learningStats.resources + learningStats.workshops}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('projects')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSection === 'projects'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              <FolderGit2 className="h-4 w-4" />
              <span>Portfolio Projects ({projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('certifications')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSection === 'certifications'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Certifications ({certifications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('experiences')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSection === 'experiences'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Experiences ({experiences.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('settings')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSection === 'settings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings & CV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ml-auto ${
                activeSection === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>View All</span>
            </button>
          </div>
        </div>

        {/* Dedicated Learning Hub Studio */}
        {(activeSection === 'learning-hub' || activeSection === 'all') && (
          <div id="learning-hub-admin-section" className="mb-12">
            <LearningHubAdmin />
          </div>
        )}

        {/* Projects Section */}
        {(activeSection === 'projects' || activeSection === 'all') && (
          <div id="projects-section" className="mb-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projects</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your portfolio projects. Add new projects, edit existing ones, or remove old entries.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Project Form */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl self-start">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                {editingProjectId ? <Edit className="mr-2 h-5 w-5 text-indigo-500" /> : <Plus className="mr-2 h-5 w-5 text-indigo-500" />} 
                {editingProjectId ? 'Edit Project' : 'Add New Project'}
              </h3>
              
              {message.text && (
                <div className={`p-4 mb-6 rounded text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title <span className="text-red-500">*</span></label>
                  <input required type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. E-Commerce Dashboard" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Description <span className="text-red-500">*</span></label>
                  <textarea required id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Brief summary (shown on card). Press Enter twice for a new paragraph." maxLength={2000} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div>
                  <label htmlFor="fullDescription" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Description</label>
                  <textarea id="fullDescription" name="fullDescription" value={formData.fullDescription} onChange={handleInputChange} rows={8} placeholder="Detailed project description. Press Enter twice to start a new paragraph; **text** makes bold." maxLength={10000} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Label <span className="text-red-500">*</span></label>
                    <input required type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Data Science / AI" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                  </div>
                  <div>
                    <label htmlFor="dateCompleted" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Completed</label>
                    <input type="date" id="dateCompleted" name="dateCompleted" value={formData.dateCompleted} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="filterCategory" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Filter <span className="text-red-500">*</span></label>
                    <select required id="filterCategory" name="filterCategory" value={formData.filterCategory} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow">
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="AI">AI</option>
                      <option value="Hackathon">Hackathon</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type <span className="text-red-500">*</span></label>
                    <select required id="projectType" name="projectType" value={formData.projectType} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow">
                      <option value="Professional">Professional</option>
                      <option value="Hackathon">Hackathon</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                  <label htmlFor="featured" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Featured Data Project</label>
                </div>

                <div>
                  <label htmlFor="technologies" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma separated)</label>
                  <input type="text" id="technologies" name="technologies" value={formData.technologies} onChange={handleInputChange} placeholder="Python, React, API" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="link" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Case Study Link</label>
                    <input type="text" id="link" name="link" value={formData.link} onChange={handleInputChange} placeholder="/projects/my-project" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Link</label>
                    <input type="text" id="github" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="liveUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Live URL (Optional)</label>
                    <input type="text" id="liveUrl" name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} placeholder="https://..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Image (Thumbnail)</label>
                  <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400" />
                  {projectImagePreview && (
                    <div className="mt-3 relative h-32 w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
                      <Image src={projectImagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {editingProjectId && (
                    <button type="button" onClick={() => {
                      setEditingProjectId(null);
                      setFormData({ title: "", description: "", fullDescription: "", dateCompleted: new Date().toISOString().split('T')[0], featured: false, category: "", filterCategory: "Data Analysis", technologies: "", link: "", github: "", liveUrl: "", projectType: "Professional" });
                      setProjectImagePreview(null);
                    }} className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                  )}
                  <button disabled={submitting} type="submit" className="flex-[2] flex justify-center items-center bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70">
                    {submitting ? (
                      <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</>
                    ) : editingProjectId ? "Update Project" : "Add Project"}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Projects List */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <FolderGit2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No projects found</h3>
                  <p className="text-slate-500 dark:text-slate-400">Add your first project using the form to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dataProjects.map((project) => (
                    <div key={project.id} className={`bg-white dark:bg-slate-900 border ${project.featured ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-5 flex gap-5 items-center group transition-all hover:shadow-md relative`}>
                      {project.featured && (
                        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10">
                          FEATURED
                        </div>
                      )}
                      <div className="h-20 w-32 bg-slate-100 dark:bg-slate-800 flex-shrink-0 rounded-lg overflow-hidden relative border border-slate-200 dark:border-slate-700">
                        {project.image ? (
                          <Image fill src={project.image} alt={project.title} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400">
                            <FileText className="h-5 w-5 mb-1 opacity-50" />
                            No image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{project.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 mb-2">{project.description}</p>
                        <div className="flex gap-2">
                          {project.dateCompleted && (
                            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">{project.dateCompleted}</span>
                          )}
                          <span className="text-[10px] font-semibold uppercase bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">{project.projectType || 'Professional'}</span>
                          <span className="text-[10px] font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">{project.filterCategory}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleEditProject(project)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Edit Project">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => confirmDelete('project', project.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Project">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Certifications Section */}
        {(activeSection === 'certifications' || activeSection === 'all') && (
          <div id="certifications-section" className="mb-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Certifications</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your certifications, courses, and educational achievements.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Certification Form */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl self-start">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                {editingCertId ? <Edit className="mr-2 h-5 w-5 text-indigo-500" /> : <Plus className="mr-2 h-5 w-5 text-indigo-500" />} 
                {editingCertId ? 'Edit Certification' : 'Add Certification'}
              </h3>
              
              {certMessage.text && (
                <div className={`p-4 mb-6 rounded text-sm flex items-center gap-2 ${certMessage.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                  {certMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {certMessage.text}
                </div>
              )}

              <form onSubmit={handleCertSubmit} className="space-y-4">
                <div>
                  <label htmlFor="course" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Course / Certificate Name <span className="text-red-500">*</span></label>
                  <input required type="text" id="course" name="course" value={certFormData.course} onChange={handleCertInputChange} placeholder="e.g. AWS Cloud Practitioner" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div>
                  <label htmlFor="institution" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution <span className="text-red-500">*</span></label>
                  <input required type="text" id="institution" name="institution" value={certFormData.institution} onChange={handleCertInputChange} placeholder="e.g. Amazon Web Services" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Year <span className="text-red-500">*</span></label>
                  <input required type="text" id="year" name="year" value={certFormData.year} onChange={handleCertInputChange} placeholder="2024" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>

                <div>
                  <label htmlFor="certificateUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Certificate Link (Optional)</label>
                  <input type="text" id="certificateUrl" name="certificateUrl" value={certFormData.certificateUrl} onChange={handleCertInputChange} placeholder="https://..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>

                <div>
                  <label htmlFor="certImage" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload Certificate File</label>
                  <input type="file" id="certImage" name="certImage" accept="image/*,.pdf" onChange={handleFileChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400" />
                  {certImagePreview && !certImagePreview.endsWith('.pdf') && (
                    <div className="mt-3 relative h-32 w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
                      <Image src={certImagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {editingCertId && (
                    <button type="button" onClick={() => {
                      setEditingCertId(null);
                      setCertFormData({ institution: "", course: "", year: "", certificateUrl: "" });
                      setCertImagePreview(null);
                    }} className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                  )}
                  <button disabled={submittingCert} type="submit" className="flex-[2] flex justify-center items-center bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70">
                    {submittingCert ? (
                      <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</>
                    ) : editingCertId ? "Update Certification" : "Add Certification"}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Certifications List */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : certifications.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <Award className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No certifications found</h3>
                  <p className="text-slate-500 dark:text-slate-400">Add your first certification using the form to get started.</p>
                </div>
              ) : (
                certifications.map((cert) => (
                  <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex gap-4 items-center group transition-all hover:shadow-md">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{cert.course}</h3>
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{cert.institution}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Achieved in {cert.year}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleEditCert(cert)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Edit Certification">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => confirmDelete('cert', cert.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Certification">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        )}

        {/* Experiences Section */}
        {(activeSection === 'experiences' || activeSection === 'all') && (
          <div id="experiences-section" className="mb-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Experience</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your work history, ambassador roles, and volunteer experiences.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Experience Form */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl self-start">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                {editingExpId ? <Edit className="mr-2 h-5 w-5 text-indigo-500" /> : <Plus className="mr-2 h-5 w-5 text-indigo-500" />} 
                {editingExpId ? 'Edit Experience' : 'Add Experience'}
              </h3>
              
              {expMessage.text && (
                <div className={`p-4 mb-6 rounded text-sm flex items-center gap-2 ${expMessage.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                  {expMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {expMessage.text}
                </div>
              )}

              <form onSubmit={handleExpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience Type <span className="text-red-500">*</span></label>
                  <select required id="type" name="type" value={expFormData.type} onChange={handleExpInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow">
                    <option value="Formal">Formal Experience</option>
                    <option value="Freelance">Freelance & Client Works (Websites, Contracts)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Role / Title <span className="text-red-500">*</span></label>
                  <input required type="text" id="role" name="role" value={expFormData.role} onChange={handleExpInputChange} placeholder={expFormData.type === 'Formal' ? "e.g. Data Analyst" : "e.g. Website Developer / UI Designer"} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization <span className="text-red-500">*</span></label>
                  <input required type="text" id="organization" name="organization" value={expFormData.organization} onChange={handleExpInputChange} placeholder={expFormData.type === 'Formal' ? "e.g. Google" : "e.g. Client Name / Business Name"} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea id="description" name="description" value={expFormData.description} onChange={handleExpInputChange} rows={6} placeholder="Key responsibilities. Press Enter twice for a new paragraph." maxLength={10000} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                </div>
                
                {expFormData.type === 'Formal' ? (
                  <>
                    <div>
                      <label htmlFor="dateJoined" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Joined</label>
                      <input type="text" id="dateJoined" name="dateJoined" value={expFormData.dateJoined} onChange={handleExpInputChange} placeholder="e.g. Jan 2024 - Present" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>

                    <div>
                      <label htmlFor="refereeNumber" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Referee Contact</label>
                      <input type="text" id="refereeNumber" name="refereeNumber" value={expFormData.refereeNumber} onChange={handleExpInputChange} placeholder="e.g. +1234567890" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                        <input type="date" id="startDate" name="startDate" value={expFormData.startDate} onChange={handleExpInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                        <input type="date" id="endDate" name="endDate" value={expFormData.endDate} onChange={handleExpInputChange} disabled={expFormData.current} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow disabled:opacity-50" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="current" name="current" checked={expFormData.current} onChange={handleExpInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                      <label htmlFor="current" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currently ongoing (Present)</label>
                    </div>

                    <div>
                      <label htmlFor="link" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Client Website / Project URL</label>
                      <input type="text" id="link" name="link" value={expFormData.link} onChange={handleExpInputChange} placeholder="https://client-website.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  {editingExpId && (
                    <button type="button" onClick={() => {
                      setEditingExpId(null);
                      setExpFormData({
                        type: "Formal",
                        role: "",
                        organization: "",
                        description: "",
                        dateJoined: "",
                        refereeNumber: "",
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: "",
                        current: false,
                        link: ""
                      });
                    }} className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                  )}
                  <button disabled={submittingExp} type="submit" className="flex-[2] flex justify-center items-center bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70">
                    {submittingExp ? (
                      <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</>
                    ) : editingExpId ? "Update Experience" : "Add Experience"}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Experiences List */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : experiences.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No experiences found</h3>
                  <p className="text-slate-500 dark:text-slate-400">Add your first experience using the form to get started.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Formal Experience</h3>
                    <div className="space-y-4">
                      {formalExperiences.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 italic">No formal experiences yet.</p>
                      ) : (
                        formalExperiences.map((exp) => (
                          <div key={exp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex gap-4 items-center group transition-all hover:shadow-md">
                            <div className="flex-grow">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{exp.role}</h3>
                              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{exp.organization}</p>
                              {exp.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{exp.description}</p>}
                              <div className="flex flex-wrap gap-2 mt-3 items-center">
                                {exp.dateJoined && <span className="text-[10px] font-semibold uppercase bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">Joined: {exp.dateJoined}</span>}
                                {exp.refereeNumber && <span className="text-[10px] font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">Ref: {exp.refereeNumber}</span>}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <button onClick={() => handleEditExp(exp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Edit Experience">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button onClick={() => confirmDelete('exp', exp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Experience">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Freelance & Client Works</h3>
                    <div className="space-y-4">
                      {freelanceExperiences.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 italic">No freelance experiences yet.</p>
                      ) : (
                        freelanceExperiences.map((exp) => (
                          <div key={exp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex gap-4 items-center group transition-all hover:shadow-md">
                            <div className="flex-grow">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{exp.role}</h3>
                              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{exp.organization}</p>
                              {exp.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{exp.description}</p>}
                              <div className="flex flex-wrap gap-2 mt-3 items-center">
                                {exp.startDate && <span className="text-[10px] font-semibold uppercase bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>}
                                {exp.link && <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-blue-600 hover:underline">Link</a>}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <button onClick={() => handleEditExp(exp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Edit Experience">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button onClick={() => confirmDelete('exp', exp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Experience">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Site Settings & CV Section */}
        {(activeSection === 'settings' || activeSection === 'all') && (
          <div id="settings-section" className="mb-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Settings className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Site Settings & CV</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Manage website maintenance mode, upload your latest curriculum vitae, edit the homepage about biography, and update admin credentials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Maintenance Mode */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center mb-1">
                    <Settings className="mr-2 h-5 w-5" /> Maintenance Mode
                  </h3>
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

              {/* Learning Hub visibility */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center mb-1">
                    <BookOpen className="mr-2 h-5 w-5" /> Learning Hub: {learningHubLive ? 'Live' : 'Stay Tuned'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {learningHubLive
                      ? 'Visitors can see all learning hub content.'
                      : 'Visitors see a "Stay tuned" page with hints only. Your content stays hidden until you switch this on.'}
                  </p>
                </div>
                <button
                  onClick={handleLearningHubToggle}
                  aria-label="Toggle Learning Hub visibility"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    learningHubLive ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                      learningHubLive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* CV Upload */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-bold flex items-center mb-4">
                  <FileText className="mr-2 h-5 w-5" /> Update CV / Resume
                </h3>
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
                  <button type="submit" disabled={!cvFile} className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    Upload
                  </button>
                </form>
              </div>

              {/* About Section Editor */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl md:col-span-2">
                <h3 className="text-lg font-bold flex items-center mb-4">
                  <FileText className="mr-2 h-5 w-5" /> Edit About Section
                </h3>
                {aboutMessage.text && (
                  <div className={`p-3 mb-4 rounded text-xs ${aboutMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : aboutMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-muted-foreground'}`}>
                    {aboutMessage.text}
                  </div>
                )}
                <form onSubmit={handleAboutSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="aboutTitle" className="block text-sm font-medium mb-1">Section Title</label>
                    <input type="text" id="aboutTitle" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" placeholder="e.g. About Me" />
                  </div>
                  <div>
                    <label htmlFor="aboutContent" className="block text-sm font-medium mb-1">About Me Text (Supports **bold**)</label>
                    <textarea id="aboutContent" rows={12} value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} maxLength={20000} placeholder="Write your about text. Press Enter twice to start a new paragraph. Use **double asterisks** for bold." className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary resize-y" />
                    <p className="text-xs text-muted-foreground mt-1">Tip: press Enter twice to leave a blank line between paragraphs. Wrap words in **double asterisks** to make them bold.</p>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors self-start">
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Credentials Update */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl md:col-span-2">
                <h3 className="text-lg font-bold flex items-center mb-4">
                  <Settings className="mr-2 h-5 w-5" /> Admin Security Settings
                </h3>
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
                  <button type="submit" className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors self-start">
                    Save Settings
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Toast Notification */}
      <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${toast.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
          <button onClick={() => setToast(prev => ({...prev, visible: false}))} className="ml-2 text-current opacity-70 hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-red-600 dark:text-red-500">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Confirm Deletion</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Are you sure you want to delete this {deleteModal.type === 'project' ? 'project' : deleteModal.type === 'cert' ? 'certification' : 'experience'}? This action cannot be undone.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setDeleteModal({isOpen: false, type: null, id: null})} className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">
                Cancel
              </button>
              <button onClick={executeDelete} className="px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
