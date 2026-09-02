"use client";

import { GraduationCap, Award, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

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

export function ExperienceSection() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loadingExps, setLoadingExps] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch('/api/certifications');
        if (res.ok) {
          const data = await res.json();
          setCertifications(data);
        }
      } catch (error) {
        console.error('Failed to fetch certifications', error);
      } finally {
        setLoadingCerts(false);
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
      } finally {
        setLoadingExps(false);
      }
    };

    fetchCertifications();
    fetchExperiences();
  }, []);
  const skillCategories = [
    {
      title: "Data Analysis",
      skills: ["Python", "Pandas", "NumPy", "Excel", "R", "SPSS", "STATA"]
    },
    {
      title: "Data Visualization",
      skills: ["Matplotlib", "Plotly", "Excel Dashboards"]
    },
    {
      title: "Data Science",
      skills: ["Statistics", "Exploratory Data Analysis", "Predictive Analytics", "Statistical Modeling", "Feature Engineering", "Scikit-learn"]
    },
    {
      title: "Machine Learning",
      skills: ["Supervised Learning", "Unsupervised Learning", "Regression", "Classification", "Model Evaluation"]
    },
    {
      title: "Data & Development",
      skills: ["SQL", "PostgreSQL", "Streamlit", "Git", "GitHub"]
    }
  ];

  const education = [
    {
      institution: "Chuka University",
      degree: "Economics and Statistics",
      focus: "Foundation in statistical analysis, economic theory, and quantitative methods.",
    }
  ];

  return (
    <section id="experience" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Work History Section */}
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" /> Work History
          </h2>
          <div className="h-1 w-20 bg-primary rounded" />
        </div>

        {loadingExps ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
            No experiences listed yet.
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mb-20">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-card border border-border p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-lg font-semibold text-primary mt-1">{exp.organization}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      Joined: {exp.dateJoined}
                    </p>
                    {exp.refereeNumber && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Ref: {exp.refereeNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 text-muted-foreground whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        <div className="max-w-4xl mt-20 mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Technical Skills
          </h2>
          <div className="h-1 w-20 bg-primary rounded" />
        </div>

        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-card border border-border p-6 rounded-none"
            >
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIndex) => (
                  <span 
                    key={sIndex}
                    className="px-3 py-1 bg-muted border border-border text-foreground text-sm font-medium rounded-none hover:bg-foreground hover:text-background transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education and Certifications Section */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-border">
          
          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Education</h2>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-card border border-border p-6 rounded-none"
                >
                  <h3 className="text-xl font-bold text-foreground">{edu.institution}</h3>
                  <p className="text-lg font-medium text-primary mb-2">{edu.degree}</p>
                  <p className="text-muted-foreground">{edu.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-8 w-8 text-foreground" />
              <h2 className="text-3xl font-bold text-foreground">Certifications</h2>
            </div>
            
            {loadingCerts ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : certifications.length === 0 ? (
              <div className="text-muted-foreground p-4 bg-card border border-border rounded-none text-sm text-center">
                No certifications added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-card border border-border p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-foreground">{cert.course}</h3>
                      <p className="text-sm text-muted-foreground">{cert.institution}</p>
                      {cert.certificateUrl && cert.certificateUrl !== "#" && (
                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">
                          View Certificate
                        </a>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-muted border border-border rounded-none w-fit">
                      {cert.year}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
