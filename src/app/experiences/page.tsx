"use client";

import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

interface Experience {
  id: string;
  role: string;
  organization: string;
  description: string;
  dateJoined: string;
  refereeNumber: string;
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">Experiences</h1>
        <p className="text-muted-foreground mb-12">My roles and professional experiences</p>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
            No experiences listed yet.
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-card border border-border p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" /> {exp.role}
                    </h2>
                    <p className="text-lg font-semibold text-primary mt-1">{exp.organization}</p>
                  </div>
                  {exp.dateJoined && (
                    <span className="text-sm font-medium bg-muted px-3 py-1 rounded text-muted-foreground">
                      Joined: {exp.dateJoined}
                    </span>
                  )}
                </div>
                
                {exp.description && (
                  <p className="text-muted-foreground mt-4 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
                
                {exp.refereeNumber && (
                  <div className="mt-6 pt-4 border-t border-border/50 text-sm">
                    <span className="text-muted-foreground">Referee/Reference: </span>
                    <span className="font-medium text-foreground">{exp.refereeNumber}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
