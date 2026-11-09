"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Monitor, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  ExternalLink,
  Video
} from "lucide-react";
import { Workshop } from "@/lib/learning-hub-types";

interface WorkshopsSectionProps {
  workshops: Workshop[];
  onSelectWorkshop?: (workshopTitle: string) => void;
}

export function WorkshopsSection({ workshops, onSelectWorkshop }: WorkshopsSectionProps) {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const filteredWorkshops = workshops.filter((w) => w.status === tab);

  const handleRegisterClick = (workshop: Workshop) => {
    if (onSelectWorkshop) {
      onSelectWorkshop(workshop.title);
    }
    const el = document.getElementById("contact-registration");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="workshops" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
              Interactive Training
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Workshops & Training Sessions
            </h2>
            <div className="h-1 w-20 bg-primary rounded mb-4" />
            <p className="text-lg text-muted-foreground">
              Peer-led group workshops and hands-on coding clinics. I facilitate both online live labs and physical on-campus training sessions.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex border border-border bg-card p-1 self-start md:self-auto">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                tab === "upcoming"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming Workshops ({workshops.filter((w) => w.status === "upcoming").length})
            </button>
            <button
              onClick={() => setTab("completed")}
              className={`px-5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                tab === "completed"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Previous Activities ({workshops.filter((w) => w.status === "completed").length})
            </button>
          </div>
        </div>

        {/* Workshops List / Grid */}
        {filteredWorkshops.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground">No sessions in this category at this moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon or request a custom training session below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWorkshops.map((workshop) => {
              const isOnline = workshop.format === "Online";
              const isUpcoming = workshop.status === "upcoming";

              return (
                <div
                  key={workshop.id}
                  className="flex flex-col justify-between bg-card border border-border p-6 sm:p-8 rounded-none transition-all hover:border-primary/50 shadow-sm"
                >
                  <div>
                    {/* Format & Status badges */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 border ${
                            isOnline
                              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {isOnline ? (
                            <Monitor className="h-3.5 w-3.5" />
                          ) : (
                            <Users className="h-3.5 w-3.5" />
                          )}
                          {workshop.format} Training
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground border border-border">
                          {workshop.access} Access
                        </span>
                        {workshop.meetUrl && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                            <Video className="h-3 w-3" />
                            Google Meet Ready
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-xs font-medium px-2.5 py-1 ${
                          isUpcoming
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isUpcoming ? "Registration Open" : "Completed Activity"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                      {workshop.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {workshop.description}
                    </p>

                    {/* Schedule & Location Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 border border-border text-xs mb-6">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="truncate">{workshop.location}</span>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5">
                        Key Learning Objectives:
                      </p>
                      <ul className="space-y-1.5 text-xs sm:text-sm">
                        {workshop.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highlight recap for completed sessions */}
                    {workshop.highlightRecap && (
                      <div className="p-3.5 bg-primary/5 border-l-2 border-primary text-xs text-foreground/90 mb-6 flex items-start gap-2.5">
                        <Award className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-primary mb-0.5">Session Outcome</p>
                          <p className="text-muted-foreground">{workshop.highlightRecap}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center gap-3">
                    {isUpcoming ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                        {workshop.meetUrl && (
                          <a
                            href={workshop.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 text-xs sm:text-sm font-medium transition-colors shadow-sm"
                          >
                            <Video className="h-4 w-4" />
                            <span>Join Google Meet</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRegisterClick(workshop)}
                          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium transition-colors ${
                            workshop.meetUrl
                              ? "w-full sm:w-1/2 border border-border bg-card hover:bg-muted text-foreground"
                              : "w-full bg-foreground text-background hover:bg-foreground/90"
                          }`}
                        >
                          <span>{workshop.meetUrl ? "Reserve / Add to Calendar" : "Reserve Your Spot"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <a
                        href="/learning-hub/resources"
                        className="w-full inline-flex items-center justify-center gap-2 bg-muted text-foreground hover:bg-muted/80 py-2.5 px-4 text-sm font-medium border border-border transition-colors"
                      >
                        <span>Access Session Materials</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

